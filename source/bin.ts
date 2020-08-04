// Import process for deno compat
import process from 'process'

// Import caterpillar [Caterpillar](https://github.com/bevry/caterpillar) for logging
import { Logger, Filter, Human } from 'caterpillar'

// Import the package used to get the value of CLI arguments
import getarg from 'get-cli-arg'

// Import out projectz utility
import { Projectz } from './index.js'

async function main(): Promise<void> {
	// Compile
	if (process.argv.includes('compile')) {
		// fetch
		const p = getarg('path')
		const d = getarg('verbose')

		// bc upgrade
		if (process.argv.includes('-p')) {
			console.log(
				'projecz now requires -p argument to be specifie via --path=value'
			)
			return process.exit(1)
		}
		if (process.argv.includes('-d')) {
			console.log(
				'projecz now requires -d argument to be specifie via --verbose'
			)
			return process.exit(1)
		}

		// Prepare our logging configuration
		const level = d ? 7 : 6

		// Setup our logging
		const logger = new Logger({ lineLevel: level })
		const filter = new Filter({ filterLevel: level })
		const human = new Human()

		// Pipe logger output to filter, then filter output to stdout
		logger.pipe(filter).pipe(human).pipe(process.stdout)

		// Compile
		try {
			const project = new Projectz({
				log: logger.log.bind(logger),
				cwd: p || null,
			})
			await project.compile()
		} catch (err) {
			// error
			logger.log('err', err.stack)
			return process.exit(1)
		}

		// Done
		logger.log('info', 'Completed successfully')
	} else {
		// output help
		console.log(
			'projectz compile: merge our data files and compile our meta files'
		)
		console.log('\t--verbose\tOutputs verbose logging')
		console.log(
			'\t--path=value\tPath to the project that you wish to work with, defaults to the current working directory'
		)
		return process.exit(1)
	}
}

main()
