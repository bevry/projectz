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
		this.pathsForPackageFiles = null

		// The data for each of our package files
		this.dataForPackageFiles = null

		// The enhanced data for each of our package files
		this.dataForPackageFilesEnhanced = null


		// The absolute paths for all the meta files
		this.pathsForMetaFiles = null

		// The data for each of our meta files
		this.dataForMetaFiles = null

		// The enhanced data for each of our meta files
		this.dataForMetaFilesEnhanced = null


		// The merged data for each of our package files
		this.mergedPackageData = null


		// Our log function to use (logLevel, ...messages)
		this.log = opts.log || function () {}

		// Apply our determined paths for packages
		this.pathsForPackageFiles = {
			projectz:      pathUtil.join(this.cwd, 'projectz.cson'),
			package:       pathUtil.join(this.cwd, 'package.json'),
			bower:         pathUtil.join(this.cwd, 'bower.json'),
			component:     pathUtil.join(this.cwd, 'component.json'),
			jquery:        pathUtil.join(this.cwd, 'jquery.json')
		}

		// Apply our determined paths for readmes
		this.pathsForMetaFiles = {
			readme:        pathUtil.join(this.cwd, 'README.md'),
			history:       pathUtil.join(this.cwd, 'HISTORY.md'),
			contributing:  pathUtil.join(this.cwd, 'CONTRIBUTING.md'),
			backers:       pathUtil.join(this.cwd, 'BACKERS.md'),
			license:       pathUtil.join(this.cwd, 'LICENSE.md'),
			travis:        pathUtil.join(this.cwd, '.travis.yml')
		}
	}

	// Load
	// Load in the files we will be working with
	// Usage: `load(function (err) {})`
	load (next) {
		// Reset/apply our data for the different properties
		this.dataForPackageFiles = {}
		this.dataForPackageFilesEnhanced = {}
		this.dataForMetaFiles = {}
		this.dataForMetaFilesEnhanced = {}
		this.mergedPackageData = {}

		// Create our serial task group to allot our tasks into and once it completes continue to the next handler
		const tasks = new TaskGroup().done(next)

		// Load readme and package data
		tasks.addTask(this.loadPaths.bind(this))

		// Merge our package data
		tasks.addTask(this.mergeData.bind(this))

		// Fetch the latest contributors. This is after the merging as we access merged properties to be able to do this.
		tasks.addTask(this.loadContributors.bind(this))

		// Enhance our package data
		tasks.addTask(this.enhancePackages.bind(this))

		// Enhance our readme data
		tasks.addTask(this.enhanceReadmes.bind(this))

		// Finish up
		tasks.run()
		return this
	}

	// Load Contributors
	// Fetch the contributors for the repo if we have it
	// Usage: `loadContributors(function (err) {})`
	loadContributors (next) {
		// Prepare
		const log = this.log
		const repoSlug = this.mergedPackageData.repo
		const githubClientId = process.env.GITHUB_CLIENT_ID
		const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
		const url = `https://api.github.com/repos/${repoSlug}/contributors?per_page=100&client_id=${githubClientId}&client_secret=${githubClientSecret}`

		// Fetch the github and package contributors for it
		log('info', `Loading contributors for repository: ${repoSlug}`)
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
				fellow.contributesRepository(repoSlug)
			})

			// Log
			.action(function (contributors) {
				log('info', `Loaded ${contributors.length} contributors for repository: ${repoSlug}`)
			})

			// And return our result
			.done(next)

		// Chain
		return this
	}


	// Load Paths
	// Load in the paths we have specified
	// Usage: `loadPaths(function (err) {})`
	// @TODO REWRITE THIS
	loadPaths (next) {
		// Create the parallel task group and once they've all completed fire our completion callback
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(next)

		// First load in the packages
		tasks.addTask((complete) => {
			this.loadPackages(this.pathsForPackageFiles, (err, dataForPackageFiles) => {
				if ( err )  return complete(err)
				this.dataForPackageFiles = dataForPackageFiles
				complete()
			})
		})

		// Then load in our readmes
		tasks.addTask((complete) => {
			this.loadMetas(this.pathsForMetaFiles, (err, dataForMetaFiles) => {
				if ( err )  return complete(err)
				this.dataForMetaFiles = dataForMetaFiles
				complete()
			})
		})

		// Finish up
		tasks.run()
		return this
	}

	// Load Packages
	// Load in the packages we have specified
	// Usage: `loadPackages(paths, function (err, dataForPackageFiles) {})`
	// @TODO REWRITE THIS
	loadPackages (pathsForPackageFiles, next) {
		const dataForPackageFiles = {}

		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			next(null, dataForPackageFiles)
		})

		eachr(pathsForPackageFiles, function (value, key) {
			tasks.addTask(function (complete) {
				dataForPackageFiles[key] = null
				fsUtil.exists(value, function (exists) {
					if ( exists === false )  return complete()
					const result = CSON.parseFile(value)
					if ( result instanceof Error )  return complete(result)
					dataForPackageFiles[key] = result
					complete()
				})
			})

			return true
		})

		// Finish up
		tasks.run()
		return this
	}


	// Load Metas
	// Load in the readmes we have specified
	// Usage: `loadPackages(paths, function (err, dataForMetaFiles) {})`
	// @TODO REWRITE THIS
	loadMetas (pathsForMetaFiles, next) {
		const dataForMetaFiles = {}

		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			next(null, dataForMetaFiles)
		})

		eachr(pathsForMetaFiles, function (value, key) {
			tasks.addTask(function (complete) {
				dataForMetaFiles[key] = null
				fsUtil.exists(value, function (exists) {
					if ( exists === false )  return complete()
					fsUtil.readFile(value, function (err, data) {
						if ( err )  return complete(err)
						dataForMetaFiles[key] = data.toString()
						complete()
					})
				})
			})
		})

		// Finish up
		tasks.run()
		return this
	}


	// Merge Packages
	mergeData (next) {
		// By first merging in all the package data together into the enhanced data
		extendr.deep(
			this.mergedPackageData,
			this.dataForPackageFiles.component || {},
			this.dataForPackageFiles.bower || {},
			this.dataForPackageFiles.jquery || {},
			this.dataForPackageFiles.package || {},
			this.dataForPackageFiles.projectz || {}
		)

		// ----------------------------------
		// Validation

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

		// Enable meta files based on whether they exist
		eachr(this.dataForMetaFiles, (value, name) => {
			if ( this.mergedPackageData.readmes[name] == null )  this.mergedPackageData.readmes[name] = value != null
		})

		// Enable package files based on whether they exist
		eachr(this.dataForPackageFiles, (value, name) => {
			if ( this.mergedPackageData.packages[name] == null )  this.mergedPackageData.packages[name] = value != null
		})

		// Fallback some defaults on the badges property
		extendr.defaults(this.mergedPackageData.badges, {
			// Enable the travis badge by default if the travis file had data
			travis:         this.dataForMetaFiles.travis != null,

			// Enable these badges by default if the packge file had data
			npm:            this.dataForPackageFiles.package != null,
			npmdownloads:   this.dataForPackageFiles.package != null,
			david:          this.dataForPackageFiles.package != null,
			daviddev:       this.dataForPackageFiles.package != null,
		})

		// Fallback some defaults on the merged object
		extendr.defaults(this.mergedPackageData, {
			// Fallback browsers field, by checking if `component` or `bower` package information exists
			browsers: this.mergedPackageData.browser || this.mergedPackageData.packages.component || this.mergedPackageData.packages.bower,

			// Fallback demo field, by scanning homepage
			demo: this.mergedPackageData.homepage,

			// Fallback title from name
			title: this.mergedPackageData.name || null
		})

		// Extract github information
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
			this.mergedPackageData.repo = githubSlug

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

		// Extract repo slug for easier work
		const repoSlug = this.mergedPackageData.repo

		// Add people to the fellow singleton with their appropriate permissions
		Fellow.add(this.mergedPackageData.author).forEach((fellow) => {
			fellow.authorsRepository(repoSlug)
		})
		Fellow.add(this.mergedPackageData.contributors).forEach((fellow) => {
			fellow.contributesRepository(repoSlug)
		})
		Fellow.add(this.mergedPackageData.maintainers).forEach((fellow) => {
			fellow.maintainsRepository(repoSlug)
		})

		// Add the enhanced collections to the merged data
		this.mergedPackageData.licenses = new projectzUtil.Licenses(this.mergedPackageData.license)
		this.mergedPackageData.authors = Fellow.authorsRepository(repoSlug)
		this.mergedPackageData.contributors = Fellow.contributesRepository(repoSlug)
		this.mergedPackageData.maintainers = Fellow.maintainsRepository(repoSlug)
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
				author:                 projectzUtil.getPeopleTextArray(Fellow.authorsRepository(this.mergedPackageData.repo), {years: true}).join(', '),
				maintainers:            projectzUtil.getPeopleTextArray(Fellow.maintainsRepository(this.mergedPackageData.repo)),
				contributors:           projectzUtil.getPeopleTextArray(Fellow.contributesRepository(this.mergedPackageData.repo)),
				bugs:                   this.mergedPackageData.bugs,
				engines:                this.mergedPackageData.engines,
				dependencies:           this.mergedPackageData.dependencies,
				devDependencies:        this.mergedPackageData.devDependencies,
				main:                   this.mergedPackageData.main
			}
		)

		// Explicit data
		if ( typeof this.mergedPackageData.packages.package === 'object' ) {
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
		if ( typeof this.mergedPackageData.packages.jquery === 'object' ) {
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
		if ( typeof this.mergedPackageData.packages.component === 'object' ) {
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
				main:                   this.mergedPackageData.main
			}
		)

		// Explicit data
		if ( typeof this.mergedPackageData.packages.bower === 'object' ) {
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
		eachr(this.dataForMetaFiles, (data, name) => {
			if ( !data ) {
				this.log('debug', `Enhancing meta file: ${name} — skipped`)
				return
			}
			data = projectzUtil.replaceSection(['TITLE', 'NAME'], data, `# ${opts.title}`)
			data = projectzUtil.replaceSection(['BADGES', 'BADGE'], data, badgeUtil.getBadgesSection(opts))
			data = projectzUtil.replaceSection(['DESCRIPTION'], data, opts.description)
			data = projectzUtil.replaceSection(['INSTALL'], data, installUtil.getInstallInstructions(opts))
			data = projectzUtil.replaceSection(['CONTRIBUTE', 'CONTRIBUTING'], data, backerUtil.getContributeSection(opts))
			data = projectzUtil.replaceSection(['BACKERS', 'BACKER'], data, backerUtil.getBackerSection(opts))
			data = projectzUtil.replaceSection(['BACKERSFILE', 'BACKERFILE'], data, backerUtil.getBackerFile(opts))
			data = projectzUtil.replaceSection(['HISTORY', 'CHANGES', 'CHANGELOG'], data, historyUtil.getHistorySection(opts))
			data = projectzUtil.replaceSection(['LICENSE', 'LICENSES'], data, licenseUtil.getLicenseSection(opts))
			data = projectzUtil.replaceSection(['LICENSEFILE'], data, licenseUtil.getLicenseFile(opts))
			this.dataForMetaFilesEnhanced[name] = data
			this.log('info', `Enhanced meta file: ${name}`)
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
		const log = this.log
		log('info', 'Writing changes...')
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			log('info', 'Wrote changes')
			return next()
		})

		// Save package files
		eachr(this.mergedPackageData.packages, (enabled, name) => {
			if ( name === 'projectz' ) {
				return
			}
			if ( !enabled ) {
				log('debug', `Saving package file: ${name} — skipped`)
				return
			}

			const path = this.pathsForPackageFiles[name]
			log('info', `Saving package file: ${path}`)
			tasks.addTask((complete) => {
				const data = JSON.stringify(this.dataForPackageFilesEnhanced[name], null, '  ') + '\n'
				fsUtil.writeFile(path, data, complete)
			})

			return true
		})

		// Safe readme files
		eachr(this.mergedPackageData.readmes, (enabled, name) => {
			if ( name === 'projectz' ) {
				return
			}
			if ( !enabled ) {
				log('debug', `Saving readme file: ${name} — skipped`)
				return
			}

			const path = this.pathsForMetaFiles[name]
			log('info', `Saving readme file: ${name}`)
			tasks.addTask((complete) => {
				const data = this.dataForMetaFilesEnhanced[name]
				fsUtil.writeFile(path, data, complete)
			})

			return true
		})

		// Finish up
		tasks.run()
		return this
	}
}
