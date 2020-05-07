/* eslint key-spacing:0 */

// Imports
// First we need to import the libraries we require.

// Load in the file system libraries
import { promises as fsPromises } from 'fs'
const { readdir, readFile, writeFile } = fsPromises
import { resolve, join, dirname } from 'path'

// CSON is used for loading in our configuration files
import { parse as parseCSON } from 'cson-safe'

// [TypeChecker](https://github.com/bevry/typechecker) is used for checking data types
import { isString, isPlainObject } from 'typechecker'

// Load in our other project files
import Person from 'fellow'
import {
	getContributeSection,
	getBackerFile,
	getBackerSection,
} from './backer.js'
import { getBadgesSection } from './badge.js'
import { getHistorySection } from './history.js'
import { getInstallInstructions } from './install.js'
import { getLicenseFile, getLicenseSection } from './license.js'
import {
	getGithubSlug,
	getPeopleTextArray,
	replaceSection,
	trim,
} from './util.js'

// Types
import type {
	FilenamesForPackageFiles,
	FilenamesForReadmeFiles,
	DataForReadmeFiles,
	DataForPackageFiles,
	EnhancedPackagesData,
	Github,
	PackageEnhanced,
	Editions,
	EnhancedPackagesDataWithGitHub,
	EnhancedReadmesData,
} from './types.js'
import type { BadgesField, BadgesConfig } from 'badges'

async function parseFile<T extends any>(path: string): Promise<T> {
	const str = await readFile(path, 'utf-8')
	const data = parseCSON(str)
	return data
}

interface Options {
	/** the directory that we wish to do our work on, defaults to `process.cwd()` */
	cwd?: string
	/** the log function to use, first argument being the log level */
	log?: Function
}

// Definition
// Projects is defined as a class to ensure we can run multiple instances of it
export class Projectz {
	/** our log function to use (logLevel, ...messages) */
	protected readonly log: Function = function () {}

	/** the current working directory (the path) that projectz is working on */
	protected readonly cwd: string

	/**
	 * The absolute paths for all the package files.
	 * Should be arranged in the order of merging preference.
	 */
	protected readonly filenamesForPackageFiles: FilenamesForPackageFiles = {
		component: null,
		bower: null,
		jquery: null,
		package: null,
		projectz: null,
	}

	/** the data for each of our package files */
	protected readonly dataForPackageFiles: DataForPackageFiles = {}

	/** the absolute paths for all the meta files */
	protected readonly filenamesForReadmeFiles: FilenamesForReadmeFiles = {
		// gets filled in with relative paths
		readme: null,
		history: null,
		contributing: null,
		backers: null,
		license: null,
	}

	/** the data for each of our readme files */
	protected readonly dataForReadmeFiles: DataForReadmeFiles = {}

	// Apply options
	constructor(opts: Options) {
		this.cwd = opts.cwd ? resolve(opts.cwd) : process.cwd()
		if (opts.log) this.log = opts.log
	}

	/** Compile the project */
	public async compile() {
		// Load readme and package data
		await this.loadPaths()

		// Enhance our package data
		const enhancedPackagesData = await this.enhancePackagesData()

		// Enhance our readme data
		const enhancedReadmesData = await this.enhanceReadmesData(
			enhancedPackagesData
		)

		// Save
		await this.save(enhancedPackagesData, enhancedReadmesData)
	}

	/** Load in the paths we have specified */
	protected async loadPaths() {
		// Apply our determined paths for packages
		const packages = Object.keys(this.filenamesForPackageFiles)
		const ReadmeFiles = Object.keys(this.filenamesForReadmeFiles)

		// Load
		const files = await readdir(this.cwd)
		for (const file of files) {
			const filePath = join(this.cwd, file)

			for (const key of packages) {
				const basename = file.toLowerCase().split('.').slice(0, -1).join('.')
				if (basename === key) {
					this.log('info', `Reading package file: ${filePath}`)
					const data = await parseFile(filePath)
					this.filenamesForPackageFiles[key] = file
					this.dataForPackageFiles[key] = data
				}
			}

			for (const key of ReadmeFiles) {
				if (file.toLowerCase().startsWith(key)) {
					this.log('info', `Reading meta file: ${filePath}`)
					const data = await readFile(filePath, 'utf-8')
					this.filenamesForReadmeFiles[key] = file
					this.dataForReadmeFiles[key] = data.toString()
				}
			}
		}
	}

