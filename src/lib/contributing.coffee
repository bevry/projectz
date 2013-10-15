# Import
utils = require('./utils')

# Define
contributing =
	# Get Contributing Section
	getContributingSection: (opts) ->
		# Prepare
		file = 'Contributing.md'
		url = utils.getFileUrl(opts, file)

		# Return
		return """
			## Contributing
			[You can discover the contributing instructions inside the `#{file}` file](#{url})
			"""

# Export
module.exports = contributing