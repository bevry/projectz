/* eslint key-spacing:0 */

// Imports
// First we need to import the libraries we require.

// Load in the file system libraries.
// [SafeFS](https://github.com/bevry/safefs) is aliased to `fsUtil` as it provides protection against a lot of the common gotchas
import { readdir, readFile, writeFile } from 'safefs'
import { resolve, join } from 'path'

// CSON is used for loading in our configuration files
import CSON from 'season'

// [TypeChecker](https://github.com/bevry/typechecker) is used for checking data types
import { isString, isObject } from 'typechecker'

// [TaskGroup](https://github.com/bevry/taskgroup) is used for bundling tasks together and waiting for their completion
import { TaskGroup } from 'taskgroup'

// [Eachr](https://github.com/bevry/eachr) lets us cycle arrays and objects easily
import eachr from 'eachr'

// [Extendr](https://github.com/bevry/extendr) gives us safe, deep, and shallow extending abilities
import extendr from 'extendr'

// Load in our other project files
import { Person } from './person.js'
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

// Definition
// Projects is defined as a class to ensure we can run multiple instances of it
export class Projectz {
	/* :: cwd:string; */
	/* :: filenamesForPackageFiles:Object; */
	/* :: dataForPackageFiles:Object; */
	/* :: dataForPackageFilesEnhanced:Object; */
	/* :: filenamesForReadmeFiles:Object; */
	/* :: dataForReadmeFiles:Object; */
	/* :: dataForReadmeFilesEnhanced:Object; */
	/* :: mergedPackageData:Object; */
	/* :: log:function; */

	// Constructor
	// Options:
	// - `cwd` the directory that we wish to do our work on, defaults to `process.cwd()`
	// - `log` the log function to use, first argument being the log level
	// Usage:
	// - `project = require('projectz').create(opts)`
	// - `project = new (require('projectz').Projectz)(opts)`
	constructor(opts /* :Object */) {
		// The current working directory (the path) that projectz is working on
		this.cwd = opts.cwd ? resolve(opts.cwd) : process.cwd()

		// Our log function to use (logLevel, ...messages)
		this.log = opts.log || function () {}
	}

	// Reset the properties of this class
	reset() /* :this */ {
		// The absolute paths for all the package files
		this.filenamesForPackageFiles = {
			// gets filled in with relative paths
			projectz: false,
			package: false,
			bower: false,
			component: false,
			jquery: false,
		}

		// The data for each of our package files
		this.dataForPackageFiles = {}

		// The enhanced data for each of our package files
		this.dataForPackageFilesEnhanced = {}

		// The absolute paths for all the readme files
		this.filenamesForReadmeFiles = {
			// gets filled in with relative paths
			readme: false,
			history: false,
			contributing: false,
			backers: false,
			license: false,
		}

		// The data for each of our readme files
		this.dataForReadmeFiles = {}

		// The enhanced data for each of our readme files
		this.dataForReadmeFilesEnhanced = {}

		// The merged data for each of our package files
		this.mergedPackageData = {}

		// Chain
		return this
	}

	// Load
	// Load in the files we will be working with
	// Usage: `load(function (err) {})`
	load(next /* :function */) /* :this */ {
		// Reset
		this.reset()

		// Create our serial task group to allot our tasks into and once it completes continue to the next handler
		const tasks = new TaskGroup().done(next)

		// Load readme and package data
		tasks.addTask('loadPaths', this.loadPaths.bind(this))

		// Merge our package data
		tasks.addTask('mergeData', this.mergeData.bind(this))

		// Enhance our package data
		tasks.addTask('enhancePackages', this.enhancePackages.bind(this))

		// Enhance our readme data
		tasks.addTask('enhanceReadmes', this.enhanceReadmes.bind(this))

		// Finish up
		tasks.run()
		return this
	}