	/** Merge and enhance the packages data */
	protected async enhancePackagesData() {
		// ----------------------------------
		// Combine

		// Combine the package data
		const mergedPackagesData: any = {
			keywords: [],
			editions: [],
			badges: {
				list: [],
				config: {},
			},
			readmes: {},
			packages: {},
			repository: {},
			github: {},
			dependencies: {},
			devDependencies: {},
		}
		for (const key of Object.keys(this.filenamesForPackageFiles)) {
			Object.assign(mergedPackagesData, this.dataForPackageFiles[key])
		}

		// ----------------------------------
		// Validation

		// Validate keywords field
		if (isString(mergedPackagesData.keywords)) {
			return Promise.reject(
				new Error('projectz: keywords field must be array instead of CSV')
			)
		}

		// Validate sponsors array
		if (mergedPackagesData.sponsor) {
			return Promise.reject(
				new Error('projectz: sponsor field is deprecated, use sponsors field')
			)
		}
		if (isString(mergedPackagesData.sponsors)) {
			return Promise.reject(
				new Error('projectz: sponsors field must be array instead of CSV')
			)
		}

		// Validate maintainers array
		if (mergedPackagesData.maintainer) {
			return Promise.reject(
				new Error(
					'projectz: maintainer field is deprecated, use maintainers field'
				)
			)
		}
		if (isString(mergedPackagesData.maintainers)) {
			return Promise.reject(
				new Error('projectz: maintainers field must be array instead of CSV')
			)
		}

		// Validate license SPDX string
		if (isPlainObject(mergedPackagesData.license)) {
			return Promise.reject(
				new Error(
					'projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license'
				)
			)
		}
		if (isPlainObject(mergedPackagesData.licenses)) {
			return Promise.reject(
				new Error(
					'projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license'
				)
			)
		}

		// Validate enhanced fields
		const objs = ['badges', 'readmes', 'packages', 'repository', 'github']
		for (const key of objs) {
			if (!isPlainObject(mergedPackagesData[key])) {
				return Promise.reject(
					new Error(`projectz: ${key} property must be an object`)
				)
			}
		}

		// Validate package values
		for (const [key, value] of Object.entries(mergedPackagesData.packages)) {
			if (!isPlainObject(value)) {
				return Promise.reject(
					new Error(
						`projectz: custom package data for package ${key} must be an object`
					)
				)
			}
		}

		// Validate badges field
		if (
			!Array.isArray(mergedPackagesData.badges.list) ||
			(mergedPackagesData.badges.config &&
				!isPlainObject(mergedPackagesData.badges.config))
		) {
			return Promise.reject(
				new Error(
					'projectz: badges field must be in the format of: {list: [], config: {}}\nSee https://github.com/bevry/badges for details.'
				)
			)
		}

		// ----------------------------------
		// Ensure

		// Fallback name
		if (!mergedPackagesData.name) {
			mergedPackagesData.name = dirname(this.cwd)
		}

		// Fallback version
		if (!mergedPackagesData.version) {
			mergedPackagesData.version = '0.1.0'
		}

		// Fallback demo field, by scanning homepage
		if (!mergedPackagesData.demo && mergedPackagesData.homepage) {
			mergedPackagesData.demo = mergedPackagesData.homepage
		}

		// Fallback title from name
		if (!mergedPackagesData.title) {
			mergedPackagesData.title = mergedPackagesData.name
		}

		// Fallback description
		if (!mergedPackagesData.description) {
			mergedPackagesData.description = 'no description was provided'
		}

		// Fallback browsers field, by checking if `component` or `bower` package files exists, or if the `browser` or `jspm` fields are defined
		if (mergedPackagesData.browsers == null) {
			mergedPackagesData.browsers = Boolean(
				this.filenamesForPackageFiles.bower ||
					this.filenamesForPackageFiles.component ||
					mergedPackagesData.browser ||
					mergedPackagesData.jspm
			)
		}

		// ----------------------------------
		// Enhance

		// Prepare badges
		const badgesConfig: BadgesConfig = {
			npmPackageName:
				this.filenamesForPackageFiles.package && mergedPackagesData.name,
		}

		// Extract repository information
		let github: Github | undefined
		if (mergedPackagesData.repository) {
			const githubSlug = getGithubSlug(mergedPackagesData)
			if (githubSlug) {
				// Extract parts
				const [githubUsername, githubRepository] = githubSlug.split('/')
				const githubUrl = 'https://github.com/' + githubSlug
				const githubRepositoryUrl = githubUrl + '.git'

				// Github data
				github = {
					username: githubUsername,
					repository: githubRepository,
					slug: githubSlug,
					url: githubUrl,
					repositoryUrl: githubRepositoryUrl,
				}

				// Badges
				Object.assign(badgesConfig, {
					githubUsername,
					githubRepository,
					githubSlug,
				})
			}
		}

		// Fellows
		const authors = Person.add(
			mergedPackagesData.authors || mergedPackagesData.author
		)
		const contributors = Person.add(mergedPackagesData.contributors).filter(
			(fellow) => fellow.name.includes('[bot]') === false
		)
		const maintainers = Person.add(mergedPackagesData.maintainers).filter(
			(fellow) => fellow.name.includes('[bot]') === false
		)
		const sponsors = Person.add(mergedPackagesData.sponsors)

		// Create the data for the `package.json` format
		const pkg: PackageEnhanced = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.package || {},

			// Enhanced Data
			{
				name: mergedPackagesData.name,
				version: mergedPackagesData.version,
				license: mergedPackagesData.license,
				description: mergedPackagesData.description,
				keywords: mergedPackagesData.keywords,
				author: getPeopleTextArray(authors, {
					displayEmail: true,
					displayYears: true,
				}).join(', '),
				maintainers: getPeopleTextArray(maintainers, {
					displayEmail: true,
				}),
				contributors: getPeopleTextArray(contributors, {
					displayEmail: true,
				}),
				bugs: mergedPackagesData.bugs,
				engines: mergedPackagesData.engines,
				dependencies: mergedPackagesData.dependencies,
				devDependencies: mergedPackagesData.devDependencies,
				main: mergedPackagesData.main,
			},

			// Explicit data
			mergedPackagesData.packages.package || {}
		)

