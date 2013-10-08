# Import
fsUtil = require('fs')
pathUtil = require('path')
CSON = require('cson')
{TaskGroup} = require('taskgroup')
eachr = require('eachr')
extendr = require('extendr')
backers = require('./backers')
badges = require('./badges')
contributing = require('./contributing')
history = require('./history')
licenses = require('./licenses')
utils = require('./utils')

# Define
main =
	cwd: null
	pathsForPackages: null
	pathsForReadmes: null
	dataForPackages: null
	dataForPackagesEnhanced: null
	dataForReadmes: null
	contributors: []

	# Init
	init: (next) ->
		# Prepare
		@cwd = cwd = process.cwd()

		@pathsForPackages =
			projectz:      pathUtil.join(cwd, 'projectz.cson')
			package:       pathUtil.join(cwd, 'package.json')
			bower:         pathUtil.join(cwd, 'bower.json')
			component:     pathUtil.join(cwd, 'component.json')
			jquery:        pathUtil.join(cwd, 'jquery.json')

		@pathsForReadmes =
			readme:        pathUtil.join(cwd, 'README.md')
			history:       pathUtil.join(cwd, 'HISTORY.md')
			contributing:  pathUtil.join(cwd, 'CONTRIBUTING.md')
			backers:       pathUtil.join(cwd, 'BACKERS.md')
			license:       pathUtil.join(cwd, 'LICENSE.md')

		@dataForPackages = {}
		@dataForPackagesEnhanced = {}
		@dataForReadmes = {}

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

	# Log
	log: (args...) =>
		# Create
		unless @logger?
			# Import
			level  = if '-d' in process.argv.indexOf('-d') then 7 else 6
			@logger = new (require('caterpillar').Logger)({level:level})
			filter = new (require('caterpillar-filter').Filter)()
			human  = new (require('caterpillar-human').Human)()

			# Pipe logger output to filter, then filter output to stdout
			@logger.pipe(filter).pipe(human).pipe(process.stdout)

		# Log
		@logger.log(args...)

		# Chain
		@

	# Load Contributors
	# next(err)
	loadAndApplyContributors: (next) ->
		fetchContributors = require('getcontributors').create(log:@log)
		fetchContributors.fetchContributorsFromRepos @dataForPackagesEnhanced.merged.repo, (err) ->
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

# Extendr
extendr.extend({}, backers, badges, contributing, history, licenses, utils, main)

# Export
module.exports = main