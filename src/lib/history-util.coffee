# Import
projectzUtil = require('./projectz-util')

# Define
module.exports = historyUtil =
	# Get History Section
	getHistorySection: (opts) ->
		# Prepare
		file = 'History.md'
		url = projectzUtil.getFileUrl(opts, file)

		# Return
		return """
			## History
			[You can discover the history inside the `#{file}` file](#{url})
			"""