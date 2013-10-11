# Projectz CLI

## Logging

Set up our logging abilities using caterpillar [Caterpillar](https://github.com/bevry/caterpillar) for logging

Import our logging lbiraries

	level  = if '-d' in process.argv.indexOf('-d') then 7 else 6
	logger = new (require('caterpillar').Logger)({level:level})
	filter  = new (require('caterpillar-filter').Filter)()
	human   = new (require('caterpillar-human').Human)()

Pipe logger output to filter, then filter output to stdout

	logger.pipe(filter).pipe(human).pipe(process.stdout)


## Commands

Use [Commander](https://github.com/visionmedia/commander.js/) for command and option parsing

	cli = require('commander')

Extract out version out of our package and apply it to commander

	cli.version(
		require('../../package.json').version
	)

Add the compile command that will create a new projectz instance and compile the project

	cli.command('compile')
		.description('Compile our project')
		.action ->

Create our new project and use our caterpillar logger instance for the logging

			logger.log('info', 'Initialising project')
			project = require('../../').create(
				log: logger.log.bind(logger)
			)
			logger.log('info', 'Initialised project')

Load the the files for the new project

			logger.log('info', 'Loading changes')
			project.load (err) ->
				return logger.err(err)  if err
				logger.log('info', 'Loaded changes')

And apply the changes

				project.save (err) ->
					return logger.err(err)  if err
					logger.log('info', 'Saved changes')
					# exit gracefully

Start the commands

	cli.parse(process.argv)