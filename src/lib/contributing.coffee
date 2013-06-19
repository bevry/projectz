# Define
contributing =
	# Get Contributing Section
	getContributingSection: ->
		# Prepare
		file = 'Contributing.md'
		url = @getFileUrl(file)

		# Return
		return """
			## Contributing
			[You can discover the contributing instructions inside the `#{file}` file](#{url})

			"""

# Export
module.exports = contributing