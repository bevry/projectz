/* @flow */
/* eslint key-spacing:0 */

// Imports
// First we need to import the libraries we require.

// Load in the file system libraries.
// [SafeFS](https://github.com/bevry/safefs) is aliased to `fsUtil` as it provides protection against a lot of the common gotchas
const {readdir, readFile, writeFile} = require('safefs')
const {resolve, join} = require('path')

// [CSON](https://github.com/bevry/cson) is used for loading in our configuration files
const CSON = require('cson')

// [TypeChecker](https://github.com/bevry/typechecker) is used for checking data types
const {isString, isObject} = require('typechecker')

// [TaskGroup](https://github.com/bevry/taskgroup) is used for bundling tasks together and waiting for their completion
const {TaskGroup} = require('taskgroup')

// [Eachr](https://github.com/bevry/eachr) lets us cycle arrays and objects easily
const eachr = require('eachr')

// [Extendr](https://github.com/bevry/extendr) gives us safe, deep, and shallow extending abilities
const extendr = require('extendr')

// Load in our other project files
const Person = require('./person.js')
const backerUtil = require('./backer-util.js')
const badgeUtil = require('./badge-util.js')
const historyUtil = require('./history-util.js')
const installUtil = require('./install-util.js')
const licenseUtil = require('./license-util.js')
const projectzUtil = require('./projectz-util.js')

// Definition
// Projects is defined as a class to ensure we can run multiple instances of it
class Projectz {
	/* :: cwd:string; */
	/* :: filenamesForPackageFiles:Object; */
	/* :: dataForPackageFiles:Object; */
	/* :: dataForPackageFilesEnhanced:Object; */
	/* :: filenamesForReadmeFiles:Object; */
	/* :: dataForReadmeFiles:Object; */
	/* :: dataForReadmeFilesEnhanced:Object; */
	/* :: mergedPackageData:Object; */
	/* :: log:function; */

	// Projectz.create(opts)
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
	constructor (opts /* :Object */) {
		// The current working directory (the path) that projectz is working on
		this.cwd = opts.cwd ? resolve(opts.cwd) : process.cwd()

		// Our log function to use (logLevel, ...messages)
		this.log = opts.log || function () {}
	}

