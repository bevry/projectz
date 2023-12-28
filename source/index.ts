/* eslint key-spacing:0 */

// builtin
import { resolve, join, dirname } from 'node:path'

// external
import type { BadgesField } from 'badges'
import trimEmptyKeys from 'trim-empty-keys'
import arrangePackageData from 'arrange-package-json'
import list from '@bevry/fs-list'
import read from '@bevry/fs-read'
import write from '@bevry/fs-write'
import { readJSON, writeJSON } from '@bevry/json'
import { isString, isPlainObject, isEmptyPlainObject } from 'typechecker'
import {
	getGitHubSlugFromPackageData,
	getBackers,
	renderBackers,
	BackersRenderFormat,
	getRepositoryWebsiteUrlFromGitHubSlugOrUrl,
	getRepositoryIssuesUrlFromGitHubSlugOrUrl,
	getRepositoryUrlFromGitHubSlugOrUrl,
} from '@bevry/github-api'
import { mh1, trim } from '@bevry/render'

// local
import type {
	FilenamesForPackageFiles,
	FilenamesForReadmeFiles,
	DataForReadmeFiles,
	DataForPackageFiles,
	Github,
	PackageEnhanced,
	Editions,
	EnhancedPackageDataWithGitHub,
	EnhancedReadmeData,
	EnhancedPackageData,
} from './types.js'
export * from './types.js'
import {
	getContributeSection,
	getBackersFile,
	getBackersSection,
} from './backer.js'
import { getBadgesSection } from './badge.js'
import { getHistorySection } from './history.js'
import { getInstallInstructions } from './install.js'
import { getLicenseFile, getLicenseSection } from './license.js'
import { replaceSection } from './util.js'

/** Projectz, use to merge data files and render meta files. */
export class Projectz {
	/** The log function to use, first argument being the log level */
	readonly log: Function = function () {}

	/** The directory to process, defaults to the current working directory*/
	readonly cwd: string

	/** If enabled, then remote updates will be not performed (such as fetching latest backers). */
	readonly offline: boolean = false

	/**
	 * Resolved absolute paths for the package files.
	 * Should be arranged in the order of merging preference.
	 */
	protected readonly filenamesForPackageFiles: FilenamesForPackageFiles = {
		component: null,
		bower: null,
		jquery: null,
		package: null,
		projectz: null,
	}

	/** Resolved data for the package files */
	protected readonly dataForPackageFiles: DataForPackageFiles = {}

	/** Resolved absolute paths for the readme files */
	protected readonly filenamesForReadmeFiles: FilenamesForReadmeFiles = {
		// gets filled in with relative paths
		readme: null,
		history: null,
		contributing: null,
		backers: null,
		license: null,
	}

	/** Resolved data for the readme files */
	protected readonly dataForReadmeFiles: DataForReadmeFiles = {}

	/** Configure our instance. */
	constructor(opts: Partial<Pick<Projectz, 'cwd' | 'offline' | 'log'>> = {}) {
		this.cwd = resolve(opts.cwd || '.')
		this.offline = opts.offline || false
		if (opts.log) this.log = opts.log
	}

	/** Use the configuration to compile the project. */
	public async compile() {
		await this.loadPaths()

		const enhancedPackageData = await this.enhanceDataForPackageFiles()

		const enhancedReadmeData =
			await this.enhanceDataForReadmeFiles(enhancedPackageData)

		await this.save(enhancedPackageData, enhancedReadmeData)
	}

	/** Resolve the paths and metdata for the data and meta files. */
	protected async loadPaths() {
		// Apply our determined paths for packages
		const packageFiles = Object.keys(this.filenamesForPackageFiles)
		const readmeFiles = Object.keys(this.filenamesForReadmeFiles)

		// Load
		const files = await list(this.cwd)
		for (const file of files) {
			const filePath = join(this.cwd, file)

			for (const key of packageFiles) {
				const basename = file.toLowerCase().split('.').slice(0, -1).join('.')
				if (basename === key) {
					this.log('info', `Reading package file: ${filePath}`)
					const data = await readJSON<Record<string, any>>(filePath)
					this.filenamesForPackageFiles[key] = file
					this.dataForPackageFiles[key] = data
				}
			}

			for (const key of readmeFiles) {
				if (file.toLowerCase().startsWith(key)) {
					this.log('info', `Reading meta file: ${filePath}`)
					const data = await read(filePath)
					this.filenamesForReadmeFiles[key] = file
					this.dataForReadmeFiles[key] = data.toString()
				}
			}
		}
	}

