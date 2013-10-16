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
			[Discover the change history by heading on over to the `#{file}` file.](#{url})
			"""