	// Load Paths
	// Load in the paths we have specified
	// Usage: `loadPaths(function (err) {})`
	loadPaths(next /* :function */) /* :this */ {
		// Create the parallel task group and once they've all completed fire our completion callback
		const tasks = new TaskGroup().setConfig({ concurrency: 0 }).done(next)

		// Apply our determined paths for packages
		const packages = Object.keys(this.filenamesForPackageFiles)
		const readmes = Object.keys(this.filenamesForReadmeFiles)

		// Load
		tasks.addTask((complete) => {
			readdir(this.cwd, (err, files) => {
				if (err) return complete(err)
				files.forEach((file) => {
					const filePath = join(this.cwd, file)

					packages.forEach((key) => {
						const basename = file
							.toLowerCase()
							.split('.')
							.slice(0, -1)
							.join('.')
						if (basename === key) {
							const message = `Reading package file: ${filePath}`
							tasks.addTask(message, (complete) => {
								this.log('info', message)
								CSON.readFile(filePath, (err, data) => {
									if (err) return complete(err)
									this.filenamesForPackageFiles[key] = file
									this.dataForPackageFiles[key] = data
									complete(err)
								})
							})
						}
					})

					readmes.forEach((key) => {
						if (file.toLowerCase().startsWith(key)) {
							const message = `Reading readme file: ${filePath}`
							tasks.addTask(message, (complete) => {
								this.log('info', message)
								readFile(filePath, (err, data) => {
									if (err) return complete(err)
									this.filenamesForReadmeFiles[key] = file
									this.dataForReadmeFiles[key] = data.toString()
									complete(err)
								})
							})
						}
					})
				})
				complete()
			})
		})

		// Finish up
		tasks.run()
		return this
	}

	// Merge Packages
	mergeData(next /* :function */) /* :this */ {
		// By first merging in all the package data together into the enhanced data
		extendr.extend(
			this.mergedPackageData,
			this.dataForPackageFiles.component || {},
			this.dataForPackageFiles.bower || {},
			this.dataForPackageFiles.jquery || {},
			this.dataForPackageFiles.package || {},
			this.dataForPackageFiles.projectz || {}
		)

		// ----------------------------------
		// Validation

		// Validate badges field
		if (this.mergedPackageData.badges && !this.mergedPackageData.badges.list) {
			next(
				new Error(
					'projectz: badges field must now be in the format of: {list: [], config: {}}\nSee https://github.com/bevry/badges for details.'
				)
			)
			return this
		}

		// Validate keywords field
		if (isString(this.mergedPackageData.keywords)) {
			next(new Error('projectz: keywords field must be array instead of CSV'))
			return this
		}

		// Validate sponsors array
		if (this.mergedPackageData.sponsor) {
			next(
				new Error('projectz: sponsor field is deprecated, use sponsors field')
			)
			return this
		}
		if (isString(this.mergedPackageData.sponsors)) {
			next(new Error('projectz: sponsors field must be array instead of CSV'))
			return this
		}

		// Validate maintainers array
		if (this.mergedPackageData.maintainer) {
			next(
				new Error(
					'projectz: maintainer field is deprecated, use maintainers field'
				)
			)
			return this
		}
		if (isString(this.mergedPackageData.maintainers)) {
			next(
				new Error('projectz: maintainers field must be array instead of CSV')
			)
			return this
		}

		// Validate license SPDX string
		if (isObject(this.mergedPackageData.license)) {
			next(
				new Error(
					'projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license'
				)
			)
			return this
		}
		if (isObject(this.mergedPackageData.licenses)) {
			next(
				new Error(
					'projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license'
				)
			)
			return this
		}

		// Validate package values
		for (const name in this.mergedPackageData.packages) {
			if (this.mergedPackageData.packages.hasOwnProperty(name)) {
				const value = this.mergedPackageData.packages[name]
				if (!isObject(value)) {
					next(
						new Error(
							`projectz: custom package data for package ${name} must be an object`
						)
					)
					return this
				}
			}
		}

		// ----------------------------------
		// Merging

		// Set some basic object defaults
		extendr.defaults(this.mergedPackageData, {
			badges: {},
			readmes: {},
			packages: {},
			repository: {},
			github: {},
			// contributors: [],
			// sponsors: [],
			// maintainers: [],
			// authors: []
		})

		// Ensure badge config
		if (!this.mergedPackageData.badges.list)
			this.mergedPackageData.badges.list = []
		if (!this.mergedPackageData.badges.config)
			this.mergedPackageData.badges.config = {}

		// Add paths so that our helpers have access to them
		this.mergedPackageData.filenamesForPackageFiles = this.filenamesForPackageFiles
		this.mergedPackageData.filenamesForReadmeFiles = this.filenamesForReadmeFiles

		// Fallback some defaults on the merged object
		extendr.defaults(this.mergedPackageData, {
			// Fallback browsers field, by checking if `component` or `bower` package files exists, or if the `browser` or `jspm` fields are defined
			browsers: Boolean(
				this.filenamesForPackageFiles.bower ||
					this.filenamesForPackageFiles.component ||
					this.mergedPackageData.browser ||
					this.mergedPackageData.jspm
			),

			// Fallback demo field, by scanning homepage
			demo: this.mergedPackageData.homepage,

			// Fallback title from name
			title: this.mergedPackageData.name || null,
		})

		// Extract repository information
		/* eslint no-magic-numbers: 0 */
		let repo = this.mergedPackageData.repository || null
		const githubSlug = getGithubSlug(this.mergedPackageData)
		if (githubSlug) {
			// Extract parts
			const [githubUsername, githubRepository] = githubSlug.split('/')
			const githubUrl = 'https://github.com/' + githubSlug
			const githubRepositoryUrl = githubUrl + '.git'

			// Github data
			this.mergedPackageData.github = {
				username: githubUsername,
				repository: githubRepository,
				slug: githubSlug,
				url: githubUrl,
				repositoryUrl: githubRepositoryUrl,
			}
			repo = githubSlug

			// Add github data to the badges
			this.mergedPackageData.badges.config.githubUsername = githubUsername
			this.mergedPackageData.badges.config.githubRepository = githubRepository
			this.mergedPackageData.badges.config.githubSlug = githubSlug

			// Fallback fields
			extendr.defaults(this.mergedPackageData, {
				// Fallback repository field by use of repo
				repository: githubSlug,

				// Fallback bugs field by use of repo
				bugs: {
					url: `https://github.com/${githubSlug}/issues`,
				},
			})
		}

		// Add npm data to the badges
		if (this.filenamesForPackageFiles.package && this.mergedPackageData.name) {
			this.mergedPackageData.badges.config.npmPackageName = this.mergedPackageData.name
		}

		// Enhance authors, contributors and maintainers
		if (repo) {
			// Add people to the Person singleton with their appropriate permissions
			Person.add(this.mergedPackageData.author).forEach((person) => {
				// package author string
				person.authorsRepository(repo)
			})
			Person.add(this.mergedPackageData.authors).forEach((person) => {
				// bower authors array
				person.authorsRepository(repo)
			})
			Person.add(this.mergedPackageData.contributors).forEach((person) => {
				person.contributesRepository(repo)
			})
			Person.add(this.mergedPackageData.maintainers).forEach((person) => {
				person.maintainsRepository(repo)
			})

			// Add the enhanced collections to the merged data
			this.mergedPackageData.authors = Person.authorsRepository(repo)
			this.mergedPackageData.contributors = Person.contributesRepository(repo)
			this.mergedPackageData.maintainers = Person.maintainsRepository(repo)
		} else {
			this.mergedPackageData.authors = Person.add(
				this.mergedPackageData.author || this.mergedPackageData.authors
			)
			this.mergedPackageData.contributors = Person.add(
				this.mergedPackageData.contributors
			)
			this.mergedPackageData.maintainers = Person.add(
				this.mergedPackageData.maintainers
			)
		}

		// Enhance licenses and sponsors
		this.mergedPackageData.sponsors = Person.add(
			this.mergedPackageData.sponsors
		)

		// Finish up
		next()
		return this
	}

