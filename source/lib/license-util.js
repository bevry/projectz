/* @flow */
const {getPeopleHTML} = require('./projectz-util.js')
const spdxParse = require('spdx').parse
const spdxList = require('spdx-license-list/spdx-full')

function renderSpdxObject (spdxObject /* :Object */, output /* :"description"|"body" */, depth = 0) /* :string */ {
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
			? (depth === 0
				? `<ul><li><a href="${url}">${name}</a></li></ul>`
				: `<a href="${url}">${name}</a>`
			)
			: body
				// Remove useless copyright headers
				.replace('\nCopyright (c) <year> <copyright holders>\n', '')

				// Remove license introductions
				.replace(/^[\s\S]+<<endOptional>>\s*/m, '')

				// Convert the license into HTML
				.replace(/^(.+?)\n\s*([\s\S]+)\s*$/, '<h2>$1</h2>\n\n<pre>\n$2\n</pre>')
	}
	else if ( spdxObject.conjunction ) {
		const left = renderSpdxObject(spdxObject.left, output, depth + 1)
		const middle = spdxObject.conjunction
		const right = renderSpdxObject(spdxObject.right, output, depth + 1)
		return output === 'description'
			? `<ul><li>${left}</li>\n<li>${middle}</li>\n<li>${right}</li></ul>`
			: `${left}\n\n${right}\n\n`.trim()
	}
	else {
		throw new Error(`Unknown spdx object value: ${JSON.stringify(spdxObject, null, '  ')}`)
	}
}

function getLicensesHTML (spdxString /* :string */, output /* :"description"|"body" */) /* :string */ {
	const sdpxObject = spdxParse(spdxString)
	return renderSpdxObject(sdpxObject, output)
}

function getLicenseIntroduction (data /* :Object */) /* :string */ {
	// Check
	if ( !data.license ) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = [
		'Unless stated otherwise all works are:',
		'',
		getPeopleHTML(data.authors, {displayCopyright: true, displayYears: true}),
		'',
		'and licensed under:',
		'',
		getLicensesHTML(data.license, 'description')
	].join('\n')

	// Return
	return result
}

function getLicenseFile (data /* :Object */) /* :string */ {
	// Check
	if ( !data.license ) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = [
		'<h1>License</h1>',
		'',
		getLicenseIntroduction(data),
		'',
		getLicensesHTML(data.license, 'body')
	].join('\n')

	// Return
	return result
}

function getLicenseSection (data /* :Object */) /* :string */ {
	// Prepare
	const result = [
		'<h2>License</h2>',
		'',
		getLicenseIntroduction(data)
	].join('\n')

	// Return
	return result
}

// Exports
module.exports = {getLicensesHTML, getLicenseIntroduction, getLicenseFile, getLicenseSection}
