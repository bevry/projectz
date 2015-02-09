# Projectz

## Imports

First we need to import the libraries we require.

Load in the file system libraries.

[SafeFS](https://github.com/bevry/safefs) is aliased to `fsUtil` as it provides protection against a lot of the common gotchas

	fsUtil = require('safefs')
	pathUtil = require('path')

[CSON](https://github.com/bevry/cson) is used for loading in our configuration files

	CSON = require('cson')

[TypeChecker](https://github.com/bevry/typechecker) is used for checking data types

	typeChecker = require('typechecker')

[TaskGroup](https://github.com/bevry/taskgroup) is used for bundling tasks together and waiting for their completion

	{TaskGroup} = require('taskgroup')

[Eachr](https://github.com/bevry/eachr) lets us cycle arrays and objects easily

	eachr = require('eachr')

[Extendr](https://github.com/bevry/extendr) gives us safe, deep, and shallow extending abilities

	extendr = require('extendr')

Load in our other project files

	backerUtil = require('./backer-util')
	badgeUtil = require('./badge-util')
	historyUtil = require('./history-util')
	installUtil = require('./install-util')
	licenseUtil = require('./license-util')
	projectzUtil = require('./projectz-util')

Define some variables we'll use commonly

	oneDay = 1000*60*60*24


## Definition

Projects is defined as a class to ensure we can run multiple instances of it

	class Projectz


### Internal Properties

The current working directory (the path) that projectz is working on

		cwd: null

The absolute paths for all the package files

		pathsForPackages: null

The absolute paths for all the readme files

		pathsForReadmes: null

The data for each of our packages

		dataForPackages: null

The merged data for each of our packages

		dataForPackagesMerged: null

The enhanced data for each of our packages

		dataForPackagesEnhanced: null

The data for each of our readme files

		dataForReadmes: null

The enhanced data for each of our readme files

		dataForReadmesEnhanced: null

Our log function to use

		log: null


### Constructor

Options:

- `cwd` the directory that we wish to do our work on, defaults to `process.cwd()`
- `log` the log function to use, first argument being the log level

Usage:

- `project = require('projectz').create(opts)`
- `project = new (require('projectz').Projectz)(opts)`

		constructor: (opts={}) ->

Apply our current working directory

			@cwd = pathUtil.resolve(opts.cwd)  if opts.cwd
			@cwd ?= process.cwd()

Apply our logging function

			@log = opts.log or null

Apply our determined paths for packages

			@pathsForPackages =
				projectz:      pathUtil.join(@cwd, 'projectz.cson')
				package:       pathUtil.join(@cwd, 'package.json')
				bower:         pathUtil.join(@cwd, 'bower.json')
				component:     pathUtil.join(@cwd, 'component.json')
				jquery:        pathUtil.join(@cwd, 'jquery.json')

Apply our determined paths for readmes

			@pathsForReadmes =
				readme:        pathUtil.join(@cwd, 'README.md')
				history:       pathUtil.join(@cwd, 'HISTORY.md')
				contributing:  pathUtil.join(@cwd, 'CONTRIBUTING.md')
				backers:       pathUtil.join(@cwd, 'BACKERS.md')
				license:       pathUtil.join(@cwd, 'LICENSE.md')
				travis:        pathUtil.join(@cwd, '.travis.yml')

### Log

You can pass over your own logging function if you'd like.

Usage: `log (logLevel, args...) ->`

		log: (args...) =>
			@config.log?(args...)
			@


### Load

Load in the files we will be working with

Usage: `load (err) ->`

		load: (next) ->

Reset/apply our data for the different properties

			@dataForPackages = {}
			@dataForPackagesMerged = {}
			@dataForPackagesEnhanced = {}
			@dataForReadmes = {}
			@dataForReadmesEnhanced = {}

Create our serial task group to allot our tasks into and once it completes continue to the next handler

			tasks = new TaskGroup().done(next)

Load readme and package data

			tasks.addTask @loadPaths.bind(@)

Merge our package data

			tasks.addTask @mergePackages.bind(@)

Fetch the latest contributors. This is after the merging as we access merged properties to be able to do this.

			tasks.addTask @loadContributors.bind(@)

Enhance our package data

			tasks.addTask @enhancePackages.bind(@)

Enhance our readme data

			tasks.addTask @enhanceReadmes.bind(@)

Finish up

			return tasks.run(); @


### Load Contributors

Fetch the contributors for the repo if we have it

Usage: `loadContributors (err) ->`

		loadContributors: (next) ->
			log = @log

Check if we have the repo data, if we don't then we should exit and chain right away

			repo = @dataForPackagesMerged.repo
			unless repo
				log('info', 'Skipping loading contributors as project repo is not defined')
				return next(); @

If we do have a repo, then fetch the contributor data for it

			fetchContributors = require('getcontributors').create(log: @log, cache:oneDay)
			fetchContributors.fetchContributorsFromRepos [repo], (err,result) =>
				return next(err)  if err
				@dataForPackagesMerged.contributors = contributors = fetchContributors.getContributors()
				log('info', "Loaded #{contributors.length} contributors from #{repo} repository")
				return next()

Finish up

			return @


### Load Paths

Load in the paths we have specified

Usage: `loadPaths (err) ->`

		loadPaths: (next) ->

Create the parallel task group and once they've all completed fire our completion callback

			tasks = new TaskGroup().setConfig(concurrency:0).done(next)

First load in the packages

			tasks.addTask (complete) =>
				@loadPackages @pathsForPackages, (err,dataForPackages) =>
					return complete(err) if err
					@dataForPackages = dataForPackages
					return complete()

Then load in our readmes

			tasks.addTask (complete) =>
				@loadReadmes @pathsForReadmes, (err,dataForReadmes) =>
					return complete(err)  if err
					@dataForReadmes = dataForReadmes
					return complete()

Finish up

			return tasks.run(); @


### Load Packages

Load in the packages we have specified

Usage: `loadPackages paths, (err, dataForPackages) ->`

		loadPackages: (pathsForPackages, next) ->
			dataForPackages = {}

			tasks = new TaskGroup().setConfig(concurrency:0).done (err) ->
				return next(err)  if err
				return next(null, dataForPackages)

			eachr pathsForPackages, (value,key) ->
				tasks.addTask (complete) ->
					dataForPackages[key] = null
					fsUtil.exists value, (exists) ->
						return complete()  if exists is false
						CSON.parseFile value, (err,data) ->
							return complete(err)  if err
							dataForPackages[key] = data
							return complete()
				return true

Finish up

			return tasks.run(); @


### Load Readmes

Load in the readmes we have specified

Usage: `loadPackages paths, (err, dataForReadmes) ->`

		loadReadmes: (pathsForReadmes, next) ->
			dataForReadmes = {}

			tasks = new TaskGroup().setConfig(concurrency:0).done (err) ->
				return next(err)  if err
				return next(null, dataForReadmes)

			eachr pathsForReadmes, (value,key) ->
				tasks.addTask (complete) ->
					dataForReadmes[key] = null
					fsUtil.exists value, (exists) ->
						return complete()  if exists is false
						fsUtil.readFile value, (err,data) ->
							return complete(err)  if err
							dataForReadmes[key] = data.toString()
							return complete()

Finish up

			return tasks.run(); @


### Merge Packages

		mergePackages: (next) ->

By first merging in all the package data together into the enhanced data

			extendr.extend(
				@dataForPackagesMerged
				@dataForPackages.component
				@dataForPackages.bower
				@dataForPackages.jquery
				@dataForPackages.package
				@dataForPackages.projectz
			)

			@dataForPackagesMerged.badges ?= {}
			@dataForPackagesMerged.readmes ?= {}
			@dataForPackagesMerged.packages ?= {}

			eachr @dataForReadmes, (value, name) =>
				@dataForPackagesMerged.readmes[name] = @dataForPackages.readmes?[name] ? value?
				return true

			eachr @dataForPackages, (value, name) =>
				@dataForPackagesMerged.packages[name] = @dataForPackages.packages?[name] ? value?
				return true

Fallback badges, by checking if the relevant files exists

			@dataForPackagesMerged.badges.travis ?= @dataForReadmes.travis?
			@dataForPackagesMerged.badges.npm ?= @dataForPackages.package?
			@dataForPackagesMerged.badges.npmdownloads ?= @dataForPackages.package?
			@dataForPackagesMerged.badges.david ?= @dataForPackages.package?
			@dataForPackagesMerged.badges.daviddev ?= @dataForPackagesMerged.badges.david

Fallback browsers field, by checking if `component` or `bower` package information exists

			@dataForPackagesMerged.browsers ?= true  if @dataForPackagesMerged.browser or @dataForPackagesMerged.packages.component or @dataForPackagesMerged.packages.bower

Fallback demo field, by scanning homepage

			@dataForPackagesMerged.homepage ?= @dataForPackagesMerged.homepage
			@dataForPackagesMerged.demo ?= @dataForPackagesMerged.homepage

Fallback repo, by scanning repository and homepage

			unless @dataForPackagesMerged.repo
				if @dataForPackagesMerged.repository?.url
					@dataForPackagesMerged.repo = @dataForPackagesMerged.repository?.url
				else if (@dataForPackagesMerged.homepage or '').indexOf('github.com') isnt -1
					@dataForPackagesMerged.repo = @dataForPackagesMerged.homepage

Extract out repo full name from urls

			if @dataForPackagesMerged.repo
				@dataForPackagesMerged.repo = @dataForPackagesMerged.repo.replace(/^.+?github.com\//, '').replace(/(\.git|\/)+$/, '') or null

Fallback title from name

			if @dataForPackagesMerged.name
				@dataForPackagesMerged.title ?= @dataForPackagesMerged.name

Fallback username out of repo

			if @dataForPackagesMerged.repo
				@dataForPackagesMerged.username ?= @dataForPackagesMerged.repo.replace(/\/.*$/, '')

Fallback repository field, by scanning repo

			if @dataForPackagesMerged.repo
				@dataForPackagesMerged.repository ?= {
					type: 'git'
					url: "https://github.com/#{@dataForPackagesMerged.repo}.git"
				}
				@dataForPackagesMerged.bugs ?= {
					url: "https://github.com/#{@dataForPackagesMerged.repo}/issues"
				}

Enhance keywords, with CSV format

			@dataForPackagesMerged.keywords = @dataForPackagesMerged.keywords.split(/[,\n]+/)  if typeChecker.isString(@dataForPackagesMerged.keywords)

Fallback contributors

			@dataForPackagesMerged.contributors ?= []

Fallback sponsors

			@dataForPackagesMerged.sponsors ?= []
			@dataForPackagesMerged.sponsors = @dataForPackagesMerged.sponsors.split(/[,\n]/).map((i)->i.trim())  if typeChecker.isString(@dataForPackagesMerged.sponsors)

Fallback maintainers

			@dataForPackagesMerged.maintainers ?= @dataForPackagesMerged.maintainer or ''
			@dataForPackagesMerged.maintainers = @dataForPackagesMerged.maintainers.split(/[,\n]/).map((i)->i.trim())  if typeChecker.isString(@dataForPackagesMerged.maintainers)
			@dataForPackagesMerged.maintainers = [@dataForPackagesMerged.maintainers]  unless typeChecker.isArray(@dataForPackagesMerged.maintainers)
			@dataForPackagesMerged.maintainer = @dataForPackagesMerged.maintainers.join(', ')

Fallback authors

			@dataForPackagesMerged.authors ?= @dataForPackagesMerged.author or ''
			@dataForPackagesMerged.authors = @dataForPackagesMerged.authors.split(/[,\n]/).map((i)->i.trim())  if typeChecker.isString(@dataForPackagesMerged.authors)
			@dataForPackagesMerged.authors = [@dataForPackagesMerged.authors]  unless typeChecker.isArray(@dataForPackagesMerged.authors)
			@dataForPackagesMerged.author = @dataForPackagesMerged.authors.join(', ')

Fallback licenses

			@dataForPackagesMerged.licenses ?= @dataForPackagesMerged.license or ''
			@dataForPackagesMerged.licenses = @dataForPackagesMerged.licenses.split(/[,\n]/).map((i)->i.trim())  if typeChecker.isString(@dataForPackagesMerged.licenses)
			@dataForPackagesMerged.licenses = [@dataForPackagesMerged.licenses]  unless typeChecker.isArray(@dataForPackagesMerged.licenses)
			@dataForPackagesMerged.licenses = @dataForPackagesMerged.licenses.map (value) =>
				value = {type:value}  if typeChecker.isString(value)
				return value
			delete @dataForPackagesMerged.license

Finish up

			return next(); @


### Enhance Packages

		enhancePackages: (next) ->

Create the data for the `package.json` format

			@dataForPackagesEnhanced.package = extendr.extend(
				# New Object
				{}

				# Old Data
				@dataForPackages.package

				# Enhanced Data
				{
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					licenses:               @dataForPackagesMerged.licenses
					description:            @dataForPackagesMerged.description
					keywords:               @dataForPackagesMerged.keywords
					author:                 @dataForPackagesMerged.author
					maintainers:            @dataForPackagesMerged.maintainers
					contributors:           @dataForPackagesMerged.contributors.map (contributor) -> contributor.text
					bugs:                   @dataForPackagesMerged.bugs
					engines:                @dataForPackagesMerged.engines
					dependencies:           @dataForPackagesMerged.dependencies
					devDependencies:        @dataForPackagesMerged.devDependencies
					main:                   @dataForPackagesMerged.main
				}

				# Explicit Data
				@dataForPackagesMerged.packages.package
			)

			# Clean up licenses
			switch @dataForPackagesEnhanced.package.licenses.length
				when 0
					delete @dataForPackagesEnhanced.package.licenses
					delete @dataForPackagesEnhanced.package.license

				when 1
					@dataForPackagesEnhanced.package.license = @dataForPackagesEnhanced.package.licenses[0]
					delete @dataForPackagesEnhanced.package.licenses

				when 2
					delete @dataForPackagesEnhanced.package.license


Create the data for the `jquery.json` format, which is essentially exactly the same as the `package.json` format so just extend that

			@dataForPackagesEnhanced.jquery = extendr.extend(
				# New Object
				{}

				# Old Data
				@dataForPackages.jquery

				# Enhanced Data
				@dataForPackagesEnhanced.package

				# Explicit Data
				@dataForPackagesMerged.jquery
			)

Create the data for the `component.json` format

			@dataForPackagesEnhanced.component = extendr.extend(
				# New Object
				{}

				# Old Data
				@dataForPackages.component

				# Enhanced Data
				{
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					license:                @dataForPackagesMerged.licenses?[0].type
					description:            @dataForPackagesMerged.description
					keywords:               @dataForPackagesMerged.keywords
					demo:                   @dataForPackagesMerged.demo
					main:                   @dataForPackagesMerged.main
					scripts:                [@dataForPackagesMerged.main]
				}

				# Explicit Data
				@dataForPackagesMerged.packages.component
			)

Create the data for the `bower.json` format

			@dataForPackagesEnhanced.bower = extendr.extend(
				# New Object
				{}

				# Old Data
				@dataForPackages.bower

				# Enhanced Data
				{
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					license:                @dataForPackagesMerged.licenses?[0].type
					description:            @dataForPackagesMerged.description
					keywords:               @dataForPackagesMerged.keywords
					main:                   @dataForPackagesMerged.main
				}

				# Explicit Data
				@dataForPackagesMerged.packages.bower
			)

Finish up

			return next(); @


### Enhance Readmes

		enhanceReadmes: (next) ->
			opts = @dataForPackagesMerged

			eachr @dataForReadmes, (data, name) =>
				return  unless data
				data = projectzUtil.replaceSection(['TITLE', 'NAME'], data, "# #{opts.title}")
				data = projectzUtil.replaceSection(['BADGES', 'BADGE'], data, badgeUtil.getBadgesSection(opts))
				data = projectzUtil.replaceSection(['DESCRIPTION'], data, "#{opts.description}")
				data = projectzUtil.replaceSection(['INSTALL'], data, installUtil.getInstallInstructions(opts))
				data = projectzUtil.replaceSection(['CONTRIBUTE', 'CONTRIBUTING'], data, backerUtil.getContributeSection(opts))
				data = projectzUtil.replaceSection(['BACKERS', 'BACKER'], data, backerUtil.getBackerSection(opts))
				data = projectzUtil.replaceSection(['BACKERSFILE', 'BACKERFILE'], data, backerUtil.getBackerFile(opts))
				data = projectzUtil.replaceSection(['HISTORY', 'CHANGES', 'CHANGELOG'], data, historyUtil.getHistorySection(opts))
				data = projectzUtil.replaceSection(['LICENSE', 'LICENSES'], data, licenseUtil.getLicenseSection(opts))
				data = projectzUtil.replaceSection(['LICENSEFILE'], data, licenseUtil.getLicenseFile(opts))
				@dataForReadmesEnhanced[name] = data
				return true

Finish up

			return next(); @

### Save

Save the data we've loaded into the files

Usage: `save (err) ->`

		save: (next) ->
			log = @log

			log('info', "Writing changes...")

			tasks = new TaskGroup().setConfig(concurrency:0).done (err) ->
				return next(err)  if err
				log('info', "Wrote changes")
				return next()

Save package files

			eachr @dataForPackagesMerged.packages, (enabled, name) =>
				return  if name is 'projectz'
				unless enabled
					log('info', "Skipping package file: #{name}")
					return

				path = @pathsForPackages[name]
				log('info', "Writing package file: #{path}")
				tasks.addTask (complete) =>
					data = JSON.stringify(@dataForPackagesEnhanced[name], null, '  ')
					fsUtil.writeFile(path, data, complete)

				return true

Safe readme files

			eachr @dataForPackagesMerged.readmes, (enabled, name) =>
				return  if name is 'projectz'
				unless enabled
					log('info', "Skipping readme file: #{name}")
					return

				path = @pathsForReadmes[name]
				log('info', "Writing readme file: #{name}")
				tasks.addTask (complete) =>
					data = @dataForReadmesEnhanced[name]
					fsUtil.writeFile(path, data, complete)

				return true

Finish up

			return tasks.run(); @


## Export

Merge the other parts of our program together and export it

	module.exports =
		Projectz: Projectz
		create: (opts) -> new Projectz(opts)

