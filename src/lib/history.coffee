# Define
history =
	# Get History Section
	getHistorySection: ->
		# Prepare
		file = 'History.md'
		url = @getFileUrl(file)

		# Return
		return """
			## History
			[You can discover the history inside the `#{file}` file](#{url})

			"""

# Export
module.exports = history