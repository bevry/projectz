# Import
extendr = require('extendr')
backers = require('./backers')
badges = require('./badges')
contributing = require('./contributing')
history = require('./history')
licenses = require('./licenses')
utils = require('./utils')

# Define
main =
	# Init
	init: ->
		# Fetch the latest contributors
		# Fetch the latest backers
		# Read the package.json file
		# Normalize the package.json values

		# Return
		return ''

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
modules.exports = main