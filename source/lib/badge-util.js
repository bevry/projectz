/* @flow */

// Import
const badges = require('badges')

function getBadgesInCategory (category, opts) {
	if ( opts.badges && opts.badges.list ) {
		return badges.renderBadges(opts.badges.list, opts.badges.config, {filterCategory: category, filterScripts: true})
	}
	else {
		return ''
	}
}

function getBadgesSection (opts) {
	if ( opts.badges && opts.badges.list ) {
		return badges.renderBadges(opts.badges.list, opts.badges.config, {filterScripts: true})
	}
	else {
		return ''
	}
}

// Export
module.exports = {
	getBadgesInCategory,
	getBadgesSection
}
