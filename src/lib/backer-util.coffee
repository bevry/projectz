module.exports = backerUtil =

	# Get Sponsor Backers
	getSponsorBackers: (opts={}) ->
		# Check
		return '' if !opts.sponsors

		# Prepare
		result = ''
		sponsors = ''

		# Handle
		for sponsor in opts.sponsors
			sponsors += "- #{sponsor.markdown or sponsor.text or sponsor}"

		# Check
		return result  if !sponsors

		# Concatenate
		result += """
			## Sponsors

			Thank you to these amazing people for contributing finances to this project:

			"""  if opts.header isnt false
		result += sponsors

		# Return
		return result

	# Get Contributor Backers
	getContributorBackers: (opts={}) ->
		# Check
		return ''  if !opts.contributors

		# Prepare
		result = ''
		contributors = ''

		# Handle
		for contributor in opts.contributors
			contributors += "- #{contributor.markdown or contributor.text or contributor}"

		# Check
		return result  if !contributors

		# Concatenate
		result += """
			## Contributors

			Thank you to these amazing people for contributing code to this project:

			"""  if opts.header isnt false
		result += contributors

		# Return
		return result

	# Get Backers File
	getBackersFile: (opts) ->
		# Prepare
		parts = []

		# Prepare
		result = ''

		# Handle
		for fn in @getFunctionsEndingWith('Backers')
			parts.push fn.call(@, opts)
		backers = parts.join('\n\n') or ''

		# Check
		return result  if !backers

		# Concatenate
		result += """
			## Backers

			"""  if opts.header isnt false
		result += backers

		# Return
		return result

	# Get Backers Section
	getBackersSection: (opts) ->
		# Only fetch the backers for the current month

		# Return
		return ''