	// Reset the properties of this class
	reset () /* :this */ {
		// The absolute paths for all the package files
		this.filenamesForPackageFiles = {
			// gets filled in with relative paths
			projectz:      false,
			package:       false,
			bower:         false,
			component:     false,
			jquery:        false
		}

		// The data for each of our package files
		this.dataForPackageFiles = {}

		// The enhanced data for each of our package files
		this.dataForPackageFilesEnhanced = {}

		// The absolute paths for all the readme files
		this.filenamesForReadmeFiles = {
			// gets filled in with relative paths
			readme:        false,
			history:       false,
			contributing:  false,
			backers:       false,
			license:       false
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
	load (next /* :function */) /* :this */ {
		// Reset
		this.reset()

		// Create our serial task group to allot our tasks into and once it completes continue to the next handler
		const tasks = new TaskGroup().done(next)

		// Load readme and package data
		tasks.addTask('loadPaths', this.loadPaths.bind(this))

		// Merge our package data
		tasks.addTask('mergeData', this.mergeData.bind(this))

		// Fetch the latest contributors. This is after the merging as we access merged properties to be able to do this.
		tasks.addTask('loadGithubContributors', (complete) => {
			this.loadGithubContributors((err) => {
				if ( err )  this.log('warn', 'Loading contributer data failed, continuing anyway. Here was the error:\n' + err.stack)
				complete()
			})
		})

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
	/* eslint array-callback-return:0 */
	loadGithubContributors (next /* :function */) /* :this */ {
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
		const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN
		const githubClientId = process.env.GITHUB_CLIENT_ID
		const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
		const githubAuthQueryString = githubAccessToken
			? `access_token=${githubAccessToken}`
			: githubClientId && githubClientSecret
				? `client_id=${githubClientId}&client_secret=${githubClientSecret}`
				: ''
		const url = `https://api.github.com/repos/${githubSlug}/contributors?per_page=100&${githubAuthQueryString}`

		// Fetch the github and package contributors for it
		log('info', `Loading contributors for repository: ${githubSlug}`)
		require('chainy-core').create().require('set feed map')
			// Fetch the repositories contributors
			.set(url)
			.feed()
			.action(function (data) {
				if ( !data )  throw new Error('No contributor data was returned, likely because this repository is new')
				if ( data.message )  throw new Error(data.message)
			})

			// Now lets replace the shallow member details with their full github profile details via the profile api
			.map(function (user, complete) {
				this.create()
					.set(user.url + '?' + githubAuthQueryString)
					.feed()
					.action(function (data) {
						if ( data.message )  throw new Error(data.message)
					})
					.done(complete)
			})

			// Now let's turn them into people
			.map(function (user) {
				const data = {
					name: user.name,
					email: user.email,
					description: user.bio,
					company: user.company,
					location: user.location,
					homepage: user.blog,
					hireable: user.hireable,
					githubUsername: user.login,
					githubUrl: user.html_url
				}
				const person = Person.ensure(data)
				person.contributesRepository(githubSlug)
			})

			// Log
			.action((contributors) => {
				log('info', `Loaded ${contributors.length} contributors for repository: ${githubSlug}`)
				this.mergedPackageData.contributors = Person.contributesRepository(githubSlug)
			})

			// And return our result
			.done(next)

		// Chain
		return this
	}


	// Load Paths
	// Load in the paths we have specified
	// Usage: `loadPaths(function (err) {})`
	loadPaths (next /* :function */) /* :this */ {
		// Create the parallel task group and once they've all completed fire our completion callback
		const tasks = new TaskGroup().setConfig({concurrency: 0}).done(next)

		// Apply our determined paths for packages
		const packages = Object.keys(this.filenamesForPackageFiles)
		const readmes = Object.keys(this.filenamesForReadmeFiles)

		// Load
		tasks.addTask((complete) => {
			readdir(this.cwd, (err, files) => {
				if ( err )  return complete(err)
				files.forEach((file) => {
					const filePath = join(this.cwd, file)

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
								readFile(filePath, (err, data) => {
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
	mergeData (next /* :function */) /* :this */ {
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
		if ( isString(this.mergedPackageData.keywords) ) {
			next(new Error('projectz: keywords field must be array instead of CSV'))
			return this
		}

		// Validate sponsors array
		if ( this.mergedPackageData.sponsor ) {
			next(new Error('projectz: sponsor field is deprecated, use sponsors field'))
			return this
		}
		if ( isString(this.mergedPackageData.sponsors) ) {
			next(new Error('projectz: sponsors field must be array instead of CSV'))
			return this
		}

		// Validate maintainers array
		if ( this.mergedPackageData.maintainer ) {
			next(new Error('projectz: maintainer field is deprecated, use maintainers field'))
			return this
		}
		if ( isString(this.mergedPackageData.maintainers) ) {
			next(new Error('projectz: maintainers field must be array instead of CSV'))
			return this
		}

		// Validate license SPDX string
		if ( isObject(this.mergedPackageData.license) ) {
			next(new Error('projectz: license field must now be a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}
		if ( isObject(this.mergedPackageData.licenses) ) {
			next(new Error('projectz: licenses field is deprecated, you must now use the license field as a valid SPDX string: https://docs.npmjs.com/files/package.json#license'))
			return this
		}

		// Validate package valuees
		for ( const name in this.mergedPackageData.packages ) {
			if ( this.mergedPackageData.packages.hasOwnProperty(name) ) {
				const value = this.mergedPackageData.packages[name]
				if ( !isObject(value) ) {
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
			// Fallback browsers field, by checking if `component` or `bower` package files exists, or if the `browser` or `jspm` fields are defined
			browsers: Boolean(this.filenamesForPackageFiles.bower || this.filenamesForPackageFiles.component || this.mergedPackageData.browser || this.mergedPackageData.jspm),

			// Fallback demo field, by scanning homepage
			demo: this.mergedPackageData.homepage,

			// Fallback title from name
			title: this.mergedPackageData.name || null
		})

		// Extract repository information
		/* eslint no-magic-numbers: 0 */
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
			// Add people to the Person singleton with their appropriate permissions
			Person.add(this.mergedPackageData.author).forEach((person) => {  // package author string
				person.authorsRepository(repo)
			})
			Person.add(this.mergedPackageData.authors).forEach((person) => {  // bower authors array
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
		}
		else {
			this.mergedPackageData.authors = Person.add(this.mergedPackageData.author || this.mergedPackageData.authors)
			this.mergedPackageData.contributors = Person.add(this.mergedPackageData.contributors)
			this.mergedPackageData.maintainers = Person.add(this.mergedPackageData.maintainers)
		}

		// Enhance licenses and sponsors
		this.mergedPackageData.sponsors = Person.add(this.mergedPackageData.sponsors)

		// Finish up
		next()
		return this
	}

	// Enhance Packages
	enhancePackages (next /* :function */) /* :this */ {
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
				author:                 projectzUtil.getPeopleTextArray(this.mergedPackageData.authors, {displayYears: true}).join(', '),
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
				authors:                projectzUtil.getPeopleTextArray(this.mergedPackageData.authors, {displayYears: true}),
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
	enhanceReadmes (next /* :function */) /* :this */ {
		const data = this.mergedPackageData
		eachr(this.dataForReadmeFiles, (value, name) => {
			if ( !value ) {
				this.log('debug', `Enhancing readme value: ${name} — skipped`)
				return
			}
			value = projectzUtil.replaceSection(['TITLE', 'NAME'], value, `<h1>${data.title}</h1>`)
			value = projectzUtil.replaceSection(['BADGES', 'BADGE'], value, badgeUtil.getBadgesSection.bind(null, data))
			value = projectzUtil.replaceSection(['DESCRIPTION'], value, data.description)
			value = projectzUtil.replaceSection(['INSTALL'], value, installUtil.getInstallInstructions.bind(null, data))
			value = projectzUtil.replaceSection(['CONTRIBUTE', 'CONTRIBUTING'], value, backerUtil.getContributeSection.bind(null, data))
			value = projectzUtil.replaceSection(['BACKERS', 'BACKER'], value, backerUtil.getBackerSection.bind(null, data))
			value = projectzUtil.replaceSection(['BACKERSFILE', 'BACKERFILE'], value, backerUtil.getBackerFile.bind(null, data))
			value = projectzUtil.replaceSection(['HISTORY', 'CHANGES', 'CHANGELOG'], value, historyUtil.getHistorySection.bind(null, data))
			value = projectzUtil.replaceSection(['LICENSE', 'LICENSES'], value, licenseUtil.getLicenseSection.bind(null, data))
			value = projectzUtil.replaceSection(['LICENSEFILE'], value, licenseUtil.getLicenseFile.bind(null, data))
			this.dataForReadmeFilesEnhanced[name] = projectzUtil.trim(value) + '\n'
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
	save (next /* :function */) /* :this */ {
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
			const filepath = join(this.cwd, filename)
			const message = `Saving package file: ${filepath}`
			tasks.addTask(message, (complete) => {
				this.log('info', message)
				const data = JSON.stringify(this.dataForPackageFilesEnhanced[name], null, '  ') + '\n'
				writeFile(filepath, data, complete)
			})
		})

		// Safe readme files
		eachr(this.filenamesForReadmeFiles, (filename, name) => {
			if ( !filename )  return
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

// Exports
module.exports = {Projectz}
