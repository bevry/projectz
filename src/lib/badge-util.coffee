# Define
module.exports = badgeUtil =
	miscBadges:
		# Get Travis CI Badge
		travis: (opts={}) ->
			# Check
			return ''  if !opts.badges.travis or !opts.username or !opts.name
			image = "http://img.shields.io/travis-ci/#{opts.username}/#{opts.name}.png?branch=master"
			url = "http://travis-ci.org/#{opts.username}/#{opts.name}"

			# Return
			return """
				[![Build Status](#{image})](#{url} "Check this project's build status on TravisCI")
				"""

		# Get NPM Badge
		npm: (opts={}) ->
			# Check
			return ''  if !opts.badges.npm or !opts.name
			image = "http://badge.fury.io/js/#{opts.name}.png"
			url = "https://npmjs.org/package/#{opts.name}"

			# Return
			return """
				[![NPM version](#{image})](#{url} "View this project on NPM")
				"""

		# Get Waffle.io Badge
		waffleio: (opts={}) ->
			# Check
			return ''  if !opts.badges.waffleio or !opts.repo
			label = if typeof opts.badges.waffleio == 'string' then opts.badges.waffleio else 'ready'
			image = "https://badge.waffle.io/#{opts.repo}.png?label=#{label}"
			url = "http://waffle.io/#{opts.repo}"

			# Return
			return """
				[![Stories in Ready](#{image})](#{url})
				"""

		# Get David DM Dependencies Badge
		david: (opts={}) ->
			# Check
			return ''  if !opts.badges.david or (
				opts.badges.daviddev is true and (
					!opts.repo or !opts.devDependencies or Object.keys(opts.devDependencies).length is 0
				)
			)

			# Custom Value
			if opts.badges.david isnt true
				url = "https://david-dm.org/#{opts.badges.david}"

			# Repo Value
			else
				url = "https://david-dm.org/#{opts.repo}"

			# Return
			return """
				[![Dependency Status](#{url}.png?theme=shields.io)](#{url})
				"""

		# Get David DM Dev Dependencies Badge
		daviddev: (opts={}) ->
			# Check
			return ''  if !opts.badges.daviddev or (
				opts.badges.daviddev is true and (
					!opts.repo or !opts.dependencies or Object.keys(opts.dependencies).length is 0
				)
			)

			# Custom Value
			if opts.badges.daviddev isnt true
				url = "https://david-dm.org/#{opts.badges.daviddev}"

			# Repo Value
			else
				url = "https://david-dm.org/#{opts.repo}"

			# Return
			return """
				[![Development Dependency Status](#{url}/dev-status.png?theme=shields.io)](#{url}#info=devDependencies)
				"""

	donationBadges:
		# Get Gittip Badge
		gittip: (opts={}) ->
			# Check
			return ''  if !opts.badges.gittip
			image = "http://img.shields.io/gittip/#{opts.badges.gittip}.png"
			url = "https://www.gittip.com/#{opts.badges.gittip}/"

			# Return
			return """
				[![Gittip donate button](#{image})](#{url} "Donate weekly to this project using Gittip")
				"""

		# Get Flattr Badge
		flattr: (opts={}) ->
			# Check
			return ''  if !opts.badges.flattr
			image = "http://img.shields.io/flattr/donate.png?color=yellow"
			url = "http://flattr.com/thing/#{opts.badges.flattr}"

			# Return
			return """
				[![Flattr donate button](#{image})](#{url} "Donate monthly to this project using Flattr")
				"""

		# Get Paypal Badge
		paypal: (opts={}) ->
			# Check
			return ''  if !opts.badges.paypal
			image = "http://img.shields.io/paypal/donate.png?color=yellow"
			url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=#{opts.badges.paypal}"

			# Return
			return """
				[![PayPayl donate button](#{image})](#{url} "Donate once-off to this project using Paypal")
				"""

		# Get Bitcoin Badge
		bitcoin: (opts={}) ->
			# Check
			return ''  if !opts.badges.bitcoin
			image = "http://img.shields.io/bitcoin/donate.png?color=yellow"
			url = opts.badges.bitcoin

			# Return
			return """
				[![BitCoin donate button](#{image})](#{url} "Donate once-off to this project using BitCoin")
				"""

	# Get Badges Section
	getBadgesSection: (opts={}) ->
		return badgeUtil.getTypedBadges('misc', opts)+'<br/>\n'+badgeUtil.getTypedBadges('donation', opts)

	# Get Donation Badges
	getTypedBadges: (type, opts={}) ->
		# Prepare
		results = []

		# Concatenate badges
		for own name,fn of badgeUtil[type+'Badges']
			result = fn.call(@, opts)
			results.push(result)  if result

		# Return
		return results.join('\n')  # &nbsp; isn't rendered on github.com properly, treated just like a space
