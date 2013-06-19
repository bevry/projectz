# Define
badges =
	# Get Travis Badge
	getTravisBadge: (opts={}) ->
		# Check
		return ''  if !opts.username or !opts.name

		# Return
		return """
			[![Build Status](https://secure.travis-ci.org/#{opts.username}/#{opts.name}.png?branch=master)](http://travis-ci.org/#{opts.username}/#{opts.name} "Check this project's build status on TravisCI")
			"""

	# Get NPM Badge
	getNpmBadge: (opts={}) ->
		# Check
		return ''  if !opts.name

		# Return
		return """
			[![NPM version](https://badge.fury.io/js/#{opts.name}.png)](https://npmjs.org/package/#{opts.name} "View this project on NPM")
			"""

	# Get Flattr Badge
	getFlattrBadge: (opts={}) ->
		# Check
		return ''  if !opts.flattr

		# Return
		return """
			[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](#{opts.flattr} "Donate monthly to this project using Flattr")
			"""

	# Get Paypal Badge
	getPaypalBadge: (opts={}) ->
		# Check
		return ''  if !opts.paypal

		# Return
		return """
			[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](#{opts.paypal} "Donate once-off to this project using Paypal")
			"""

	# Get Badges Section
	getBadgesSection: (opts={}) ->
		# Prepare
		result = ''

		# Concatenate badges
		for fn in @getFunctionsEndingWith.call(badges, 'Badge')
			result += fn.call(@, opts)+'\n'

		# Return
		return result

# Export
module.exports = badges