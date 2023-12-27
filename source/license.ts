// external
import { BackersRenderFormat, renderBackers } from '@bevry/github-api'
import spdxParse from 'spdx-expression-parse'
import spdxList from 'spdx-license-list/full.js'
import { lines, ma, mul, mh1, mh2, pre, mp } from '@bevry/render'

// local
import { LicenseConfig, LicenseOptions } from './types.js'

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

		const url = `http://spdx.org/licenses/${code}.html`
		return output === 'description'
			? depth === 0
				? mul([ma({ url, inner: details.name })])
				: ma({ url, inner: details.name })
			: details.licenseText
					// Remove useless copyright headers - (spdx-license-list@5.x)
					.replace('\nCopyright (c) <year> <copyright holders>\n', '')
					// Remove useless copyright headers - (spdx-license-list@6.x)
					.replace(/\s?Copyright.+holders>/gi, '')
					// Remove license introductions
					.replace(/^[\s\S]+<<endOptional>>\s*/m, '')

					// Render the license
					.replace(
						/^(.+?)\n\s*([\s\S]+)\s*$/,
						(match: string, license: string, body: string) =>
							lines([mh2(license), pre(body)]),
					)
	} else if (spdxObject.conjunction) {
		const left = renderSpdxObject(spdxObject.left, output, depth + 1)
		const middle = spdxObject.conjunction
		const right = renderSpdxObject(spdxObject.right, output, depth + 1)
		return output === 'description'
			? mul([left, middle, right])
			: lines([left, right])
	} else {
		throw new Error(
			`Unknown spdx object value: ${JSON.stringify(spdxObject, null, '  ')}`,
		)
	}
}

function getRenderedLicenses(
	spdxString: string,
	output: 'description' | 'body',
): string {
	const sdpxObject = spdxParse(spdxString)
	return renderSpdxObject(sdpxObject, output)
}

function getLicenseIntroduction(data: LicenseOptions): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const renderedBackers = renderBackers(
		{ authors: data.authors },
		{ format: BackersRenderFormat.copyright },
	)
	const result = lines([
		mp('Unless stated otherwise all works are:'),
		mul(renderedBackers.authors || []),
		mp('and licensed under:'),
		getRenderedLicenses(data.license, 'description'),
	])

	// Return
	return result
}

export function getLicenseFile(data: LicenseOptions): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = lines([
		mh1('License'),
		getLicenseIntroduction(data as LicenseConfig),
		getRenderedLicenses(data.license, 'body'),
	])

	// Return
	return result
}

export function getLicenseSection(data: LicenseOptions): string {
	// Check
	if (!data.license) {
		throw new Error('License file was requested, but no license was specified')
	}

	// Prepare
	const result = lines([
		mh2('License'),
		getLicenseIntroduction(data as LicenseConfig),
	])

	// Return
	return result
}
