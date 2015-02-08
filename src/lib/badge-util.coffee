# Define
module.exports = badgeUtil =
	miscBadges:
		# Get Sauce Labs Browser Matrix
		sauceBM: (opts={}) ->
			# Check
			if !opts.badges.sauceBM
				return ''
			else
				image = "https://saucelabs.com/browser-matrix/#{opts.badges.sauceBM}.svg"
				url = "https://saucelabs.com/u/#{opts.badges.sauceBM}.svg"
			# Return
			return """
				[![Sauce Labs Browser Matrix](#{image})](#{url} "Check this project's browser tests on Sauce Labs")
				"""

		# Get Travis CI Badge
		travis: (opts={}) ->
			# Check
			if !opts.badges.travis or !opts.username or !opts.name
				return ''
			else
				image = "https://img.shields.io/travis/#{opts.username}/#{opts.name}/master.svg"
				url = "http://travis-ci.org/#{opts.username}/#{opts.name}"

			# Return
			return """
				[![Build Status](#{image})](#{url} "Check this project's build status on TravisCI")
				"""

		# Get NPM Version Badge
		npm: (opts={}) ->
			# Check
			if !opts.badges.npm or !opts.name
				return ''
			else
				image = "https://img.shields.io/npm/v/#{opts.name}.svg"
				url = "https://npmjs.org/package/#{opts.name}"

			# Return
			return """
				[![NPM version](#{image})](#{url} "View this project on NPM")
				"""

		# Get NPM Downloads Badge
		npmdownloads: (opts={}) ->
			# Check
			if !opts.badges.npmdownloads or !opts.name
				return ''
			else
				image = "https://img.shields.io/npm/dm/#{opts.name}.svg"
				url = "https://npmjs.org/package/#{opts.name}"

			# Return
			return """
				[![NPM downloads](#{image})](#{url} "View this project on NPM")
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

		# Get David DM Dependencies Badge
		# @NOTE: Don't try and simply this, it is already as simply as it can get
		david: (opts={}) ->
			# Check
			if !opts.badges.david
				return ''

			# Custom Value
			else if opts.badges.daviddev isnt true
				repo = opts.badges.david

			# Repo Value
			else if opts.repo
				repo = opts.repo

			# No Value
			else
				return ''

			# Assign
			image = "https://img.shields.io/david/#{repo}.svg"
			url = "https://david-dm.org/#{repo}"

			# Return
			return """
				[![Dependency Status](#{image})](#{url})
				"""

		# Get David DM Dev Dependencies Badge
		# @NOTE: Don't try and simply this, it is already as simply as it can get
		daviddev: (opts={}) ->
			# Check
			if !opts.badges.daviddev
				return ''

			# Custom Value
			else if opts.badges.daviddev isnt true
				repo = opts.badges.daviddev

			# Repo Value
			else if opts.repo
				repo = opts.repo

			# No Value
			else
				return ''

			# Assign
			image = "https://img.shields.io/david/dev/#{repo}.svg"
			url = "https://david-dm.org/#{repo}#info=devDependencies"

			# Return
			return """
				[![Dev Dependency Status](#{image})](#{url})
				"""

	donationBadges:
		# Get Gittip Badge
		gratipay: (opts={}) ->
			# Prepare
			name = (opts.badges.gratipay or opts.badges.gittip)

			# Check
			if !name
				return ''
			else
				image = "https://img.shields.io/gratipay/#{name}.svg"
				url = "https://www.gratipay.com/#{name}/"

			# Return
			return """
				[![Gratipay donate button](#{image})](#{url} "Donate weekly to this project using Gratipay")
				"""

		# Get Flattr Badge
		flattr: (opts={}) ->
			# Check
			if !opts.badges.flattr
				return ''
			else
				image = "https://img.shields.io/badge/flattr-donate-yellow.svg"
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
				image = "https://img.shields.io/badge/paypal-donate-yellow.svg"
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
				image = "https://img.shields.io/badge/bitcoin-donate-yellow.svg"
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
				image = "https://img.shields.io/badge/wishlist-donate-yellow.svg"
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
