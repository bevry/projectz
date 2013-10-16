# Import
projectzUtil = require('./projectz-util')

# Define
module.exports = contributeUtil =
	# Get Contributing Section
	getContributingSection: (opts) ->
		# Prepare
		file = 'Contributing.md'
		url = projectzUtil.getFileUrl(opts, file)

		# Return
		return """
			## Contributing
			[You can discover the contributing instructions inside the `#{file}` file](#{url})
			"""