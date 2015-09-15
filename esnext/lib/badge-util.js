const badges = require('badges')

export function getBadgesInCategory (category, opts) {
	if ( opts.badges && opts.badges.list ) {
		return badges.renderBadges(opts.badges.list, opts.badges.config, {filterCategory: category, filterScripts: true})
	}
	else {
		return ''
	}
}

export function getBadgesSection (opts) {
	if ( opts.badges && opts.badges.list ) {
		return badges.renderBadges(opts.badges.list, opts.badges.config, {filterScripts: true})
	}
	else {
		return ''
	}
}