		// Create the data for the `jquery.json` format, which is essentially the same as the `package.json` format so just extend that
		const jquery = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.jquery || {},

			// Enhanced Data
			pkg,

			// Explicit data
			mergedPackagesData.packages.jquery || {}
		)

		// Create the data for the `component.json` format
		const component = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.component || {},

			// Enhanced Data
			{
				name: mergedPackagesData.name,
				version: mergedPackagesData.version,
				license: mergedPackagesData.license,
				description: mergedPackagesData.description,
				keywords: mergedPackagesData.keywords,
				demo: mergedPackagesData.demo,
				main: mergedPackagesData.main,
				scripts: [mergedPackagesData.main],
			},

			// Explicit data
			mergedPackagesData.packages.component || {}
		)

		// Create the data for the `bower.json` format
		const bower = Object.assign(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.bower || {},

			// Enhanced Data
			{
				name: mergedPackagesData.name,
				version: mergedPackagesData.version,
				license: mergedPackagesData.license,
				description: mergedPackagesData.description,
				keywords: mergedPackagesData.keywords,
				authors: getPeopleTextArray(mergedPackagesData.authors, {
					displayYears: true,
				}),
				main: mergedPackagesData.main,
			},

			// Explicit data
			mergedPackagesData.packages.bower || {}
		)

		// Merge together
		const enhancedPackagesData: EnhancedPackagesData = Object.assign(
			{
				// Fallback repository field by use of repo
				repository: github && {
					url: github.slug,
				},

				// Fallback bugs field by use of repo
				bugs: github && {
					url: `https://github.com/${github.slug}/issues`,
				},
			},
			mergedPackagesData as {
				name: string
				title: string
				version: string
				description: string
				browsers: boolean
				keywords: string[]
				editions: Editions
				readmes: Record<string, any>
				projectz: Record<string, any>
				packages: Record<string, any>
				dependencies: Record<string, string>
				devDependencies: Record<string, string>
				badges: BadgesField
			},
			{
				// Add paths so that our helpers have access to them
				filenamesForPackageFiles: this.filenamesForPackageFiles,
				filenamesForReadmeFiles: this.filenamesForReadmeFiles,

				// Other
				github,

				// Fellows
				authors,
				contributors,
				maintainers,
				sponsors,

				// Create the data for the `package.json` format
				package: pkg,
				jquery,
				component,
				bower,
			}
		)

		// Return
		return enhancedPackagesData
	}

	/** Merge and enhance the readmes data */
	protected async enhanceReadmesData(data: EnhancedPackagesData) {
		const enhancedReadmesData: EnhancedReadmesData = {}

		/* eslint prefer-const: 0 */
		for (let [key, value] of Object.entries(this.dataForReadmeFiles)) {
			if (!value) {
				this.log('debug', `Enhancing readme value: ${key} — skipped`)
				continue
			}
			value = replaceSection(['TITLE', 'NAME'], value, `<h1>${data.title}</h1>`)
			value = replaceSection(
				['BADGES', 'BADGE'],
				value,
				getBadgesSection.bind(null, data)
			)
			value = replaceSection(['DESCRIPTION'], value, data.description)
			value = replaceSection(
				['INSTALL'],
				value,
				getInstallInstructions.bind(null, data)
			)
			value = replaceSection(
				['CONTRIBUTE', 'CONTRIBUTING'],
				value,
				data.github
					? getContributeSection.bind(
							null,
							data as EnhancedPackagesDataWithGitHub
					  )
					: '<!-- github projects only -->'
			)
			value = replaceSection(
				['BACKERS', 'BACKER'],
				value,
				data.github
					? getBackerSection.bind(null, data as EnhancedPackagesDataWithGitHub)
					: '<!-- github projects only -->'
			)
			value = replaceSection(
				['BACKERSFILE', 'BACKERFILE'],
				value,
				data.github
					? getBackerFile.bind(null, data as EnhancedPackagesDataWithGitHub)
					: '<!-- github projects only -->'
			)
			value = replaceSection(
				['HISTORY', 'CHANGES', 'CHANGELOG'],
				value,
				data.github
					? getHistorySection.bind(null, data as EnhancedPackagesDataWithGitHub)
					: '<!-- github projects only -->'
			)
			value = replaceSection(
				['LICENSE', 'LICENSES'],
				value,
				data.github
					? getLicenseSection.bind(null, data as EnhancedPackagesDataWithGitHub)
					: '<!-- github projects only -->'
			)
			value = replaceSection(
				['LICENSEFILE'],
				value,
				getLicenseFile.bind(null, data)
			)
			enhancedReadmesData[key] = trim(value) + '\n'
			this.log('info', `Enhanced readme value: ${key}`)
		}
		return enhancedReadmesData
	}

	/** Save the data we've loaded into the files */
	protected async save(
		enhancedPackagesData: EnhancedPackagesData,
		enhancedReadmesData: EnhancedReadmesData
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
					const data =
						JSON.stringify(enhancedPackagesData[key], null, '  ') + '\n'
					return writeFile(filepath, data)
				}
			),
			// save readme files
			...Object.entries(this.filenamesForPackageFiles).map(
				async ([name, filename]) => {
					if (!filename) return
					const filepath = join(this.cwd, filename)
					this.log('info', `Saving readme file: ${filepath}`)
					const data = enhancedReadmesData[name]
					return writeFile(filepath, data)
				}
			),
		])

		// log
		this.log('info', 'Wrote changes')
	}
}
