# Define
module.exports = badgeUtil =
	miscBadges:
		# Get Travis CI Badge
		travis: (opts={}) ->
			# Check
			if !opts.badges.travis or !opts.username or !opts.name
				return ''
			else
				image = "http://img.shields.io/travis-ci/#{opts.username}/#{opts.name}.png?branch=master"
				url = "http://travis-ci.org/#{opts.username}/#{opts.name}"

			# Return
			return """
				[![Build Status](#{image})](#{url} "Check this project's build status on TravisCI")
				"""

		# Get NPM Badge
		npm: (opts={}) ->
			# Check
			if !opts.badges.npm or !opts.name
				return ''
			else
				image = "http://badge.fury.io/js/#{opts.name}.png"
				url = "https://npmjs.org/package/#{opts.name}"

			# Return
			return """
				[![NPM version](#{image})](#{url} "View this project on NPM")
				"""

		# Get Waffle.io Badge
		waffleio: (opts={}) ->
			# Check
			if !opts.badges.waffleio or !opts.repo
				return ''
			else
				label = opts.badges.waffleio
				label = 'ready'  if label is true
				image = "https://badge.waffle.io/#{opts.repo}.png?label=#{label}"
				url = "http://waffle.io/#{opts.repo}"

			# Return
			return """
				[![Stories in Ready](#{image})](#{url})
				"""

		# Get Coveralls Badge
		coveralls: (opts={}) ->
			# Check
			if !opts.badges.coveralls or !opts.repo
				return ''

			image = "https://coveralls.io/repos/#{opts.repo}/badge.png"
			url = "https://coveralls.io/r/#{opts.repo}"
			label = opts.badges.coveralls
			label = 'Coverage Status'  if label is true

			# Return
			return """
				[![#{label}](#{image})](#{url})
				"""

		# Get David DM Dependencies Badge
		david: (opts={}) ->
			# Check
			if !opts.badges.david
				return ''

			# Custom Value
			else if opts.badges.david isnt true
				url = "https://david-dm.org/#{opts.badges.david}"

			# Repo Value
			else if opts.repo
				url = "https://david-dm.org/#{opts.repo}"

			# No Value
			else
				return ''

			# Return
			return """
				[![Dependency Status](#{url}.png?theme=shields.io)](#{url})
				"""

		# Get David DM Dev Dependencies Badge
		daviddev: (opts={}) ->
			# Check
			if !opts.badges.daviddev
				return ''

			# Custom Value
			else if opts.badges.daviddev isnt true
				url = "https://david-dm.org/#{opts.badges.daviddev}"

			# Repo Value
			else if opts.repo
				url = "https://david-dm.org/#{opts.repo}"

			# No Value
			else
				return ''

			# Return
			return """
				[![Development Dependency Status](#{url}/dev-status.png?theme=shields.io)](#{url}#info=devDependencies)
				"""

	donationBadges:
		# Get Gittip Badge
		gittip: (opts={}) ->
			# Check
			if !opts.badges.gittip
				return ''
			else
				image = "http://img.shields.io/gittip/#{opts.badges.gittip}.png"
				url = "https://www.gittip.com/#{opts.badges.gittip}/"

			# Return
			return """
				[![Gittip donate button](#{image})](#{url} "Donate weekly to this project using Gittip")
				"""

		# Get Flattr Badge
		flattr: (opts={}) ->
			# Check
			if !opts.badges.flattr
				return ''
			else
				image = "http://img.shields.io/flattr/donate.png?color=yellow"
				url = "http://flattr.com/thing/#{opts.badges.flattr}"

			# Return
			return """
				[![Flattr donate button](#{image})](#{url} "Donate monthly to this project using Flattr")
				"""

		# Get Paypal Badge
		paypal: (opts={}) ->
			# Check
			if !opts.badges.paypal
				return ''
			else
				image = "http://img.shields.io/paypal/donate.png?color=yellow"
				url = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=#{opts.badges.paypal}"

			# Return
			return """
				[![PayPayl donate button](#{image})](#{url} "Donate once-off to this project using Paypal")
				"""

		# Get Bitcoin Badge
		bitcoin: (opts={}) ->
			# Check
			if !opts.badges.bitcoin
				return ''
			else
				image = "http://img.shields.io/bitcoin/donate.png?color=yellow"
				url = opts.badges.bitcoin

			# Return
			return """
				[![BitCoin donate button](#{image})](#{url} "Donate once-off to this project using BitCoin")
				"""

		# Get Wishlist
		wishlist: (opts={}) ->
			# Check
			if !opts.badges.wishlist
				return ''
			else
				image = "http://img.shields.io/wishlist/browse.png?color=yellow"
				url = opts.badges.wishlist

			# Return
			return """
				[![Wishlist browse button](#{image})](#{url} "Buy an item on our wishlist for us")
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