	/** Merge and enhance the data for the package files. */
	protected async enhanceDataForPackageFiles(): Promise<EnhancedPackageData> {
		// ----------------------------------
		// Combine

		this.log('debug', 'Enhancing packages data')

		// Combine the package data
		const mergedPackageData: any = {
			keywords: [],
			editions: [],
			badges: {
				list: [],
				config: {},
			},
			bugs: {},
			readmes: {},
			packages: {},
			repository: {},
			github: {},
			dependencies: {},
			devDependencies: {},
		}
		for (const key of Object.keys(this.filenamesForPackageFiles)) {
			Object.assign(mergedPackageData, this.dataForPackageFiles[key])
		}

		// ----------------------------------
		// Validation

		// Validate keywords field
		if (isString(mergedPackageData.keywords)) {
			throw new Error('projectz: keywords field must be array instead of CSV')
		}

		// Validate people fields
		for (const soloField of [
			'maintainer',
			'contributor',
			'sponsor',
			'funder',
			'backer',
		]) {
			const pluralField = `${soloField}s`
			if (mergedPackageData[soloField]) {
				throw new Error(
					`projectz: ${soloField} field is deprecated, use ${pluralField} field`,
				)
			}
			if (isString(mergedPackageData[pluralField])) {
				throw new Error(
					`projectz: ${pluralField} field must be array instead of CSV`,
				)
			}
		}

		// Validate license SPDX string
		if (isPlainObject(mergedPackageData.license)) {
			throw new Error(
				'projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license',
			)
		}
		if (isPlainObject(mergedPackageData.licenses)) {
			throw new Error(
				'projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license',
			)
		}

		// Validate enhanced fields
		for (const field of ['badges', 'readmes', 'packages', 'github', 'bugs']) {
			if (!isPlainObject(mergedPackageData[field])) {
				throw new Error(`projectz: ${field} field must be an object`)
			}
		}

		// Validate package values
		for (const [key, value] of Object.entries(mergedPackageData.packages)) {
			if (!isPlainObject(value)) {
				throw new Error(
					`projectz: custom package data for package ${key} must be an object`,
				)
			}
		}

		// Validate badges field
		if (
			!Array.isArray(mergedPackageData.badges.list) ||
			(mergedPackageData.badges.config &&
				!isPlainObject(mergedPackageData.badges.config))
		) {
			throw new Error(
				'projectz: badges field must be in the format of: {list: [], config: {}}\nSee https://github.com/bevry/badges for details.',
			)
		}
		mergedPackageData.badges.config ??= {}

		// ----------------------------------
		// Ensure

		// Ensure repository is an object
		if (typeof mergedPackageData.repository === 'string') {
			mergedPackageData.repository = {
				type: 'git',
				url: mergedPackageData.repository,
			}
		}

		// Fallback name
		if (!mergedPackageData.name) {
			mergedPackageData.name = dirname(this.cwd)
		}

		// Fallback version
		if (!mergedPackageData.version) {
			mergedPackageData.version = '0.1.0'
		}

		// Fallback demo field, by scanning homepage
		if (!mergedPackageData.demo && mergedPackageData.homepage) {
			mergedPackageData.demo = mergedPackageData.homepage
		}

		// Fallback title from name
		if (!mergedPackageData.title) {
			mergedPackageData.title = mergedPackageData.name
		}

		// Fallback description
		if (!mergedPackageData.description) {
			mergedPackageData.description = 'no description was provided'
		}

		// Fallback browsers field, by checking if `component` or `bower` package files exists, or if the `browser` or `jspm` fields are defined
		if (mergedPackageData.browsers == null) {
			mergedPackageData.browsers = Boolean(
				this.filenamesForPackageFiles.bower ||
					this.filenamesForPackageFiles.component ||
					mergedPackageData.browser ||
					mergedPackageData.jspm,
			)
		}

		// ----------------------------------
		// Enhance Repository

		// Converge and extract repository information
		let github: Github | undefined
		if (mergedPackageData.repository) {
			const githubSlug = getGitHubSlugFromPackageData(mergedPackageData)
			if (githubSlug) {
				// Extract parts
				const [githubUsername, githubRepository] = githubSlug.split('/')
				const githubRepositoryWebsiteUrl =
					getRepositoryWebsiteUrlFromGitHubSlugOrUrl(githubSlug) || ''
				const githubRepositoryUrl =
					getRepositoryUrlFromGitHubSlugOrUrl(githubSlug) || ''
				const githubIssuesUrl =
					getRepositoryIssuesUrlFromGitHubSlugOrUrl(githubSlug) || ''

				// Github data
				github = {
					username: githubUsername,
					repository: githubRepository,
					slug: githubSlug,
					url: githubRepositoryWebsiteUrl,
					repositoryUrl: githubRepositoryUrl,
				}

				// Badges
				Object.assign(mergedPackageData.badges.config, {
					githubUsername,
					githubRepository,
					githubSlug,
				})

				// Fallback bugs field by use of slug
				if (!mergedPackageData.bugs) {
					mergedPackageData.bugs = githubIssuesUrl
				}

				// Fallback repository field by use of slug
				if (!mergedPackageData.repository?.url) {
					mergedPackageData.repository = {
						type: 'git',
						url: githubRepositoryUrl,
					}
				}
			}
		}

		// ----------------------------------
		// Enhance Backers

		const backers = await getBackers({
			githubSlug: github?.slug,
			packageData: mergedPackageData,
			offline: this.offline,
		})
		const renderedBackersForPackage = await renderBackers(backers, {
			format: BackersRenderFormat.string,
		})

		// ----------------------------------
		// Enhance Packages

		// Create the data for the `package.json` format
		const pkg: PackageEnhanced = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.package || {},

			// Enhanced Data
			{
				// meta
				name: mergedPackageData.name,
				version: mergedPackageData.version,
				license: mergedPackageData.license,
				description: mergedPackageData.description,
				repository: mergedPackageData.repository,
				bugs: mergedPackageData.bugs,
				keywords: mergedPackageData.keywords,
				// code
				engines: mergedPackageData.engines,
				dependencies: mergedPackageData.dependencies,
				devDependencies: mergedPackageData.devDependencies,
				main: mergedPackageData.main,
			},

			// Enhanced Backers
			renderedBackersForPackage,

			// Explicit data
			mergedPackageData.packages.package || {},
		)

