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

// [OneDay](https://github.com/bevry/oneday) gives us the milliseconds in one day
const oneday = require('oneday')

// [Fellow](https://github.com/bevry/fellow) gives us a Fellow class with singleton functions for list management
const Fellow = require('fellow')

// Load in our other project files
const backerUtil = require('./backer-util')
const badgeUtil = require('./badge-util')
const historyUtil = require('./history-util')
const installUtil = require('./install-util')
const licenseUtil = require('./license-util')
const projectzUtil = require('./projectz-util')

// Helper functions
function csvToArray ( str ) {
	if ( typeof str === 'string') {
		return str.split(/[,\n]/).map(function (i) {
			return i.trim()
		})
	}
	return []
}

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
		this.pathsForPackages = null

		// The absolute paths for all the readme files
		this.pathsForReadmes = null

		// The data for each of our packages
		this.dataForPackages = null

		// The merged data for each of our packages
		this.dataForPackagesMerged = null

		// The enhanced data for each of our packages
		this.dataForPackagesEnhanced = null

		// The data for each of our readme files
		this.dataForReadmes = null

		// The enhanced data for each of our readme files
		this.dataForReadmesEnhanced = null

		// Our log function to use (logLevel, ...messages)
		this.log = opts.log || function () {}

		// Apply our determined paths for packages
		this.pathsForPackages = {
			projectz:      pathUtil.join(this.cwd, 'projectz.cson'),
			package:       pathUtil.join(this.cwd, 'package.json'),
			bower:         pathUtil.join(this.cwd, 'bower.json'),
			component:     pathUtil.join(this.cwd, 'component.json'),
			jquery:        pathUtil.join(this.cwd, 'jquery.json')
		}

		// Apply our determined paths for readmes
		this.pathsForReadmes = {
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
		this.dataForPackages = {}
		this.dataForPackagesMerged = {}
		this.dataForPackagesEnhanced = {}
		this.dataForReadmes = {}
		this.dataForReadmesEnhanced = {}

		// Create our serial task group to allot our tasks into and once it completes continue to the next handler
		tasks = new TaskGroup().done(next)

		// Load readme and package data
		tasks.addTask(this.loadPaths.bind(this))

		// Merge our package data
		tasks.addTask(this.mergePackages.bind(this))

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
		const repoSlug = this.dataForPackagesMerged.repo

		// Fetch the github and package contributors for it
		log('info', `Loading contributors for ${repoSlug} repository`)
		require('chainy-core').create().require('set feed map')
			// Fetch the repositories contributors
			.set(`https://api.github.com/repos/${repoSlug}/contributors?per_page=100&client_id=${githubClientId}&client_secret=${githubClientSecret}`)
			.feed()

			// Now lets replace the shallow member details with their full github profile details via the profile api
			.map(function(user, complete){
				this.create()
					.set(user.url)
					.feed()
					.done(complete)
			})

			// Now let's turn them into people
			.map(function (person) {
				return Fellow.ensure({
					name: person.name,
					email: person.email,
					description: person.bio,
					company: person.company,
					location: person.location,
					homepage: person.blog,
					hireable: person.hireable,
					githubUsername: person.login,
					githubUrl: person.html_url
				}).contributesToRepository(repoSlug)
			})

			// Log
			.action(function (contributors) {
				log('info', `Loaded ${contributors.length} contributors for ${repoSlug} repository`)
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

		// First load in the packages
		tasks.addTask((complete) => {
			this.loadPackages(this.pathsForPackages, (err,dataForPackages) => {
				if ( err )  return complete(err)
				this.dataForPackages = dataForPackages
				complete()
			})
		})

		// Then load in our readmes
		tasks.addTask((complete) => {
			this.loadReadmes(this.pathsForReadmes, (err,dataForReadmes) => {
				if ( err )  return complete(err)
				this.dataForReadmes = dataForReadmes
				complete()
			})
		})

		// Finish up
		tasks.run()
		return this
	}

	// Load Packages
	// Load in the packages we have specified
	// Usage: `loadPackages(paths, function (err, dataForPackages) {})`
	loadPackages (pathsForPackages, next) {
		const dataForPackages = {}

		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			next(null, dataForPackages)
		})

		eachr(pathsForPackages, function (value, key) {
			tasks.addTask(function (complete) {
				dataForPackages[key] = null
				fsUtil.exists(value, function (exists) {
					if ( exists === false )  return complete()
					result = CSON.parseFile(value)
					if ( result instanceof Error )  return complete(result)
					dataForPackages[key] = result
					complete()
				})
			})

			return true
		})

		// Finish up
		tasks.run()
		return this
	}


	// Load Readmes
	// Load in the readmes we have specified
	// Usage: `loadPackages(paths, function (err, dataForReadmes) {})`
	loadReadmes (pathsForReadmes, next) {
		const dataForReadmes = {}

		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			next(null, dataForReadmes)
		})

		eachr(pathsForReadmes, function (value, key) {
			tasks.addTask(function (complete) {
				dataForReadmes[key] = null
				fsUtil.exists(value, function (exists) {
					if ( exists === false )  return complete()
					fsUtil.readFile(value, function (err, data) {
						if ( err )  return complete(err)
						dataForReadmes[key] = data.toString()
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
	mergePackages (next) {
		// By first merging in all the package data together into the enhanced data
		extendr.deep(
			this.dataForPackagesMerged,
			this.dataForPackages.component,
			this.dataForPackages.bower,
			this.dataForPackages.jquery,
			this.dataForPackages.package,
			this.dataForPackages.projectz,
		)

		// ----------------------------------
		// Validation

		// Validate keywords field
		if ( typeChecker.isString(this.dataForPackagesMerged.keywords) ) {
			next(new Error('projectz: keywords field must be array instead of CSV'))
			return this
		}

		// Validate sponsors array
		if ( this.dataForPackagesMerged.sponsor ) {
			next(new Error('projectz: sponsor field is deprecated, use sponsors field'))
			return this
		}
		if ( typeChecker.isString(this.dataForPackagesMerged.sponsors) ) {
			next(new Error('projectz: sponsors field must be array instead of CSV'))
			return this
		}

		// Validate maintainers array
		if ( this.dataForPackagesMerged.maintainer ) {
			next(new Error('projectz: maintainer field is deprecated, use maintainers field'))
			return this
		}
		if ( typeChecker.isString(this.dataForPackagesMerged.maintainers) ) {
			next(new Error('projectz: maintainers field must be array instead of CSV'))
			return this
		}

		// Validate license SPDX string
		if ( typeChecker.isObject(this.dataForPackagesMerged.license) ) {
			next(new Error('projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}
		if ( typeChecker.isObject(this.dataForPackagesMerged.licenses) ) {
			next(new Error('projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}

		// ----------------------------------
		// Merging

		// Set some basic object defaults
		extendr.defaults(this.dataForPackagesMerged, {
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

		// Specify which readmes exist and have contents by setting their boolean value inside readmes to true if so
		eachr(this.dataForReadmes, (value, name) => {
			this.dataForPackagesMerged.readmes[name] = this.dataForPackages.readmes[name] && value != null
			return true
		})

		// Specify which packages exist and have contents by setting their boolean value inside packagess to true if so
		eachr(this.dataForPackages, (value, name) => {
			this.dataForPackagesMerged.packages[name] = this.dataForPackages.packages[name] && value != null
			return true
		})

		// Fallback badges, by checking if the relevant files exists
		extendr.setDefaults(this.dataForPackagesMerged.badges, {
			// Enable the travis badge by default if the travis file had data
			travis:         this.dataForReadmes.travis != null,

			// Enable these badges by default if the packge file had data
			npm:            this.dataForPackages.package != null,
			npmdownloads:   this.dataForPackages.package != null,
			david:          this.dataForPackages.package != null,
			daviddev:       this.dataForPackages.package != null
		})

		// Set other defaults
		extendr.setDefaults(this.dataForPackagesMerged, {
			// Fallback browsers field, by checking if `component` or `bower` package information exists
			browsers: this.dataForPackagesMerged.browser || this.dataForPackagesMerged.packages.component || this.dataForPackagesMerged.packages.bower,

			// Fallback demo field, by scanning homepage
			demo: this.dataForPackagesMerged.homepage,

			// Fallback title from name
			title: this.dataForPackagesMerged.name || null
		})

		// Extract github information
		const githubMatch = (this.dataForPackagesMerged.repository.url || this.dataForPackagesMerged.homepage).match(/github\.com\/(.+?)(?:\.git|\/)?$/)
		const githubMatchParts = (githubMatch && githubMatch[1] || '').split('/')
		if ( githubMatchParts.length === 2 ) {
			// Extract parts
			const [githubUsername, githubRepository] = githubMatchParts
			const githubSlug = githubUsername + '/' + githubRepository
			const githubUrl = 'https://github.com/' + githubSlug
			const githubRepositoryUrl = githubUrl + '.git'

			// Github data
			this.dataForPackagesMerged.github = {
				username: githubUsername,
				repository: githubRepository,
				slug: githubSlug,
				url: githubUrl,
				repositoryUrl: githubRepositoryUrl
			}
			this.dataForPackagesMerged.repo = githubSlug

			// Fallback fields
			extendr.setDefaults(this.dataForPackagesMerged, {
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
		const repoSlug = this.dataForPackagesMerged.repo

		// Add people to the fellow singleton with their appropriate permissions
		Fellow.add(this.dataForPackagesMerged.author).forEach((fellow) => {
			fellow.authorsRepository(repoSlug)
		})
		Fellow.add(this.dataForPackagesMerged.contributors).forEach((fellow) => {
			fellow.contributesRepository(repoSlug)
		})
		Fellow.add(this.dataForPackagesMerged.maintainers).forEach((fellow) => {
			fellow.maintainsRepository(repoSlug)
		})

		// Add the enhanced collections to the merged data
		this.dataForPackagesMerged.licenses = new projectzUtil.Licenses(this.dataForPackagesMerged.license)
		this.dataForPackagesMerged.authors = Fellow.authorsOfRepository(repoSlug)
		this.dataForPackagesMerged.contributors = Fellow.contributorsOfRepository(repoSlug)
		this.dataForPackagesMerged.maintainers = Fellow.maintainersOfRepository(repoSlug)
		this.dataForPackagesMerged.sponsors = Fellow.add(this.dataForPackagesMerged.sponsors)

		// Finish up
		next()
		return this
	}

	// Enhance Packages
	enhancePackages (next) {
		// Create the data for the `package.json` format
		this.dataForPackagesEnhanced.package = extendr.extend(
			// New Object
			{},

			// Old Data
			this.dataForPackages.package,

			// Enhanced Data
			{
				name:                   this.dataForPackagesMerged.name,
				version:                this.dataForPackagesMerged.version,
				license:                this.dataForPackagesMerged.license,
				description:            this.dataForPackagesMerged.description,
				keywords:               this.dataForPackagesMerged.keywords,
				author:                 projectzUtil.getPeopleTextArray(Fellow.authorsRepository(this.dataForPackagesMerged.repo), {years: true}).join(', '),
				maintainers:            projectzUtil.getPeopleTextArray(Fellow.maintainsRepository(this.dataForPackagesMerged.repo)),
				contributors:           projectzUtil.getPeopleTextArray(Fellow.contributesToRepository(this.dataForPackagesMerged.repo)),
				bugs:                   this.dataForPackagesMerged.bugs,
				engines:                this.dataForPackagesMerged.engines,
				dependencies:           this.dataForPackagesMerged.dependencies,
				devDependencies:        this.dataForPackagesMerged.devDependencies,
				main:                   this.dataForPackagesMerged.main
			},

			// Explicit Data
			this.dataForPackagesMerged.packages.package
		)

		// Create the data for the `jquery.json` format, which is essentially exactly the same as the `package.json` format so just extend that
		this.dataForPackagesEnhanced.jquery = extendr.extend({
			// New Object
			{},

			// Old Data
			this.dataForPackages.jquery,

			// Enhanced Data
			this.dataForPackagesEnhanced.package,

			// Explicit Data
			this.dataForPackagesMerged.jquery
		})

		// Create the data for the `component.json` format
		this.dataForPackagesEnhanced.component = extendr.extend({
			// New Object
			{},

			// Old Data
			this.dataForPackages.component,

			// Enhanced Data
			{
				name:                   this.dataForPackagesMerged.name
				version:                this.dataForPackagesMerged.version
				license:                this.dataForPackagesMerged.license
				description:            this.dataForPackagesMerged.description
				keywords:               this.dataForPackagesMerged.keywords
				demo:                   this.dataForPackagesMerged.demo
				main:                   this.dataForPackagesMerged.main
				scripts:                [this.dataForPackagesMerged.main]
			},

			// Explicit Data
			this.dataForPackagesMerged.packages.component
		})

		// Create the data for the `bower.json` format
		this.dataForPackagesEnhanced.bower = extendr.extend({
			// New Object
			{},

			// Old Data
			this.dataForPackages.bower,

			// Enhanced Data
			{
				name:                   this.dataForPackagesMerged.name
				version:                this.dataForPackagesMerged.version
				license:                this.dataForPackagesMerged.license
				description:            this.dataForPackagesMerged.description
				keywords:               this.dataForPackagesMerged.keywords
				main:                   this.dataForPackagesMerged.main
			},

			// Explicit Data
			this.dataForPackagesMerged.packages.bower
		})

		// Finish up
		next()
		return this
	}

	// Enhance Readmes
	enhanceReadmes (next) {
		const opts = this.dataForPackagesMerged
		eachr(this.dataForReadmes, (data, name) => {
			return  unless data
			data = projectzUtil.replaceSection(['TITLE', 'NAME'], data, "# ${opts.title}")
			data = projectzUtil.replaceSection(['BADGES', 'BADGE'], data, badgeUtil.getBadgesSection(opts))
			data = projectzUtil.replaceSection(['DESCRIPTION'], data, "${opts.description}")
			data = projectzUtil.replaceSection(['INSTALL'], data, installUtil.getInstallInstructions(opts))
			data = projectzUtil.replaceSection(['CONTRIBUTE', 'CONTRIBUTING'], data, backerUtil.getContributeSection(opts))
			data = projectzUtil.replaceSection(['BACKERS', 'BACKER'], data, backerUtil.getBackerSection(opts))
			data = projectzUtil.replaceSection(['BACKERSFILE', 'BACKERFILE'], data, backerUtil.getBackerFile(opts))
			data = projectzUtil.replaceSection(['HISTORY', 'CHANGES', 'CHANGELOG'], data, historyUtil.getHistorySection(opts))
			data = projectzUtil.replaceSection(['LICENSE', 'LICENSES'], data, licenseUtil.getLicenseSection(opts))
			data = projectzUtil.replaceSection(['LICENSEFILE'], data, licenseUtil.getLicenseFile(opts))
			@dataForReadmesEnhanced[name] = data
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
		log('info', "Writing changes...")
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(function (err) {
			if ( err )  return next(err)
			log('info', "Wrote changes")
			return next()
		})

		// Save package files
		eachr(this.dataForPackagesMerged.packages, (enabled, name) => {
			if ( name === 'projectz' ) {
				return
			}
			if ( !enabled ) {
				log('info', `Skipping package file: ${name}`)
				return
			}

			const path = this.pathsForPackages[name]
			log('info', `Writing package file: ${path}`)
			tasks.addTask((complete) => {
				const data = JSON.stringify(this.dataForPackagesEnhanced[name], null, '  ') + '\n'
				fsUtil.writeFile(path, data, complete)
			})

			return true
		})

		// Safe readme files
		eachr(this.dataForPackagesMerged.readmes, (enabled, name) => {
			if ( name === 'projectz' ) {
				return
			}
			if ( !enabled ) {
				log('info', `Skipping readme file: ${name}`)
				return
			}

			const path = this.pathsForReadmes[name]
			log('info', `Writing readme file: ${name}`)
			tasks.addTask((complete) => {
				data = this.dataForReadmesEnhanced[name]
				fsUtil.writeFile(path, data, complete)
			})

			return true
		})

		// Finish up
		tasks.run()
		return this
	}
}
