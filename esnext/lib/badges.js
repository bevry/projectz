function getBadgeHTML ({image, url, title, alt}) {
	return `<a href="${url}" title="${title}"><img src="${image}" alt="${alt}" /></a>`
}

// Sauce Labs Browser Matrix Badge
export function saucelabsbm ({value}) {
	// Check
	if ( !value ) {
		return ''
	}

	// Create
	const image = `https://saucelabs.com/browser-matrix/${value}.svg`
	const url = `https://saucelabs.com/u/${value}`
	const alt = 'Sauce Labs Browser Matrix'
	const title = "Check this project's browser tests on Sauce Labs"
	return getBadgeHTML({image, url, alt, title})
}
saucelabsbm.categories = ['development']

// Travis CI Badge
export function travisci ({repo}) {
	// Check
	if ( !repo ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/travis/${repo}/master.svg`
	const url = `http://travis-ci.org/${repo}`
	const alt = 'Build Status'
	const title = "Check this project's build status on TravisCI"
	return getBadgeHTML({image, url, alt, title})
}
travisci.categories = ['development']

// NPM Version Badge
export function npm ({name}) {
	// Check
	if ( !name ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/npm/v/${name}.svg`
	const url = `https://npmjs.org/package/${name}`
	const alt = 'NPM version'
	const title = 'View this project on NPM'
	return getBadgeHTML({image, url, alt, title})
}
npm.categories = ['development']

// NPM Downloads Badge
export function npmdownloads ({name}) {
	// Check
	if ( !name ) {
		return ''
	}

	const image = `https://img.shields.io/npm/dm/${name}.svg`
	const url = `https://npmjs.org/package/${name}`
	const alt = 'NPM downloads'
	const title = 'View this project on NPM'
	return getBadgeHTML({image, url, alt, title})
}
npmdownloads.categories = ['development']

// Waffle.io Badge
export function waffleio ({value, repo}) {
	// Check
	if ( !repo ) {
		return ''
	}

	// Create
	let label = typeof value === 'string' ? value : 'ready'
	const image = `https://badge.waffle.io/${repo}.png?label=${label}`
	const url = `http://waffle.io/${repo}`
	const alt = 'Stories in Ready'
	const title = "View this project's stories on Waffle.io"
	return getBadgeHTML({image, url, alt, title})
}
waffleio.categories = ['development']

// Coveralls Badge
export function coveralls ({repo}) {
	// Check
	if ( !repo ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/coveralls/${repo}.svg`
	const url = `https://coveralls.io/r/${repo}`
	const alt = 'Coverage Status'
	const title = "View this project's coverage on Coveralls"
	return getBadgeHTML({image, url, alt, title})
}
coveralls.categories = ['development']

// David DM Dependencies Badge
export function daviddm ({repo}) {
	// Check
	if ( !repo ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/david/${repo}.svg`
	const url = `https://david-dm.org/${repo}`
	const alt = 'Dependency Status'
	const title = "View the status of this project's dependencies on DavidDM"
	return getBadgeHTML({image, url, alt, title})
}
daviddm.categories = ['development']

// David DM Dev Dependencies Badge
export function daviddmdev ({repo}) {
	// Check
	if ( !repo ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/david/dev/${repo}.svg`
	const url = `https://david-dm.org/${repo}#info=devDependencies`
	const alt = 'Dev Dependency Status'
	const title = "View the status of this project's development dependencies on DavidDM"
	return getBadgeHTML({image, url, alt, title})
}
daviddmdev.categories = ['development']

// Gittip Badge
export function gratipay ({value}) {
	// Check
	if ( !value ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/gratipay/${value}.svg`
	const url = `https://www.gratipay.com/${value}/`
	const alt = 'Gratipay donate button'
	const title = 'Donate weekly to this project using Gratipay'
	return getBadgeHTML({image, url, alt, title})
}
gratipay.categories = ['funding']

// Flattr Badge
export function flattr ({value}) {
	// Create
	const image = 'https://img.shields.io/badge/flattr-donate-yellow.svg'
	const url = `http://flattr.com/thing/${value}`
	const alt = 'Flattr donate button'
	const title = 'Donate monthly to this project using Flattr'
	return getBadgeHTML({image, url, alt, title})
}
flattr.categories = ['funding']

// Paypal Badge
export function paypal ({value}) {
	// Check
	if ( !value ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/badge/paypal-donate-yellow.svg`
	const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${value}`
	const alt = 'PayPal donate button'
	const title = 'Donate once-off to this project using Paypal'
	return getBadgeHTML({image, url, alt, title})
}
paypal.categories = ['funding']


// Bitcoin Badge
export function bitcoin ({value}) {
	// Check
	if ( !value ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/badge/bitcoin-donate-yellow.svg`
	const url = value
	const alt = 'BitCoin donate button'
	const title = 'Donate once-off to this project using BitCoin'
	return getBadgeHTML({image, url, alt, title})
}
bitcoin.categories = ['funding']


// Wishlist
export function wishlist ({value}) {
	// Check
	if ( !value ) {
		return ''
	}

	// Create
	const image = `https://img.shields.io/badge/wishlist-donate-yellow.svg`
	const url = value
	const alt = 'Wishlist browse button'
	const title = 'Buy an item on our wishlist for us'
	return getBadgeHTML({image, url, alt, title})
}
wishlist.categories = ['funding']
