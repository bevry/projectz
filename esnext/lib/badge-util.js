// Define
const badgeUtil = {
	miscBadges: {
		// Get Sauce Labs Browser Matrix
		saucebm: function (opts) {
			// Check
			if ( !opts.badges.saucebm ) {
				return ''
			}

			// Create
			const image = `https://saucelabs.com/browser-matrix/${opts.badges.saucebm}.svg`
			const url = `https://saucelabs.com/u/${opts.badges.saucebm}.svg`
			return `[![Sauce Labs Browser Matrix](${image})](${url} "Check this project's browser tests on Sauce Labs")`
		},

		// Get Travis CI Badge
		travis: function (opts) {
			// Check
			if ( !opts.badges.travis || !opts.username || !opts.name ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/travis/${opts.username}/${opts.name}/master.svg`
			const url = `http://travis-ci.org/${opts.username}/${opts.name}`
			return `[![Build Status](${image})](${url} "Check this project's build status on TravisCI")`
		},

		// Get NPM Version Badge
		npm: function (opts) {
			// Check
			if ( !opts.badges.npm || !opts.name ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/npm/v/${opts.name}.svg`
			const url = `https://npmjs.org/package/${opts.name}`
			return `[![NPM version](${image})](${url} "View this project on NPM")`
		},

		// Get NPM Downloads Badge
		npmdownloads: function (opts) {
			// Check
			if ( !opts.badges.npmdownloads || !opts.name ) {
				return ''
			}

			const image = `https://img.shields.io/npm/dm/${opts.name}.svg`
			const url = `https://npmjs.org/package/${opts.name}`
			return `[![NPM downloads](${image})](${url} "View this project on NPM")`
		},

		// Get Waffle.io Badge
		waffleio: function (opts) {
			// Check
			if ( !opts.badges.waffleio || !opts.repo ) {
				return ''
			}

			// Create
			let label = opts.badges.waffleio
			if ( label === true )  label = 'ready'
			const image = `https://badge.waffle.io/${opts.repo}.png?label=${label}`
			const url = `http://waffle.io/${opts.repo}`
			return `[![Stories in Ready](${image})](${url})`
		},

		// Get Coveralls Badge
		coveralls: function (opts) {
			// Check
			if ( !opts.badges.coveralls || !opts.repo ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/coveralls/${opts.repo}.svg`
			const url = `https://coveralls.io/r/${opts.repo}`
			let label = opts.badges.coveralls
			if ( label === true )  label = 'Coverage Status'
			return `[![${label}](${image})](${url})`
		},

		// Get David DM Dependencies Badge
		// @NOTE: Don't try and simply this, it is already as simply as it can get
		david: function (opts) {
			let repo

			// Check
			if ( !opts.badges.david ) {
				return ''
			}

			// Custom Value
			else if ( opts.badges.daviddev !== true ) {
				repo = opts.badges.david
			}

			// Repo Value
			else if ( opts.repo ) {
				repo = opts.repo
			}

			// No Value
			else {
				return ''
			}

			// Create
			const image = `https://img.shields.io/david/${repo}.svg`
			const url = `https://david-dm.org/${repo}`
			return `[![Dependency Status](${image})](${url})`
		},

		// Get David DM Dev Dependencies Badge
		// @NOTE: Don't try and simply this, it is already as simply as it can get
		daviddev: function (opts) {
			let repo

			// Check
			if ( !opts.badges.daviddev ) {
				return ''
			}

			// Custom Value
			else if ( opts.badges.daviddev !== true ) {
				repo = opts.badges.daviddev
			}

			// Repo Value
			else if ( opts.repo ) {
				repo = opts.repo
			}

			// No Value
			else {
				return ''
			}

			// Create
			const image = `https://img.shields.io/david/dev/${repo}.svg`
			const url = `https://david-dm.org/${repo}#info=devDependencies`
			return `[![Dev Dependency Status](${image})](${url})`
		},
	},

	donationBadges: {
		// Get Gittip Badge
		gratipay: function (opts) {
			// Prepare
			const name = opts.badges.gratipay || opts.badges.gittip

			// Check
			if ( !name ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/gratipay/${name}.svg`
			const url = `https://www.gratipay.com/${name}/`
			return `[![Gratipay donate button](${image})](${url} "Donate weekly to this project using Gratipay")`
		},

		// Get Flattr Badge
		flattr: function (opts) {
			// Check
			if ( !opts.badges.flattr ) {
				return ''
			}

			// Create
			const image = 'https://img.shields.io/badge/flattr-donate-yellow.svg'
			const url = `http://flattr.com/thing/${opts.badges.flattr}`
			return `[![Flattr donate button](${image})](${url} "Donate monthly to this project using Flattr")`
		},

		// Get Paypal Badge
		paypal: function (opts) {
			// Check
			if ( !opts.badges.paypal ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/badge/paypal-donate-yellow.svg`
			const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${opts.badges.paypal}`
			return `[![PayPal donate button](${image})](${url} "Donate once-off to this project using Paypal")`
		},

		// Get Bitcoin Badge
		bitcoin: function (opts) {
			// Check
			if ( !opts.badges.bitcoin ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/badge/bitcoin-donate-yellow.svg`
			const url = opts.badges.bitcoin
			return `[![BitCoin donate button](${image})](${url} "Donate once-off to this project using BitCoin")`
		},

		// Get Wishlist
		wishlist: function (opts) {
			// Check
			if ( !opts.badges.wishlist ) {
				return ''
			}

			// Create
			const image = `https://img.shields.io/badge/wishlist-donate-yellow.svg`
			const url = opts.badges.wishlist
			return `[![Wishlist browse button](${image})](${url} "Buy an item on our wishlist for us")`
		},
	},

	// Get Badges Section
	getBadgesSection: function (opts) {
		return badgeUtil.getTypedBadges('misc', opts) + '<br/>\n' + badgeUtil.getTypedBadges('donation', opts)
	},

	// Get Donation Badges
	getTypedBadges: function (type, opts) {
		// Prepare
		const results = []

		// Concatenate badges
		const badges = badgeUtil[type + 'Badges']
		for ( const name of Object.keys(badges) ) {
			const fn = badges[name]
			const result = fn.call(this, opts)
			if ( result )  results.push(result)
		}

		// Return
		return results.join('\n')  // &nbsp; isn't rendered on github.com properly, treated just like a space
	}
}

// Export
export default badgeUtil
