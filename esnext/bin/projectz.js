/* eslint no-extra-parens:0 */

// Projectz CLI

// Logging

// Set up our logging abilities using caterpillar [Caterpillar](https://github.com/bevry/caterpillar) for logging
// Import our logging lbiraries
const LOG_LEVEL_INFO = 6
const LOG_LEVEL_DEBUG = 7
const EXIT_ERROR_CODE = 1
const level  = process.argv.indexOf('-d') === -1 ? LOG_LEVEL_INFO : LOG_LEVEL_DEBUG
const logger = new (require('caterpillar').Logger)({level})
const filter = new (require('caterpillar-filter').Filter)()
const human  = new (require('caterpillar-human').Human)()

// Pipe logger output to filter, then filter output to stdout
logger.pipe(filter).pipe(human).pipe(process.stdout)


// Commands

// Use [Commander](https://github.com/visionmedia/commander.js/) for command and option parsing
const cli = require('commander')

// Extract out version out of our package and apply it to commander
cli.version(require('../../package.json').version)

// Add our cwd customisation
cli.option('-p, --path [value]', 'Path to the project that you wish to work with, defaults to the current working directory')
cli.option('-d', 'Outputs verbose logging.')

// Add the compile command that will create a new projectz instance and compile the project
cli.command('compile').description('Compile our project').action(function () {
	// Create our new project and use our caterpillar logger instance for the logging
	logger.log('info', 'Initialising project')
	const project = require('../../').create({
		log: logger.log.bind(logger),
		cwd: cli.path || null
	})
	logger.log('info', 'Initialised project')

	// Load the the files for the new project
	logger.log('info', 'Loading changes')
	project.load(function (err) {
		if ( err ) {
			logger.log('err', err.stack)
			process.exit(EXIT_ERROR_CODE)
		}
		logger.log('info', 'Loaded changes')

		// And apply the changes
		project.save(function (err) {
			if ( err ) {
				logger.log('err', err.stack)
				process.exit(EXIT_ERROR_CODE)
			}
			logger.log('info', 'Completed successfully')
		})
	})
})


// Start the commands
cli.parse(process.argv)
