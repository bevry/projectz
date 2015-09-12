const extendr = require('extendr')
const badges = require('./badges')

export function getBadgesInCategory (category, opts) {
	// Prepare
	const results = []

	// Get the badges
	Object.keys(badges).forEach(function (badgeName) {
		const badgeMethod = badges[badgeName]
		const badgeCategories = badgeMethod.categories || []
		if ( badgeCategories.indexOf(category) === -1 )  return

		const badgeValue = opts.badges[badgeName]
		if ( !badgeValue )  return

		const badgeOpts = extendr.extend({value: badgeValue}, opts)
		const badgeResult = badgeMethod(badgeOpts)
		if ( badgeResult )  results.push(badgeResult)
	})

	// Return
	return results.join('\n')
}

export function getBadgesSection (opts) {
	return getBadgesInCategory('development', opts) + '<br/>\n' + getBadgesInCategory('funding', opts)
}
