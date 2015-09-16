/* eslint key-spacing:0 */

// Imports
// First we need to import the libraries we require.

// Load in the file system libraries.
// [SafeFS](https://github.com/bevry/safefs) is aliased to `fsUtil` as it provides protection against a lot of the common gotchas
const fsUtil = require('safefs')
const pathUtil = require('path')

// [CSON](https://github.com/bevry/cson) is used for loading in our configuration files
const CSON = require('cson')

// [TypeChecker](https://github.com/bevry/typechecker) is used for checking data types
const typeChecker = require('typechecker')

// [TaskGroup](https://github.com/bevry/taskgroup) is used for bundling tasks together and waiting for their completion
const TaskGroup = require('taskgroup')

// [Eachr](https://github.com/bevry/eachr) lets us cycle arrays and objects easily
const eachr = require('eachr')

// [Extendr](https://github.com/bevry/extendr) gives us safe, deep, and shallow extending abilities
const extendr = require('extendr')

// [Fellow](https://github.com/bevry/fellow) gives us a Fellow class with singleton functions for list management
const Fellow = require('fellow')

// Load in our other project files
const backerUtil = require('./backer-util')
const badgeUtil = require('./badge-util')
const historyUtil = require('./history-util')
const installUtil = require('./install-util')
const licenseUtil = require('./license-util')
const projectzUtil = require('./projectz-util')

// Definition
// Projects is defined as a class to ensure we can run multiple instances of it
export default class Projectz {
	// Proectz.create(opts)
	static create (...args) {
		return new this(...args)
	}

	// Constructor
	// Options:
	// - `cwd` the directory that we wish to do our work on, defaults to `process.cwd()`
	// - `log` the log function to use, first argument being the log level
	// Usage:
	// - `project = require('projectz').create(opts)`
	// - `project = new (require('projectz').Projectz)(opts)`
	constructor (opts) {
		// The current working directory (the path) that projectz is working on
		this.cwd = opts.cwd ? pathUtil.resolve(opts.cwd) : process.cwd()

		// The absolute paths for all the package files
		this.filenamesForPackageFiles = null

		// The data for each of our package files
		this.dataForPackageFiles = null

		// The enhanced data for each of our package files
		this.dataForPackageFilesEnhanced = null


		// The absolute paths for all the readme files
		this.filenamesForReadmeFiles = null

		// The data for each of our readme files
		this.dataForReadmeFiles = null

		// The enhanced data for each of our readme files
		this.dataForReadmeFilesEnhanced = null


		// The merged data for each of our package files
		this.mergedPackageData = null


		// Our log function to use (logLevel, ...messages)
		this.log = opts.log || function () {}
	}

	// Load
	// Load in the files we will be working with
	// Usage: `load(function (err) {})`
	load (next) {
		// Reset package properties
		this.filenamesForPackageFiles = {
			// gets filled in with relative paths
			projectz:      false,
			package:       false,
			bower:         false,
			component:     false,
			jquery:        false
		}
		this.dataForPackageFiles = {}
		this.dataForPackageFilesEnhanced = {}

		// Reset readme properties
		this.filenamesForReadmeFiles = {
			// gets filled in with relative paths
			readme:        false,
			history:       false,
			contributing:  false,
			backers:       false,
			license:       false
		}
		this.dataForReadmeFiles = {}
		this.dataForReadmeFilesEnhanced = {}

		// Reset merged data
		this.mergedPackageData = {}

		// Create our serial task group to allot our tasks into and once it completes continue to the next handler
		const tasks = new TaskGroup().done(next)

		// Load readme and package data
		tasks.addTask('loadPaths', this.loadPaths.bind(this))

		// Merge our package data
		tasks.addTask('mergeData', this.mergeData.bind(this))

		// Fetch the latest contributors. This is after the merging as we access merged properties to be able to do this.
		tasks.addTask('loadGithubContributors', this.loadGithubContributors.bind(this))

		// Enhance our package data
		tasks.addTask('enhancePackages', this.enhancePackages.bind(this))

		// Enhance our readme data
		tasks.addTask('enhanceReadmes', this.enhanceReadmes.bind(this))

		// Finish up
		tasks.run()
		return this
	}

