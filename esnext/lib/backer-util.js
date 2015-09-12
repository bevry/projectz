// Import
const projectzUtil = require('./projectz-util')
const badgeUtil = require('./badge-util')

export function getSponsorsText (opts) {
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

export function getMaintainersText (opts) {
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

export function getContributeText (opts, text) {
	// Prepare
	const file = 'CONTRIBUTING.md'
	const url = projectzUtil.getFileUrl(opts, file)
	if ( text == null )  text = `Discover how you can contribute by heading on over to the \`${file}\` file.`

	// Return
	return `[${text}](${url})`
}

export function getContributorsText (opts) {
	let result = ''

	if ( opts.contributors.length === 0 ) {
		// ignore
		result +=
			'No contributors yet! Will you be the first?' +
			`\n${getContributeText(opts)}`
	}
	else {
		result +=
			'These amazing people have contributed code to this project:\n\n'
				+ projectzUtil.getPeopleHTML(opts.contributors, {githubSlug: opts.github.slug}) +
				`\n\n${getContributeText(opts, 'Become a contributor!')}`
	}

	return result
}

export function getBackerSection (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'## Backers',
		'',
		'### Maintainers',
		'',
		getMaintainersText(opts),
		'',
		'### Sponsors',
		'',
		getSponsorsText(opts),
		'',
		'### Contributors',
		'',
		getContributorsText(opts)
	].join('\n')

	// Return
	return result
}

export function getBackerFile (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'# Backers',
		'',
		'## Maintainers',
		'',
		getMaintainersText(opts),
		'',
		'## Sponsors',
		'',
		getSponsorsText(opts),
		'',
		'## Contributors',
		'',
		getContributorsText(opts)
	].join('\n')

	// Return
	return result
}

export function getContributeSection (opts) {
	// Prepare
	const result = [
		'## Contribute',
		'',
		getContributeText(opts)
	].join('\n')

	// Return
	return result
}