	// Enhance Packages
	enhancePackages(next /* :function */) /* :this */ {
		// Create the data for the `package.json` format
		this.dataForPackageFilesEnhanced.package = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.package || {},

			// Enhanced Data
			{
				name: this.mergedPackageData.name,
				version: this.mergedPackageData.version,
				license: this.mergedPackageData.license,
				description: this.mergedPackageData.description,
				keywords: this.mergedPackageData.keywords,
				author: getPeopleTextArray(this.mergedPackageData.authors, {
					displayYears: true,
				}).join(', '),
				maintainers: getPeopleTextArray(this.mergedPackageData.maintainers),
				contributors: getPeopleTextArray(
					this.mergedPackageData.contributors
				).filter((entry) => entry.includes('[bot]') === false),
				bugs: this.mergedPackageData.bugs,
				engines: this.mergedPackageData.engines,
				dependencies: this.mergedPackageData.dependencies,
				devDependencies: this.mergedPackageData.devDependencies,
				main: this.mergedPackageData.main,
			}
		)

		// Explicit data
		if (this.mergedPackageData.packages.package) {
			extendr.extend(
				this.dataForPackageFilesEnhanced.package,
				this.mergedPackageData.packages.package
			)
		}

		// jQuery
		// Create the data for the `jquery.json` format, which is essentially exactly the same as the `package.json` format so just extend that
		this.dataForPackageFilesEnhanced.jquery = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.jquery || {},