		// Trim
		// @ts-ignore
		if (isEmptyPlainObject(pkg.dependencies)) delete pkg.dependencies
		// @ts-ignore
		if (isEmptyPlainObject(pkg.devDependencies)) delete pkg.devDependencies

		// Badges
		if (!mergedPackageData.badges.config.npmPackageName && pkg.name) {
			mergedPackageData.badges.config.npmPackageName = pkg.name
		}

		// Create the data for the `jquery.json` format, which is essentially the same as the `package.json` format so just extend that
		const jquery = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.jquery || {},

			// Enhanced Data
			pkg,

			// Explicit data
			mergedPackageData.packages.jquery || {},
		)

		// Create the data for the `component.json` format
		const component = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.component || {},

			// Enhanced Data
			{
				name: mergedPackageData.name,
				version: mergedPackageData.version,
				license: mergedPackageData.license,
				description: mergedPackageData.description,
				keywords: mergedPackageData.keywords,
				demo: mergedPackageData.demo,
				main: mergedPackageData.main,
				scripts: [mergedPackageData.main],
			},

			// Explicit data
			mergedPackageData.packages.component || {},
		)

		// Create the data for the `bower.json` format
		const bower = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.bower || {},

			// Enhanced Data
			{
				name: mergedPackageData.name,
				version: mergedPackageData.version,
				license: mergedPackageData.license,
				description: mergedPackageData.description,
				keywords: mergedPackageData.keywords,
				authors: mergedPackageData.authors,
				main: mergedPackageData.main,
			},

			// Explicit data
			mergedPackageData.packages.bower || {},
		)

		// ----------------------------------
		// Enhance Combination

		// only stored in memory
		const enhancedPackageData: EnhancedPackageData = Object.assign(
			{},
			mergedPackageData as {
				name: string
				title: string
				version: string
				description: string
				browsers: boolean
				keywords: string[]
				editions: Editions
				badges: BadgesField
				readmes: Record<string, any>
				projectz: Record<string, any>
				packages: Record<string, any>
				dependencies: Record<string, string>
				devDependencies: Record<string, string>
			},
			backers,
			{
				// Add paths so that our helpers have access to them
				filenamesForPackageFiles: this.filenamesForPackageFiles,
				filenamesForReadmeFiles: this.filenamesForReadmeFiles,

				// Other
				github,

				// Create the data for the `package.json` format
				package: pkg,
				jquery,
				component,
				bower,
			},
		)

		// Return
		return enhancedPackageData
	}

	/** Merge and enhance the metadata from the meta files. */
	protected async enhanceDataForReadmeFiles(data: EnhancedPackageData) {
		const enhancedReadmeData: EnhancedReadmeData = {}

		/* eslint prefer-const: 0 */
		for (let [key, value] of Object.entries(this.dataForReadmeFiles)) {
			if (!value) {
				this.log('debug', `Enhancing readme value: ${key} — skipped`)
				continue
			}
			value = replaceSection(['TITLE', 'NAME'], value, mh1(data.title))
			value = replaceSection(
				['BADGES', 'BADGE'],
				value,
				getBadgesSection.bind(null, data),
			)
			value = replaceSection(['DESCRIPTION'], value, data.description)
			value = replaceSection(
				['INSTALL'],
				value,
				getInstallInstructions.bind(null, data),
			)
			value = replaceSection(
				['CONTRIBUTE', 'CONTRIBUTING'],
				value,
				data.github
					? getContributeSection.bind(
							null,
							data as EnhancedPackageDataWithGitHub,
						)
					: '<!-- github projects only -->',
				Boolean(value.includes('BACKERS --')),
			)
			value = replaceSection(
				['BACKERS', 'BACKER', 'PEOPLE'],
				value,
				data.github
					? getBackersSection.bind(null, data as EnhancedPackageDataWithGitHub)
					: '<!-- github projects only -->',
			)
			value = replaceSection(
				['BACKERSFILE', 'BACKERFILE', 'PEOPLEFILE'],
				value,
				data.github
					? getBackersFile.bind(null, data as EnhancedPackageDataWithGitHub)
					: '<!-- github projects only -->',
			)
			value = replaceSection(
				['HISTORY', 'CHANGES', 'CHANGELOG'],
				value,
				data.github
					? getHistorySection.bind(null, data as EnhancedPackageDataWithGitHub)
					: '<!-- github projects only -->',
			)
			value = replaceSection(
				['LICENSE', 'LICENSES'],
				value,
				data.github
					? getLicenseSection.bind(null, data as EnhancedPackageDataWithGitHub)
					: '<!-- github projects only -->',
			)
			value = replaceSection(
				['LICENSEFILE'],
				value,
				getLicenseFile.bind(null, data),
			)
			enhancedReadmeData[key] = value.replaceAll('-->\n\n\n<!--', '-->\n\n<!--')
			this.log('info', `Enhanced readme value: ${key}`)
		}
		return enhancedReadmeData
	}

	/** Save the data and meta files with our enhancements. */
	protected async save(
		enhancedPackageData: EnhancedPackageData,
		enhancedReadmeData: EnhancedReadmeData,
	) {
		// Prepare
		this.log('info', 'Writing changes...')

		await Promise.all([
			// save package files
			...Object.entries(this.filenamesForPackageFiles).map(
				async ([key, filename]) => {
					if (!filename || key === 'projectz') return
					const filepath = join(this.cwd, filename)
					this.log('info', `Saving package file: ${filepath}`)
					const data = trimEmptyKeys(
						arrangePackageData(enhancedPackageData[key]),
					)
					return writeJSON(filepath, data)
				},
			),
			// save readme files
			...Object.entries(this.filenamesForReadmeFiles).map(
				async ([key, filename]) => {
					if (!filename) return
					const filepath = join(this.cwd, filename)
					this.log('info', `Saving readme file: ${filepath}`)
					const content = trim(enhancedReadmeData[key]) + '\n'
					return write(filepath, content)
				},
			),
		])

		// log
		this.log('info', 'Wrote changes')
	}
}
