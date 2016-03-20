/* @flow */
import {getPeopleHTML, getFileUrl, getLink} from './projectz-util'
import {getBadgesInCategory} from './badge-util'

export function getSponsorsText (data /* :Object */) /* :string */ {
	let result = ''

	if ( data.sponsors.length === 0 ) {
		// ignore
		result +=
			'No sponsors yet! Will you be the first?\n\n' +
			getBadgesInCategory('funding', data)
	}
	else {
		result +=
			'These amazing people have contributed finances to this project:\n\n' +
			getPeopleHTML(data.sponsors, {githubSlug: data.github.slug}) +
			`\n\nBecome a sponsor!\n\n${getBadgesInCategory('funding', data)}`
	}

	return result
}

export function getMaintainersText (data /* :Object */) /* :string */ {
	let result = ''

	if ( data.maintainers.length === 0 ) {
		// ignore
		result += 'No maintainers yet! Will you be the first?'
	}
	else {
		result += 'These amazing people are maintaining this project:\n\n' +
			getPeopleHTML(data.maintainers, {githubSlug: data.github.slug})
	}

	return result
}

export function getContributeLink (data /* :Object */, {optional = false} /* :Object */ ) /* :string */ {
	// Prepare
	const file = data.filenamesForReadmeFiles.contributing
	if ( !file ) {
		if ( optional ) {
			return ''
		}
		else {
			throw new Error('Contributing section requires a CONTRIBUTING file to exist')
		}
	}
	const url = getFileUrl(data, file)
	const text = `Discover how you can contribute by heading on over to the <code>${file}</code> file.`

	// Return
	return getLink({url, text})
}

export function getContributorsText (data /* :Object */) /* :string */ {
	let result = ''

	if ( data.contributors.length === 0 ) {
		// ignore
		result +=
			'No contributors yet! Will you be the first?' +
			`\n\n${getContributeLink(data, {optional: true})}`
	}
	else {
		result +=
			'These amazing people have contributed code to this project:\n\n' +
			getPeopleHTML(data.contributors, {githubSlug: data.github.slug}) +
			`\n\n${getContributeLink(data, {optional: true})}`
	}

	return result
}

export function getBackerSection (data /* :Object */) /* :string */ {
	// Check
	if ( !data.licenses )  return ''

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
		getContributorsText(data)
	].join('\n')

	// Return
	return result
}

export function getBackerFile (data /* :Object */) /* :string */ {
	// Check
	if ( !data.licenses )  return ''

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
		getContributorsText(data)
	].join('\n')

	// Return
	return result
}

export function getContributeSection (data /* :Object */) /* :string */ {
	// Prepare
	const result = [
		'<h2>Contribute</h2>',
		'',
		getContributeLink(data, {})
	].join('\n')

	// Return
	return result
}
