// builtin
import { join } from 'node:path'
import { readdir, readFile } from 'node:fs'

// local
import kava from 'kava'
import { equal } from 'assert-helpers'
import filedirname from 'filedirname'
import safeps from 'safeps'
const { spawn } = safeps

// -------------------------------------
// Paths

const [file, dir] = filedirname()
const projectzPath = join(dir, '..')
const binPath = join(dir, 'bin.js')
const srcPath = join(projectzPath, 'test-fixtures', 'src')
const expectPath = join(projectzPath, 'test-fixtures', 'out-expected')

// -------------------------------------
// Tests

function clean(src: string) {
	return src.replace(/@[0-9^~.]/, '[cleaned]')
}

kava.suite('projectz integration tests', function (suite, test) {
	// Compile with Projectz using -p to switch to the source path.
	test('compile project with projectz', function (done) {
		const command = ['node', binPath, '--offline', `--path=${srcPath}`]
		spawn(command, { stdio: 'inherit' }, done)
	})

	// Check that the compiled files match correctly.
	suite('check result files', function (suite, test, done) {
		readdir(expectPath, function (err, files) {
			if (err) return done(err)
			files.forEach(function (file) {
				// skip file if it is ignorable
				if (file.startsWith('.')) return
				// Create a test for the file
				test(file, function (done) {
					// Load the expected source.
					readFile(join(expectPath, file), 'utf8', function (err, expected) {
						if (err) return done(err)

						// Load the actual source.
						readFile(join(srcPath, file), 'utf8', function (err, actual) {
							if (err) return done(err)
							equal(clean(actual.trim()), clean(expected.trim()))

							// Complete the test for the file
							done()
						})
					})
				})
			})

			done()
		})
	})
})
