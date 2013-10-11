# Projectz

## Imports

First we need to import the libraries we require.

Load in the file system libraries.

[SafeFS](https://github.com/bevry/safefs) is aliased to `fsUtil` as it provides protection against a lot of the common gotchas

	fsUtil = require('safefs')
	pathUtil = require('path')

[CSON](https://github.com/bevry/cson) is used for loading in our configuration files

	CSON = require('cson')

[TaskGroup](https://github.com/bevry/taskgroup) is used for bundling tasks together and waiting for their completion

	{TaskGroup} = require('taskgroup')

[Eachr](https://github.com/bevry/eachr) lets us cycle arrays and objects easily

	eachr = require('eachr')

[Extendr](https://github.com/bevry/extendr) gives us safe, deep, and shallow extending abilities

	extendr = require('extendr')

Load in our other project files

	backers = require('./backers')
	badges = require('./badges')
	contributing = require('./contributing')
	history = require('./history')
	licenses = require('./licenses')
	utils = require('./utils')


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

The data that for each of our readme files

		dataForReadmes: null

The data for the projects contributors

		contributors: null

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

Apply our contributors

			@contributors = []

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

Create our serial task group to allot our tasks into and once it completes continue to the next handler

			tasks = new TaskGroup().once('complete', next)


First load in the paths we've defined

			tasks.addTask @loadPaths.bind(@)


Then enhance our data

			tasks.addTask =>

By first merging in all the package data together into the enhanced data

				extendr.deepExtend(
					@dataForPackagesMerged
					@dataForPackages.component
					@dataForPackages.projectz.component
					@dataForPackages.bower
					@dataForPackages.projectz.bower
					@dataForPackages.jquery
					@dataForPackages.projectz.jquery
					@dataForPackages.package
					@dataForPackages.projectz.package
					@dataForPackages.projectz
				)

				@dataForPackagesMerged.component = @dataForPackages.projectz.component
				@dataForPackagesMerged.bower = @dataForPackages.projectz.bower
				@dataForPackagesMerged.jquery = @dataForPackages.projectz.jquery
				@dataForPackagesMerged.package = @dataForPackages.projectz.package

				console.log @dataForPackagesMerged

Fallback repo, by scanning repository and homepage

				unless @dataForPackagesMerged.repo
					if @dataForPackagesMerged.repository?.url
						@dataForPackagesMerged.repo = @dataForPackagesMerged.repository?.url
					else if (@dataForPackagesMerged.homepage or '').indexOf('github.com') isnt -1
						@dataForPackagesMerged.repo = @dataForPackagesMerged.homepage.replace(/^.+?github.com\//, '').replace(/(\.git|\/)+$/, '') or null

Fallback repository field, by scanning repo

				if @dataForPackagesMerged.repo
					@dataForPackagesMerged.repository ?= {
						type: 'git'
						url: "https://github.com/#{@dataForPackagesMerged.repo}.git"
					}
					@dataForPackagesMerged.bugs ?= {
						url: "https://github.com/#{@dataForPackagesMerged.repo}/issues"
					}

Fallback demo field, by scanning homepage

				if @dataForPackagesMerged.homepage
					@dataForPackagesMerged.demo ?= @dataForPackagesMerged.homepage

Fallback license name, by scanning license

				if typeof @dataForPackagesMerged.license is 'string'
					@dataForPackagesMerged.licenseName = @dataForPackagesMerged.license
				else if typeof @dataForPackagesMerged.license is 'object'
					@dataForPackagesMerged.licenseName = @dataForPackagesMerged.license.name

Enhance keywords, with CSV format

				if typeof @dataForPackagesMerged.keywords is 'string'
					@dataForPackagesMerged.keywords = @dataForPackagesMerged.keywords.split(/[,\n]+/)


Next up is applying our contributors. This is after the merging as we access merged properties to be able to do this.

			tasks.addTask @loadContributors.bind(@)


Finally output our merged data into the individual packages for saving

			tasks.addTask =>

Create the data for the `package.json` format

				@dataForPackagesEnhanced.package = extendr.extend({
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					license:                @dataForPackagesMerged.license
					description:            @dataForPackagesMerged.description
					keywords:               @dataForPackagesMerged.keywords
					author:                 @dataForPackagesMerged.author
					maintainers:            @dataForPackagesMerged.maintainers
					contributors:           @contributors.map (contributor) -> contributor.text
					bugs:                   @dataForPackagesMerged.bugs
					engines:                @dataForPackagesMerged.engines
					dependencies:           @dataForPackagesMerged.dependencies
					devDependencies:        @dataForPackagesMerged.devDependencies
					main:                   @dataForPackagesMerged.main
				}, @dataForPackagesMerged.package)

Create the data for the `jquery.json` format, which is essentially exactly the same as the `package.json` format so just extend that

				@dataForPackagesEnhanced.jquery = extendr.extend(
					{}
					@dataForPackagesEnhanced.package
					@dataForPackagesMerged.jquery
				)

Create the data for the `component.json` format

				@dataForPackagesEnhanced.component = extendr.extend({
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					license:                @dataForPackagesMerged.licenseName
					description:            @dataForPackagesMerged.description
					keywords:               @dataForPackagesMerged.keywords
					demo:                   @dataForPackagesMerged.demo
					main:                   @dataForPackagesMerged.main
					scripts:                [@dataForPackagesMerged.main]
				}, @dataForPackagesMerged.component)

Create the data for the `bower.json` format

				@dataForPackagesEnhanced.bower = extendr.extend({
					name:                   @dataForPackagesMerged.name
					version:                @dataForPackagesMerged.version
					dependencies:           @dataForPackagesMerged.dependencies
					devDependencies:        @dataForPackagesMerged.devDependencies
					main:                   @dataForPackagesMerged.main
				}, @dataForPackagesMerged.bower)


Now that all our tasks are added, start executing them

			tasks.run()

And finish with a chain

			return @


### Load Contributors

Fetch the contributors for the repo if we have it

Usage: `loadContributors (err) ->`

		loadContributors: (next) ->

Check if we have the repo data, if we don't then we should exit and chain right away

			repo = @dataForPackagesMerged.repo
			return next(); @  unless repo

If we do have a repo, then fetch the contributor data for it

			fetchContributors = require('getcontributors').create(log: @log)
			fetchContributors.fetchContributorsFromRepos [repo], (err) ->
				return next(err)  if err
				@contributors = fetchContributors.getContributors()
				return next()

Finish with a chain

			return @


### Load Paths

Load in the paths we have specified

Usage: `loadPaths (err) ->`

		loadPaths: (next) ->

Create the parallel task group and once they've all completed fire our completion callback

			tasks = new TaskGroup().setConfig(concurrency:0).once('complete', next)

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

Fire the tasks

			tasks.run()

Finish with a chain

			@


### Load Packages

Load in the packages we have specified

Usage: `loadPackages paths, (err, dataForPackages) ->`

		loadPackages: (pathsForPackages, next) ->
			dataForPackages = {}

			tasks = new TaskGroup().setConfig(concurrency:0).once 'complete', (err) ->
				return next(err)  if err
				return next(null, dataForPackages)

			eachr pathsForPackages, (value,key) ->
				tasks.addTask (complete) ->
					dataForPackages[key] = {}
					fsUtil.exists value, (exists) ->
						return complete()  if exists is false
						CSON.parseFile value, (err,data) ->
							return complete(err)  if err
							dataForPackages[key] = data
							return complete()

			tasks.run()

			@

### Load Readmes

Load in the readmes we have specified

Usage: `loadPackages paths, (err, dataForReadmes) ->`

		loadReadmes: (pathsForReadmes, next) ->
			dataForReadmes = {}

			tasks = new TaskGroup().setConfig(concurrency:0).once 'complete', (err) ->
				return next(err)  if err
				return next(null, dataForReadmes)

			eachr pathsForReadmes, (value,key) ->
				tasks.addTask (complete) ->
					dataForReadmes[key] = ''
					fsUtil.exists value, (exists) ->
						return complete()  if exists is false
						fsUtil.readFile value, (err,data) ->
							return complete(err)  if err
							dataForReadmes[key] = data.toString()
							return complete()

			tasks.run()

			@

		# Apply Section
		applySections: ->
			# Find the badges section and replace
			# Find the history section and replace
			# Find the contributing section and replace
			# Find the backers section and replace
			# Find the license section and replace

			# Return
			return ''

		# Apply Files
		applyFiles: ->
			# Update the backers file
			# Update the license file
			# Update the readme file

### Save

Save the data we've loaded into the files

Usage: `save (err) ->`

		save: (next) ->
			console.log JSON.stringify(@dataForPackagesEnhanced, null, '\t')
			return next()


## Export

Merge the other parts of our program together and export it

	module.exports =
		Projectz: Projectz
		create: (opts) -> new Projectz(opts)