	// Load Github Contributors
	// Fetch the contributors for the repo if we have it
	// Usage: `loadContributors(function (err) {})`
	loadGithubContributors (next) {
		// Prepare
		const log = this.log

		// Check
		if ( !this.mergedPackageData.github || !this.mergedPackageData.github.username || !this.mergedPackageData.github.repository ) {
			log('debug', 'Skipping loading github contributors as this does not appear to be a github repository')
			next()
			return this
		}

		// Prepare
		const githubSlug = this.mergedPackageData.github.slug
		const githubClientId = process.env.GITHUB_CLIENT_ID
		const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
		const url = `https://api.github.com/repos/${githubSlug}/contributors?per_page=100&client_id=${githubClientId}&client_secret=${githubClientSecret}`

		// Fetch the github and package contributors for it
		log('info', `Loading contributors for repository: ${githubSlug}`)
		require('chainy-core').create().require('set feed map')
			// Fetch the repositories contributors
			.set(url)
			.feed()
			.action(function (data) {
				if ( data.message )  throw new Error(data.message)
			})

			// Now lets replace the shallow member details with their full github profile details via the profile api
			.map(function (user, complete) {
				this.create()
					.set(user.url)
					.feed()
					.action(function (data) {
						if ( data.message )  throw new Error(data.message)
					})
					.done(complete)
			})

			// Now let's turn them into people
			.map(function (person) {
				const data = {
					name: person.name,
					email: person.email,
					description: person.bio,
					company: person.company,
					location: person.location,
					homepage: person.blog,
					hireable: person.hireable,
					githubUsername: person.login,
					githubUrl: person.html_url
				}
				const fellow = Fellow.ensure(data)
				fellow.contributesRepository(githubSlug)
			})

			// Log
			.action((contributors) => {
				log('info', `Loaded ${contributors.length} contributors for repository: ${githubSlug}`)
				this.mergedPackageData.contributors = Fellow.contributesRepository(githubSlug)
			})

			// And return our result
			.done(next)

		// Chain
		return this
	}


