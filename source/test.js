/* @flow */

// Import
import {spawn} from 'safeps'
import {suite} from 'joe'
import {join} from 'path'
import {readdir, readFile} from 'safefs'
import {equal} from 'assert-helpers'


// -------------------------------------
// Configuration

// Paths
const projectzPath = join(__dirname, '..')
const srcPath      = join(projectzPath, 'test-fixtures', 'src')
const expectPath   = join(projectzPath, 'test-fixtures', 'out-expected')
const cliPath      = join(projectzPath, 'bin.js')


// -------------------------------------
// Tests

suite('projectz integration suite', function (suite, test) {
	// Compile with Projectz using -p to switch to the source path.
	test('compile project with projectz', function (done) {
		const command = ['node', cliPath, 'compile', '-p', srcPath]
		spawn(command, {stdio: 'inherit'}, done)
	})

	// Check that the compiled files match correctly.
	suite('check result files', function (suite, test, done) {
		readdir(expectPath, function (err, files) {
			if (err)  return done(err)
			files.forEach(function (file) {

				// Create a test for the file
				test(file, function (done) {
					// Load the expected source.
					readFile(join(expectPath, file), 'utf8', function (err, expected) {
						if ( err )  return done(err)

						// Load the actual source.
						readFile(join(srcPath, file), 'utf8', function (err, actual) {
							if ( err )  return done(err)
							equal(actual.trim(), expected.trim())

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
