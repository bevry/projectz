/* @flow */

// Import
const projectzUtil = require('./projectz-util')
const badgeUtil = require('./badge-util')

function getSponsorsText (opts) {
	let result = ''

	if ( opts.sponsors.length === 0 ) {
		// ignore
		result +=
			'No sponsors yet! Will you be the first?\n\n' +
			badgeUtil.getBadgesInCategory('funding', opts)
	}
	else {
		result +=
			'These amazing people have contributed finances to this project:\n\n' +
			projectzUtil.getPeopleHTML(opts.sponsors, {githubSlug: opts.github.slug}) +
			`\n\nBecome a sponsor!\n\n${badgeUtil.getBadgesInCategory('funding', opts)}`
	}

	return result
}

function getMaintainersText (opts) {
	let result = ''

	if ( opts.maintainers.length === 0 ) {
		// ignore
		result += 'No maintainers yet! Will you be the first?'
	}
	else {
		result += 'These amazing people are maintaining this project:\n\n' +
			projectzUtil.getPeopleHTML(opts.maintainers, {githubSlug: opts.github.slug})
	}

	return result
}

function getContributeLink (opts, {optional = false}) {
	// Prepare
	const file = opts.filenamesForReadmeFiles.contributing
	if ( !file ) {
		if ( optional ) {
			return ''
		}
		else {
			throw new Error('Contributing section requires a CONTRIBUTING file to exist')
		}
	}
	const url = projectzUtil.getFileUrl(opts, file)
	const text = `Discover how you can contribute by heading on over to the <code>${file}</code> file.`

	// Return
	return projectzUtil.getLink({url, text})
}

function getContributorsText (opts) {
	let result = ''

	if ( opts.contributors.length === 0 ) {
		// ignore
		result +=
			'No contributors yet! Will you be the first?' +
			`\n\n${getContributeLink(opts, {optional: true})}`
	}
	else {
		result +=
			'These amazing people have contributed code to this project:\n\n' +
			projectzUtil.getPeopleHTML(opts.contributors, {githubSlug: opts.github.slug}) +
			`\n\n${getContributeLink(opts, {optional: true})}`
	}

	return result
}

function getBackerSection (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'<h2>Backers</h2>',
		'',
		'<h3>Maintainers</h3>',
		'',
		getMaintainersText(opts),
		'',
		'<h3>Sponsors</h3>',
		'',
		getSponsorsText(opts),
		'',
		'<h3>Contributors</h3>',
		'',
		getContributorsText(opts)
	].join('\n')

	// Return
	return result
}

function getBackerFile (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'<h1>Backers</h1>',
		'',
		'<h2>Maintainers</h2>',
		'',
		getMaintainersText(opts),
		'',
		'<h2>Sponsors</h2>',
		'',
		getSponsorsText(opts),
		'',
		'<h2>Contributors</h2>',
		'',
		getContributorsText(opts)
	].join('\n')

	// Return
	return result
}

function getContributeSection (opts) {
	// Prepare
	const result = [
		'<h2>Contribute</h2>',
		'',
		getContributeLink(opts, {})
	].join('\n')

	// Return
	return result
}

// Export
module.exports = {
	getSponsorsText,
	getMaintainersText,
	getContributeLink,
	getContributorsText,
	getBackerSection,
	getBackerFile,
	getContributeSection
}
