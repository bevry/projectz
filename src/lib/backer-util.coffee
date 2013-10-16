# Import
projectzUtil = require('./projectz-util')
badgeUtil = require('./badge-util')

# Define
module.exports = backerUtil =

	getBackerText: (backer) ->
		return backer.markdown or backer.text or backer

	getSponsorsText: (opts) ->
		result = ''

		if opts.sponsors.length is 0
			# ignore
			result += "No sponsors yet! Will you be the first?\n\n"
			result += badgeUtil.getTypedBadges('donation', opts)
		else
			result += "Thank you to these amazing people for contributing finances to this project:\n\n"
			result += '- '+(backerUtil.getBackerText(sponsor)  for sponsor in opts.sponsors).join('\n- ')

		return result

	getContributorsText: (opts) ->
		result = ''

		if opts.contributors.length is 0
			# ignore
			result += "No contributors yet! Will you be the first?"
		else
			result += "Thank you to these amazing people for contributing code to this project:\n\n"
			result += '- '+(backerUtil.getBackerText(contributor)  for contributor in opts.contributors).join('\n- ')

		return result

	# Get Backer Section
	getBackerSection: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = """
			## Backers

			### Sponsors

			#{backerUtil.getSponsorsText(opts)}

			### Contributors

			#{backerUtil.getContributorsText(opts)}
			"""

		# Return
		return result

	# Get Backer File
	getBackerFile: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = """
			# Backers

			## Sponsors

			#{backerUtil.getSponsorsText(opts)}

			## Contributors

			#{backerUtil.getContributorsText(opts)}
			"""

		# Return
		return result

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
