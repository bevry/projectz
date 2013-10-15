# Import
utils = require('./utils')
eachr = require('eachr')

# Define
badges =
	sections:
		# Get Travis CI Badge
		travis: (opts={}) ->
			# Check
			return ''  if !opts.badges.travis or !opts.username or !opts.name

			# Return
			return """
				[![Build Status](https://secure.travis-ci.org/#{opts.username}/#{opts.name}.png?branch=master)](http://travis-ci.org/#{opts.username}/#{opts.name} "Check this project's build status on TravisCI")
				"""

		# Get NPM Badge
		npm: (opts={}) ->
			# Check
			return ''  if !opts.badges.npm or !opts.name

			# Return
			return """
				[![NPM version](https://badge.fury.io/js/#{opts.name}.png)](https://npmjs.org/package/#{opts.name} "View this project on NPM")
				"""

		# Get Gittip Badge
		gittip: (opts={}) ->
			# Check
			return ''  if !opts.badges.gittip
			url = "https://www.gittip.com/#{opts.badges.gittip}/"

			# Return
			return """
				[![Gittip donate button](http://badgr.co/gittip/bevry.png)](#{url} "Donate weekly to this project using Gittip")
				"""

		# Get Flattr Badge
		flattr: (opts={}) ->
			# Check
			return ''  if !opts.badges.flattr
			url = "http://flattr.com/thing/#{opts.badges.flattr}"

			# Return
			return """
				[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](#{url} "Donate monthly to this project using Flattr")
				"""

		# Get Paypal Badge
		paypal: (opts={}) ->
			# Check
			return ''  if !opts.badges.paypal
			url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=#{opts.badges.paypal}"

			# Return
			return """
				[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](#{url} "Donate once-off to this project using Paypal")
				"""

	# Get Badges Section
	getBadgesSection: (opts={}) ->
		# Prepare
		results = []

		# Concatenate badges
		eachr badges.sections, (fn, name) ->
			result = fn.call(@, opts)
			results.push(result)  if result
			return true

		# Return
		return results.join('\n')

# Export
module.exports = badges