	// Load Paths
	// Load in the paths we have specified
	// Usage: `loadPaths(function (err) {})`
	loadPaths (next) {
		// Create the parallel task group and once they've all completed fire our completion callback
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(next)

		// Apply our determined paths for packages
		const packages = Object.keys(this.filenamesForPackageFiles)
		const readmes = Object.keys(this.filenamesForReadmeFiles)

		// Load
		tasks.addTask((complete) => {
			fsUtil.readdir(this.cwd, (err, files) => {
				if ( err )  return complete(err)
				files.forEach((file) => {
					const filePath = pathUtil.join(this.cwd, file)

					packages.forEach((key) => {
						if ( file.toLowerCase().indexOf(key) === 0 ) {
							const message = `Reading package file: ${filePath}`
							tasks.addTask(message, (complete) => {
								this.log('info', message)
								CSON.parseFile(filePath, (err, data) => {
									if ( err )  return complete(err)
									this.filenamesForPackageFiles[key] = file
									this.dataForPackageFiles[key] = data
									complete(err)
								})
							})
						}
					})

					readmes.forEach((key) => {
						if ( file.toLowerCase().indexOf(key) === 0 ) {
							const message = `Reading readme file: ${filePath}`
							tasks.addTask(message, (complete) => {
								this.log('info', message)
								fsUtil.readFile(filePath, (err, data) => {
									if ( err )  return complete(err)
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
	mergeData (next) {
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
		if ( this.mergedPackageData.badges && !this.mergedPackageData.badges.list ) {
			next(new Error('projectz: badges field must now be in the format of: {list: [], config: {}}\nSee https://github.com/bevry/badges for details.'))
			return this
		}

		// Validate keywords field
		if ( typeChecker.isString(this.mergedPackageData.keywords) ) {
			next(new Error('projectz: keywords field must be array instead of CSV'))
			return this
		}

		// Validate sponsors array
		if ( this.mergedPackageData.sponsor ) {
			next(new Error('projectz: sponsor field is deprecated, use sponsors field'))
			return this
		}
		if ( typeChecker.isString(this.mergedPackageData.sponsors) ) {
			next(new Error('projectz: sponsors field must be array instead of CSV'))
			return this
		}

		// Validate maintainers array
		if ( this.mergedPackageData.maintainer ) {
			next(new Error('projectz: maintainer field is deprecated, use maintainers field'))
			return this
		}
		if ( typeChecker.isString(this.mergedPackageData.maintainers) ) {
			next(new Error('projectz: maintainers field must be array instead of CSV'))
			return this
		}

		// Validate license SPDX string
		if ( typeChecker.isObject(this.mergedPackageData.license) ) {
			next(new Error('projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}
		if ( typeChecker.isObject(this.mergedPackageData.licenses) ) {
			next(new Error('projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}

		// Validate package valuees
		for ( const name in this.mergedPackageData.packages ) {
			if ( this.mergedPackageData.packages.hasOwnProperty(name) ) {
				const value = this.mergedPackageData.packages[name]
				if ( !typeChecker.isObject(value) ) {
					next(new Error(`projectz: custom package data for package ${name} must be an object`))
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
			github: {}
			// contributors: [],
			// sponsors: [],
			// maintainers: [],
			// authors: []
		})

		// Ensure badge config
		if ( !this.mergedPackageData.badges.list )  this.mergedPackageData.badges.list = []
		if ( !this.mergedPackageData.badges.config )  this.mergedPackageData.badges.config = {}

		// Add paths so that our helpers have access to them
		this.mergedPackageData.filenamesForPackageFiles = this.filenamesForPackageFiles
		this.mergedPackageData.filenamesForReadmeFiles = this.filenamesForReadmeFiles

		// Fallback some defaults on the merged object
		extendr.defaults(this.mergedPackageData, {
			// Fallback browsers field, by checking if `component` or `bower` package files exists
			browsers: !!(this.filenamesForPackageFiles.browser || this.filenamesForPackageFiles.component),

			// Fallback demo field, by scanning homepage
			demo: this.mergedPackageData.homepage,

			// Fallback title from name
			title: this.mergedPackageData.name || null
		})

		// Extract repository information
		let repo = this.mergedPackageData.repository.url || null
		const githubMatch = (this.mergedPackageData.repository.url || this.mergedPackageData.homepage).match(/github\.com\/(.+?)(?:\.git|\/)?$/)
		const githubMatchParts = (githubMatch && githubMatch[1] || '').split('/')
		if ( githubMatchParts.length === 2 ) {
			// Extract parts
			const [githubUsername, githubRepository] = githubMatchParts
			const githubSlug = githubUsername + '/' + githubRepository
			const githubUrl = 'https://github.com/' + githubSlug
			const githubRepositoryUrl = githubUrl + '.git'

			// Github data
			this.mergedPackageData.github = {
				username: githubUsername,
				repository: githubRepository,
				slug: githubSlug,
				url: githubUrl,
				repositoryUrl: githubRepositoryUrl
			}
			repo = githubSlug

			// Add github data to the badges
			this.mergedPackageData.badges.config.githubUsername = githubUsername
			this.mergedPackageData.badges.config.githubRepository = githubRepository
			this.mergedPackageData.badges.config.githubSlug = githubSlug

			// Fallback fields
			extendr.defaults(this.mergedPackageData, {
				// Fallback repository field by use of repo
				repository: {
					type: 'git',
					url: `https://github.com/${githubSlug}.git`
				},

				// Fallback bugs field by use of repo
				bugs: {
					url: `https://github.com/${githubSlug}/issues`
				}
			})
		}

		// Add npm data to the badges
		if ( this.filenamesForPackageFiles.package && this.mergedPackageData.name ) {
			this.mergedPackageData.badges.config.npmPackageName = this.mergedPackageData.name
		}

		// Enhance authors, contributors and maintainers
		if ( repo ) {
			// Add people to the fellow singleton with their appropriate permissions
			Fellow.add(this.mergedPackageData.author).forEach((fellow) => {  // package author string
				fellow.authorsRepository(repo)
			})
			Fellow.add(this.mergedPackageData.authors).forEach((fellow) => {  // bower authors array
				fellow.authorsRepository(repo)
			})
			Fellow.add(this.mergedPackageData.contributors).forEach((fellow) => {
				fellow.contributesRepository(repo)
			})
			Fellow.add(this.mergedPackageData.maintainers).forEach((fellow) => {
				fellow.maintainsRepository(repo)
			})

			// Add the enhanced collections to the merged data
			this.mergedPackageData.authors = Fellow.authorsRepository(repo)
			this.mergedPackageData.contributors = Fellow.contributesRepository(repo)
			this.mergedPackageData.maintainers = Fellow.maintainsRepository(repo)
		}
		else {
			this.mergedPackageData.authors = Fellow.add(this.mergedPackageData.author || this.mergedPackageData.authors)
			this.mergedPackageData.contributors = Fellow.add(this.mergedPackageData.contributors)
			this.mergedPackageData.maintainers = Fellow.add(this.mergedPackageData.maintainers)
		}

		// Enhance licenses and sponsors
		this.mergedPackageData.licenses = new projectzUtil.Licenses(this.mergedPackageData.license)
		this.mergedPackageData.sponsors = Fellow.add(this.mergedPackageData.sponsors)

		// Finish up
		next()
		return this
	}

	// Enhance Packages
	enhancePackages (next) {
		// Create the data for the `package.json` format
		this.dataForPackageFilesEnhanced.package = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackageFiles.package || {},

			// Enhanced Data
			{
				name:                   this.mergedPackageData.name,
				version:                this.mergedPackageData.version,
				license:                this.mergedPackageData.license,
				description:            this.mergedPackageData.description,
				keywords:               this.mergedPackageData.keywords,
				author:                 projectzUtil.getPeopleTextArray(this.mergedPackageData.authors, {years: true}).join(', '),
				maintainers:            projectzUtil.getPeopleTextArray(this.mergedPackageData.maintainers),
				contributors:           projectzUtil.getPeopleTextArray(this.mergedPackageData.contributors),
				bugs:                   this.mergedPackageData.bugs,
				engines:                this.mergedPackageData.engines,
				dependencies:           this.mergedPackageData.dependencies,
				devDependencies:        this.mergedPackageData.devDependencies,
				main:                   this.mergedPackageData.main
			}
		)

		// Explicit data
		if ( this.mergedPackageData.packages.package ) {
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
		if ( this.mergedPackageData.packages.jquery ) {
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
				name:                   this.mergedPackageData.name,
				version:                this.mergedPackageData.version,
				license:                this.mergedPackageData.license,
				description:            this.mergedPackageData.description,
				keywords:               this.mergedPackageData.keywords,
				demo:                   this.mergedPackageData.demo,
				main:                   this.mergedPackageData.main,
				scripts:                [this.mergedPackageData.main]
			}
		)

		// Explicit data
		if ( this.mergedPackageData.packages.component ) {
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
				name:                   this.mergedPackageData.name,
				version:                this.mergedPackageData.version,
				license:                this.mergedPackageData.license,
				description:            this.mergedPackageData.description,
				keywords:               this.mergedPackageData.keywords,
				authors:                projectzUtil.getPeopleTextArray(this.mergedPackageData.authors, {years: true}),
				main:                   this.mergedPackageData.main
			}
		)

		// Explicit data
		if ( this.mergedPackageData.packages.bower ) {
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
	enhanceReadmes (next) {
		const opts = this.mergedPackageData
		eachr(this.dataForReadmeFiles, (data, name) => {
			if ( !data ) {
				this.log('debug', `Enhancing readme data: ${name} — skipped`)
				return
			}
			data = projectzUtil.replaceSection(['TITLE', 'NAME'], data, `<h1>${opts.title}</h1>`)
			data = projectzUtil.replaceSection(['BADGES', 'BADGE'], data, badgeUtil.getBadgesSection.bind(null, opts))
			data = projectzUtil.replaceSection(['DESCRIPTION'], data, opts.description)
			data = projectzUtil.replaceSection(['INSTALL'], data, installUtil.getInstallInstructions.bind(null, opts))
			data = projectzUtil.replaceSection(['CONTRIBUTE', 'CONTRIBUTING'], data, backerUtil.getContributeSection.bind(null, opts))
			data = projectzUtil.replaceSection(['BACKERS', 'BACKER'], data, backerUtil.getBackerSection.bind(null, opts))
			data = projectzUtil.replaceSection(['BACKERSFILE', 'BACKERFILE'], data, backerUtil.getBackerFile.bind(null, opts))
			data = projectzUtil.replaceSection(['HISTORY', 'CHANGES', 'CHANGELOG'], data, historyUtil.getHistorySection.bind(null, opts))
			data = projectzUtil.replaceSection(['LICENSE', 'LICENSES'], data, licenseUtil.getLicenseSection.bind(null, opts))
			data = projectzUtil.replaceSection(['LICENSEFILE'], data, licenseUtil.getLicenseFile.bind(null, opts))
			this.dataForReadmeFilesEnhanced[name] = projectzUtil.trim(data)
			this.log('info', `Enhanced readme data: ${name}`)
			return true
		})

		// Finish up
		next()
		return this
	}

	// Save
	// Save the data we've loaded into the files
	// Usage: `save(function (err) {})`
	save (next) {
		// Prepare
		this.log('info', 'Writing changes...')
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done((err) => {
			if ( err )  return next(err)
			this.log('info', 'Wrote changes')
			return next()
		})

		// Save package files
		eachr(this.filenamesForPackageFiles, (filename, name) => {
			if ( !filename || name === 'projectz' )  return
			const filepath = pathUtil.join(this.cwd, filename)
			const message = `Saving package file: ${filepath}`
			tasks.addTask(message, (complete) => {
				this.log('info', message)
				const data = JSON.stringify(this.dataForPackageFilesEnhanced[name], null, '  ') + '\n'
				fsUtil.writeFile(filepath, data, complete)
			})
		})

		// Safe readme files
		eachr(this.filenamesForReadmeFiles, (filename, name) => {
			if ( !filename )  return
			const filepath = pathUtil.join(this.cwd, filename)
			const message = `Saving readme file: ${filepath}`
			tasks.addTask(message, (complete) => {
				this.log('info', message)
				const data = this.dataForReadmeFilesEnhanced[name]
				fsUtil.writeFile(filepath, data, complete)
			})
		})

		// Finish up
		tasks.run()
		return this
	}
}
