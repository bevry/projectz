// builtin
import { argv, cwd, stdout } from 'node:process'

// external
import { Logger, Filter, Human } from 'caterpillar'

// local
import { Projectz } from './index.js'

// cli
import Argument from '@bevry/argument'
const help = `
	USAGE:
	projectz [...options]

	OPTIONS:
	--path=<string>
	  The directory to process, defaults to the current working directory.

	--[no-]verbose[=<boolean>]
	  Set the logging level to verbose (log level 7 instead of the default 6).

	--[no-]offline[=<boolean>]
	  If enabled, then remote updates will be not performed (such as fetching latest backers).

	compile
	  Prior to version 3.5, this was necessary for projectz to do its thing. Now it is the default behaviour.`

async function main(args: Array<string>): Promise<void> {
	// parse arguments
	let path: string = cwd(),
		verbose: boolean = false,
		offline: boolean = false
	for (const arg of args) {
		const a = new Argument(arg)
		switch (a.key) {
			case 'help': {
				return Argument.help(help)
			}
			case 'path': {
				path = a.string({ enabled: path })
				break
			}
			case 'verbose': {
				verbose = a.boolean()
				break
			}
			case 'offline': {
				offline = a.boolean()
				break
			}
			case 'compile': {
				console.warn(
					a.arg,
					'is no longer necessary, and is now the default behaviour.',
				)
				break
			}
			default: {
				switch (a.value) {
					case 'compile': {
						console.warn(
							a.arg,
							'is no longer necessary, and is now the default behaviour.',
						)
						break
					}
					default: {
						return a.unknown()
					}
				}
			}
		}
	}

	// setup our logging
	const level = verbose ? 7 : 6
	const logger = new Logger({ lineLevel: verbose ? level : -Infinity })
	const filter = new Filter({ filterLevel: level })
	const human = new Human()
	logger.pipe(filter).pipe(human).pipe(stdout)

	// configure projectz
	const project = new Projectz({
		offline,
		cwd: path,
		log: logger.log.bind(logger),
	})

	// execute
	await project.compile()

	// done
	logger.log('info', 'Completed successfully')
}
main(argv.slice(2)).catch(Argument.catch(help))
