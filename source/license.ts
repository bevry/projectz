import { getPeopleHTML } from './util.js'
import spdxParse from 'spdx-expression-parse'
import spdxList from 'spdx-license-list/full'
import type Fellow from 'fellow'

function renderSpdxObject(
	spdxObject: any,
	output: 'description' | 'body',
	depth: number = 0,
): string {
	if (spdxObject.license) {
		const code = spdxObject.license
		const details = spdxList[code]

		if (!details) {
			throw new Error(`Could not find the details for the license ${code}`)
		}

		const name = details.name
		const body = details.licenseText
		const url = `http://spdx.org/licenses/${code}.html`

		return output === 'description'
			? depth === 0
				? `<ul><li><a href="${url}">${name}</a></li></ul>`
				: `<a href="${url}">${name}</a>`
			: body
					// Remove useless copyright headers - (spdx-license-list@5.x)
					.replace('\nCopyright (c) <year> <copyright holders>\n', '')
					// Remove useless copyright headers - (spdx-license-list@6.x)
					.replace(/\s?Copyright.+holders>/gi, '')
					// Remove license introductions
					.replace(/^[\s\S]+<<endOptional>>\s*/m, '')

					// Convert the license into HTML
					.replace(
						/^(.+?)\n\s*([\s\S]+)\s*$/,
						'<h2>$1</h2>\n\n<pre>\n$2\n</pre>',
					)
	} else if (spdxObject.conjunction) {
		const left = renderSpdxObject(spdxObject.left, output, depth + 1)
		const middle = spdxObject.conjunction
		const right = renderSpdxObject(spdxObject.right, output, depth + 1)
		return output === 'description'
			? `<ul><li>${left}</li>\n<li>${middle}</li>\n<li>${right}</li></ul>`
			: `${left}\n\n${right}\n\n`.trim()
	} else {
		throw new Error(
			`Unknown spdx object value: ${JSON.stringify(spdxObject, null, '  ')}`,
		)
	}
}

function getLicensesHTML(
	spdxString: string,
	output: 'description' | 'body',
): string {
	const sdpxObject = spdxParse(spdxString)
	return renderSpdxObject(sdpxObject, output)
}

function getLicenseIntroduction(data: {
	license: string
	authors: Fellow[]
}): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = [
		'Unless stated otherwise all works are:',
		'',
		getPeopleHTML(data.authors, { displayCopyright: true, displayYears: true }),
		'',
		'and licensed under:',
		'',
		getLicensesHTML(data.license, 'description'),
	].join('\n')

	// Return
	return result
}

interface LicenseOptions {
	license?: string
	authors: Fellow[]
}

interface LicenseConfig extends LicenseOptions {
	license: string
}

export function getLicenseFile(data: LicenseOptions): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = [
		'<h1>License</h1>',
		'',
		getLicenseIntroduction(data as LicenseConfig),
		'',
		getLicensesHTML(data.license, 'body'),
	].join('\n')

	// Return
	return result
}

export function getLicenseSection(data: LicenseOptions): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = [
		'<h2>License</h2>',
		'',
		getLicenseIntroduction(data as LicenseConfig),
	].join('\n')

	// Return
	return result
}
