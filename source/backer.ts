import { getPeopleHTML, getFileUrl, getLink } from './util.js'
import { getBadgesInCategory } from './badge.js'
import type { Github, FilenamesForReadmeFiles } from './types'
import type Fellow from 'fellow'
import type { BadgesField } from 'badges'

function getSponsorsText(data: {
	badges: BadgesField
	sponsors: Fellow[]
	github: Github
}): string {
	let result = ''

	if (data.sponsors.length === 0) {
		// ignore
		result +=
			'No sponsors yet! Will you be the first?\n\n' +
			getBadgesInCategory('funding', data)
	} else {
		result +=
			'These amazing people have contributed finances to this project:\n\n' +
			getPeopleHTML(data.sponsors) +
			`\n\nBecome a sponsor!\n\n${getBadgesInCategory('funding', data)}`
	}

	return result
}

function getMaintainersText(data: {
	maintainers: Fellow[]
	github: Github
}): string {
	let result = ''

	if (data.maintainers.length === 0) {
		// ignore
		result += 'No maintainers yet! Will you be the first?'
	} else {
		result +=
			'These amazing people are maintaining this project:\n\n' +
			getPeopleHTML(data.maintainers, {
				displayContributions: true,
				githubRepoSlug: data.github.slug,
			})
	}

	return result
}

function getContributeLink(
	data: { filenamesForReadmeFiles: FilenamesForReadmeFiles; github: Github },
	optional = false,
): string {
	// Prepare
	const file = data.filenamesForReadmeFiles.contributing
	if (!file) {
		if (optional) {
			return ''
		} else {
			throw new Error(
				'Contributing section requires a CONTRIBUTING file to exist',
			)
		}
	}
	const url = getFileUrl(data, file)
	const text = `Discover how you can contribute by heading on over to the <code>${file}</code> file.`

	// Return
	return getLink({ url, text })
}

function getContributorsText(data: {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	contributors: Fellow[]
	github: Github
}): string {
	let result = ''

	if (data.contributors.length === 0) {
		// ignore
		result +=
			'No contributors yet! Will you be the first?' +
			`\n\n${getContributeLink(data, true)}`
	} else {
		result +=
			'These amazing people have contributed code to this project:\n\n' +
			getPeopleHTML(data.contributors, {
				displayContributions: true,
				githubRepoSlug: data.github.slug,
			}) +
			`\n\n${getContributeLink(data, true)}`
	}

	return result
}

interface BackerOptions {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	badges: BadgesField
	maintainers: Fellow[]
	sponsors: Fellow[]
	contributors: Fellow[]
	github: Github
}
export function getBackerSection(data: BackerOptions): string {
	// Prepare
	const result = [
		'<h2>Backers</h2>',
		'',
		'<h3>Maintainers</h3>',
		'',
		getMaintainersText(data),
		'',
		'<h3>Sponsors</h3>',
		'',
		getSponsorsText(data),
		'',
		'<h3>Contributors</h3>',
		'',
		getContributorsText(data),
	].join('\n')

	// Return
	return result
}

export function getBackerFile(data: BackerOptions): string {
	// Prepare
	const result = [
		'<h1>Backers</h1>',
		'',
		'<h2>Maintainers</h2>',
		'',
		getMaintainersText(data),
		'',
		'<h2>Sponsors</h2>',
		'',
		getSponsorsText(data),
		'',
		'<h2>Contributors</h2>',
		'',
		getContributorsText(data),
	].join('\n')

	// Return
	return result
}

export function getContributeSection(data: {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	github: Github
}): string {
	// Prepare
	const result = ['<h2>Contribute</h2>', '', getContributeLink(data)].join('\n')

	// Return
	return result
}
