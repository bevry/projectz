# CompileTest
safeps = require('safeps')
joe = require('joe')
pathUtil = require('path')
fs = require('fs')
{expect} = require('chai')

# -------------------------------------
# Configuration

# Paths
projectzPath = pathUtil.join(__dirname, '..', '..')
testPath     = pathUtil.join(projectzPath, 'test')
srcPath      = pathUtil.join(projectzPath, 'test', 'src')
expectPath   = pathUtil.join(projectzPath, 'test', 'out-expected')
cliPath      = pathUtil.join(projectzPath, 'bin', 'projectz')

# -------------------------------------
# Tests

joe.suite 'projectz-compile', (suite,test) ->
	test 'compile', (done) ->

		# Compile with Projectz using -p to switch to the source path.
		command = [cliPath, 'compile', '-p', srcPath]
		safeps.spawnCommand 'node', command, {stdio:'inherit'}, (err) ->
			return done(err) if err

			# Check that the compiled files match correctly.
			suite 'files', (suite,test) ->
				for file in fs.readdirSync(expectPath)
					# Ensure the file context is kept across the asyncronous calls.
					((file) ->
						test file, (done) ->
							# Load the expected source.
							fs.readFile pathUtil.join(expectPath, file), 'utf8', (err, expected) ->
								return done(err)  if err
								# Load the actual source.
								fs.readFile pathUtil.join(srcPath, file), 'utf8', (err, actual) ->
									return done(err)  if err
									expect(actual).to.equal(expected)
									done()
					)(file);
			done()
