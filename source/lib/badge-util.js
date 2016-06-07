/* @flow */
const {renderBadges} = require('badges')

function getBadgesInCategory (category /* :string */, data /* :Object */) /* :string */ {
	if ( data.badges && data.badges.list ) {
		return renderBadges(data.badges.list, data.badges.config, {filterCategory: category, filterScripts: true})
	}
	else {
		return ''
	}
}

function getBadgesSection (data /* :Object */) /* :string */ {
	if ( data.badges && data.badges.list ) {
		return renderBadges(data.badges.list, data.badges.config, {filterScripts: true})
	}
	else {
		return ''
	}
}

// Exports
module.exports = {getBadgesInCategory, getBadgesSection}
