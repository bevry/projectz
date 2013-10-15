# Import
utils = require('./utils')

# Define
history =
	# Get History Section
	getHistorySection: (opts) ->
		# Prepare
		file = 'History.md'
		url = utils.getFileUrl(opts, file)

		# Return
		return """
			## History
			[You can discover the history inside the `#{file}` file](#{url})
			"""

# Export
module.exports = history