/* @flow */
import {getPeopleHTML} from './projectz-util'
import {parse as spdxParse} from 'spdx'
import spdxList from 'spdx-license-list/spdx-full'

function renderSpdxObject (spdxObject /* :Object */, output /* :"description"|"body" */) /* :string */ {
	if ( spdxObject.license ) {
		const code = spdxObject.license
		const details = spdxList[code]

		if ( !details ) {
			throw new Error(`Could not find the details for the license ${code}`)
		}

		const name = details.name
		const body = details.license
		const url = `http://spdx.org/licenses/${code}.html`

		return output === 'description'
			? `<a href="${url}">${name}</a>`
			: body
				// Remove useless copyright headers
				.replace('\nCopyright (c) <year> <copyright holders>\n', '')

				// Remove license introductions
				.replace(/^[\s\S]+<<endOptional>>\s*/m, '')

				// Convert the license into HTML
				.replace(/^(.+?)\n\s*([\s\S]+)\s*$/, '<h2>$1</h2>\n\n<pre>\n$2\n</pre>')
	}
	else if ( spdxObject.conjuction ) {
		return '<ul>' + [
			'<li>' + renderSpdxObject(spdxObject.left, output) + '</li>',
			'<li>' + spdxObject.conjuction + '</li>',
			'<li>' + renderSpdxObject(spdxObject.right, output) + '</li>'
		].join('') + '</ul>'
	}
	else {
		throw new Error('Unknown spdx object value')
	}
}

export function getLicensesHTML (spdxString /* :string */, output /* :"description"|"body" */) /* :string */ {
	const sdpxObject = spdxParse(spdxString)
	return renderSpdxObject(sdpxObject, output)
}

export function getLicenseIntroduction (data /* :Object */) /* :string */ {
	// Check
	if ( !data.licenses )  return ''

	// Prepare
	const result = [
		'Unless stated otherwise all works are:',
		'',
		getPeopleHTML(data.authors, {displayCopyright: true, displayYears: true}),
		'',
		'and licensed under:',
		'',
		getLicensesHTML(data.licenses, 'description')
	].join('\n')

	// Return
	return result
}

export function getLicenseFile (data /* :Object */) /* :string */ {
	// Check
	if ( !data.licenses )  return ''

	// Prepare
	const result = [
		'<h1>License</h1>',
		'',
		getLicenseIntroduction(data),
		'',
		getLicensesHTML(data.licenses, 'body')
	].join('\n')

	// Return
	return result
}

export function getLicenseSection (data /* :Object */) /* :string */ {
	// Check
	if ( !data.licenses )  return ''

	// Prepare
	const result = [
		'<h2>License</h2>',
		'',
		getLicenseIntroduction(data)
	].join('\n')

	// Return
	return result
}
