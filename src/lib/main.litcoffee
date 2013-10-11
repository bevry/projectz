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

It accepts the following configuration:

- `cwd` the directory that we wish to do our work on, defaults to `process.cwd()`
- `log` the log function to use, first argument being the log level

And can be instantiated by either:

- `project = require('projectz').create(opts)`
- `project = new (require('projectz').Projectz)(opts)`


### Internal Properties

The current working directory (the path) that projectz is working on

		cwd: null

The absolute paths for all the package files

		pathsForPackages: null

The absolute paths for all the readme files

		pathsForReadmes: null

The data for each of our packages

		dataForPackages: null

The enhanced (normalised) data for each of our packages

		dataForPackagesEnhanced: null

The data that for each of our readme files

		dataForReadmes: null

The data for the projects contributors

		contributors: []

Our log function to use

		log: null


### Constructor

		constructor: (opts={}) ->

Apply our current working directory

			@cwd = cwd = opts.cwd = process.cwd()

Apply our logging function

			@log = opts.log or null

Apply our determined paths for packages

			@pathsForPackages =
				projectz:      pathUtil.join(cwd, 'projectz.cson')
				package:       pathUtil.join(cwd, 'package.json')
				bower:         pathUtil.join(cwd, 'bower.json')
				component:     pathUtil.join(cwd, 'component.json')
				jquery:        pathUtil.join(cwd, 'jquery.json')

Apply our determined paths for readmes

			@pathsForReadmes =
				readme:        pathUtil.join(cwd, 'README.md')
				history:       pathUtil.join(cwd, 'HISTORY.md')
				contributing:  pathUtil.join(cwd, 'CONTRIBUTING.md')
				backers:       pathUtil.join(cwd, 'BACKERS.md')
				license:       pathUtil.join(cwd, 'LICENSE.md')

Reset/apply our data for the different properties

			@dataForPackages = {}
			@dataForPackagesEnhanced = {}
			@dataForReadmes = {}

### Log

You can pass over your own logging function if you'd like.

The first argument it receives will be the log type/level.

		log: (args...) =>
			@config.log?(args...)
			@


### Load


		load: (next) ->

			# Load
			tasks = new TaskGroup().once('complete', next)

			tasks.addTask (complete) =>
				@loadAndApplyPaths(complete)

			tasks.addTask =>
				@dataForPackages.merged = extendr.extend({}, @dataForPackages.component, @dataForPackages.bower, @dataForPackages.package, @dataForPackages.generic)
				console.log 'data', @dataForPackages
				@dataForPackagesEnhanced.merged = extendr.extend({}, @dataForPackages.merged)

				@dataForPackagesEnhanced.merged.repo ?= (@dataForPackagesEnhanced.merged.repository?.url or @dataForPackagesEnhanced.merged.homepage or '').replace(/^.+?github.com\//, '').replace(/(\.git|\/)+$/, '') or null
				if @dataForPackagesEnhanced.merged.repo
					@dataForPackagesEnhanced.merged.repository ?= {
						type: 'git'
						url: "https://github.com/#{@dataForPackagesEnhanced.merged.repo}.git"
					}
					@dataForPackagesEnhanced.merged.bugs ?= {
						url: "https://github.com/#{@dataForPackagesEnhanced.merged.repo}/issues"
					}

				if typeof @dataForPackagesEnhanced.merged.keywords is 'string'
					@dataForPackagesEnhanced.merged.keywords = @dataForPackagesEnhanced.merged.keywords.split(/[, ]+/)

			tasks.addTask (complete) =>
				@loadAndApplyContributors(complete)

			tasks.addTask =>
				@dataForPackagesEnhanced.package = extendr.extend({
					name:                   @dataForPackagesEnhanced.name
					version:                @dataForPackagesEnhanced.version
					license:                @dataForPackagesEnhanced.license
					description:            @dataForPackagesEnhanced.description
					keywords:               @dataForPackagesEnhanced.keywords
					author:                 @dataForPackagesEnhanced.author
					maintainers:            @dataForPackagesEnhanced.maintainers
					contributors:           @contributors.map (contributor) -> contributor.text
					bugs:                   @dataForPackagesEnhanced.bugs
					engines:                @dataForPackagesEnhanced.engines
					dependencies:           @dataForPackagesEnhanced.dependencies
					main:                   @dataForPackagesEnhanced.main
				}, @dataForPackages.package)

				console.log @dataForPackagesEnhanced

			tasks.run()

			# Fetch the latest contributors
			# Fetch the latest backers
			# Read the package.json file
			# Normalize the package.json values

			# Return
			return @

		# Load Contributors
		# next(err)
		loadAndApplyContributors: (next) ->
			fetchContributors = require('getcontributors').create(log:@log)
			fetchContributors.fetchContributorsFromRepos [@dataForPackagesEnhanced.merged.repo], (err) ->
				return next(err)  if err
				@contributors = fetchContributors.getContributors()
				return next()
			@

		# Load Paths
		# next(err)
		loadAndApplyPaths: (next) ->
			tasks = new TaskGroup().setConfig(concurrency:0).once('complete', next)

			tasks.addTask (complete) =>
				@loadPackages @pathsForPackages, (err,dataForPackages) =>
					return complete(err) if err
					@dataForPackages = dataForPackages
					return complete()

			tasks.addTask (complete) =>
				@loadReadmes @pathsForReadmes, (err,dataForReadmes) =>
					return complete(err)  if err
					@dataForReadmes = dataForReadmes
					return complete()

			tasks.run()

			@

		# Load Packages
		# next(err, dataForPackages)
		loadPackages: (pathsForPackages, next) ->
			dataForPackages = {}

			tasks = new TaskGroup().setConfig(concurrency:0).once 'complete', (err) ->
				return next(err)  if err
				return next(null, dataForPackages)

			eachr pathsForPackages, (value,key) ->
				tasks.addTask (complete) ->
					fsUtil.exists value, (exists) ->
						return complete()  if exists is false
						CSON.parseFile value, (err,data) ->
							return complete(err)  if err
							dataForPackages[key] = data
							return complete()

			tasks.run()

			@

		# Load Readmes
		# next(err, dataForReadmes)
		loadReadmes: (pathsForReadmes, next) ->
			dataForReadmes = {}

			tasks = new TaskGroup().setConfig(concurrency:0).once 'complete', (err) ->
				return next(err)  if err
				return next(null, dataForReadmes)

			eachr pathsForReadmes, (value,key) ->
				tasks.addTask (complete) ->
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

		# Save
		save: (next) ->
			console.log JSON.stringify(@dataForPackagesEnhanced, null, '\t')
			return next()


## Export

Merge the other parts of our program together and export it

	module.exports =
		Projectz: Projectz
		create: (opts) -> new Projectz(opts)

