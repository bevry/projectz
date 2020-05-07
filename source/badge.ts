import { renderBadges, BadgesField } from 'badges'

export function getBadgesInCategory(
	category: string,
	data: { badges?: BadgesField }
): string {
	if (data.badges && data.badges.list) {
		return renderBadges(data.badges.list, data.badges.config, {
			filterCategory: category,
			filterScripts: true,
		})
	} else {
		return ''
	}
}

export function getBadgesSection(data: { badges?: BadgesField }): string {
	if (data.badges && data.badges.list) {
		return renderBadges(data.badges.list, data.badges.config, {
			filterScripts: true,
		})
	} else {
		return ''
	}
}
