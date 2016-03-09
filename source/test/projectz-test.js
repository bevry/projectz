'use strict'

// Import
const safeps = require('safeps')
const joe = require('joe')
const pathUtil = require('path')
const fsUtil = require('fs')
const {equal} = require('assert-helpers')


// -------------------------------------
// Configuration

// Paths
const projectzPath = pathUtil.join(__dirname, '..', '..')
const srcPath      = pathUtil.join(projectzPath, 'test', 'src')
const expectPath   = pathUtil.join(projectzPath, 'test', 'out-expected')
const cliPath      = pathUtil.join(projectzPath, 'bin', 'projectz')


// -------------------------------------
// Tests

joe.suite('projectz integration suite', function (suite, test) {
	// Compile with Projectz using -p to switch to the source path.
	test('compile project with projectz', function (done) {
		const command = ['node', cliPath, 'compile', '-p', srcPath]
		safeps.spawn(command, {stdio: 'inherit'}, done)
	})

	// Check that the compiled files match correctly.
	suite('check result files', function (suite, test, done) {
		fsUtil.readdir(expectPath, function (err, files) {
			if (err)  return done(err)
			files.forEach(function (file) {

				// Create a test for the file
				test(file, function (done) {
					// Load the expected source.
					fsUtil.readFile(pathUtil.join(expectPath, file), 'utf8', function (err, expected) {
						if ( err )  return done(err)

						// Load the actual source.
						fsUtil.readFile(pathUtil.join(srcPath, file), 'utf8', function (err, actual) {
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