			// Enhanced Data
			this.dataForPackageFilesEnhanced.package || {}
		)

		// Explicit data
		if (this.mergedPackageData.packages.jquery) {
			extendr.extend(
				this.dataForPackageFilesEnhanced.jquery,
				this.mergedPackageData.packages.jquery
			)
		}

		// Component
		// Create the data for the `component.json` format
		this.dataForPackageFilesEnhanced.component = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.component || {},

			// Enhanced Data
			{
				name: this.mergedPackageData.name,
				version: this.mergedPackageData.version,
				license: this.mergedPackageData.license,
				description: this.mergedPackageData.description,
				keywords: this.mergedPackageData.keywords,
				demo: this.mergedPackageData.demo,
				main: this.mergedPackageData.main,
				scripts: [this.mergedPackageData.main],
			}
		)

		// Explicit data
		if (this.mergedPackageData.packages.component) {
			extendr.extend(
				this.dataForPackageFilesEnhanced.component,
				this.mergedPackageData.packages.component
			)
		}

		// Bower
		// Create the data for the `bower.json` format
		this.dataForPackageFilesEnhanced.bower = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.bower || {},

			// Enhanced Data
			{
				name: this.mergedPackageData.name,
				version: this.mergedPackageData.version,
				license: this.mergedPackageData.license,
				description: this.mergedPackageData.description,
				keywords: this.mergedPackageData.keywords,
				authors: getPeopleTextArray(this.mergedPackageData.authors, {
					displayYears: true,
				}),
				main: this.mergedPackageData.main,
			}
		)

		// Explicit data
		if (this.mergedPackageData.packages.bower) {
			extendr.extend(
				this.dataForPackageFilesEnhanced.bower,
				this.mergedPackageData.packages.bower
			)
		}

		// Finish up
		next()
		return this
	}

	// Enhance Readmes
	enhanceReadmes(next /* :function */) /* :this */ {
		const data = this.mergedPackageData
		eachr(this.dataForReadmeFiles, (value, name) => {
			if (!value) {
				this.log('debug', `Enhancing readme value: ${name} — skipped`)
				return
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
				getContributeSection.bind(null, data)
			)
			value = replaceSection(
				['BACKERS', 'BACKER'],
				value,
				getBackerSection.bind(null, data)
			)
			value = replaceSection(
				['BACKERSFILE', 'BACKERFILE'],
				value,
				getBackerFile.bind(null, data)
			)
			value = replaceSection(
				['HISTORY', 'CHANGES', 'CHANGELOG'],
				value,
				getHistorySection.bind(null, data)
			)
			value = replaceSection(
				['LICENSE', 'LICENSES'],
				value,
				getLicenseSection.bind(null, data)
			)
			value = replaceSection(
				['LICENSEFILE'],
				value,
				getLicenseFile.bind(null, data)
			)
			this.dataForReadmeFilesEnhanced[name] = trim(value) + '\n'
			this.log('info', `Enhanced readme value: ${name}`)
			return true
		})

		// Finish up
		next()
		return this
	}

	// Save
	// Save the data we've loaded into the files
	// Usage: `save(function (err) {})`
	save(next /* :function */) /* :this */ {
		// Prepare
		this.log('info', 'Writing changes...')
		const tasks = new TaskGroup().setConfig({ concurrency: 0 }).done((err) => {
			if (err) return next(err)
			this.log('info', 'Wrote changes')
			return next()
		})

		// Save package files
		eachr(this.filenamesForPackageFiles, (filename, name) => {
			if (!filename || name === 'projectz') return
			const filepath = join(this.cwd, filename)
			const message = `Saving package file: ${filepath}`
			tasks.addTask(message, (complete) => {
				this.log('info', message)
				const data =
					JSON.stringify(this.dataForPackageFilesEnhanced[name], null, '  ') +
					'\n'
				writeFile(filepath, data, complete)
			})
		})

		// Safe readme files
		eachr(this.filenamesForReadmeFiles, (filename, name) => {
			if (!filename) return
			const filepath = join(this.cwd, filename)
			const message = `Saving readme file: ${filepath}`
			tasks.addTask(message, (complete) => {
				this.log('info', message)
				const data = this.dataForReadmeFilesEnhanced[name]
				writeFile(filepath, data, complete)
			})
		})

		// Finish up
		tasks.run()
		return this
	}
}
