// Import
import { getGithubSlug } from './util.js'
import { spawn } from 'safeps'
import { suite } from 'kava'
import { join } from 'path'
import { readdir, readFile } from 'safefs'
import { equal } from 'assert-helpers'

// -------------------------------------
// Paths

const projectzPath = join(__dirname, '..')
const srcPath = join(projectzPath, 'test-fixtures', 'src')
const expectPath = join(projectzPath, 'test-fixtures', 'out-expected')
const cliPath = join(__dirname, 'bin.js')

// -------------------------------------
// Tests

function clean(src) {
	return src.replace(/@[0-9^~.]/, '[cleaned]')
}

suite('projectz unit tests', function (suite, test) {
	suite('getGithubSlug', function (suite, test) {
		test('short repo', function () {
			equal(getGithubSlug({ repository: 'bevry/projectz' }), 'bevry/projectz')
		})
		test('gist failure', function () {
			equal(getGithubSlug({ repository: 'gist:11081aaa281' }), null)
		})
		test('bitbucket failure', function () {
			equal(getGithubSlug({ repository: 'bitbucket:bb/repo' }), null)
		})
		test('gitlab failure', function () {
			equal(getGithubSlug({ repository: 'gitlab:gl/repo' }), null)
		})
		test('full repo', function () {
			equal(
				getGithubSlug({
					repository: { url: 'https://github.com/bevry/projectz' },
				}),
				'bevry/projectz'
			)
		})
		test('full repo with .git', function () {
			equal(
				getGithubSlug({
					repository: { url: 'https://github.com/bevry/projectz.git' },
				}),
				'bevry/projectz'
			)
		})
	})
})

suite('projectz integration tests', function (suite, test) {
	// Compile with Projectz using -p to switch to the source path.
	test('compile project with projectz', function (done) {
		const command = ['node', cliPath, 'compile', '-p', srcPath]
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
