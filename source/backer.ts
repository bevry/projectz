// external
import { i, lines, t, mh, mh2, ma, mcode, mul, mp } from '@bevry/render'
import { BackersRenderFormat, renderBackers } from '@bevry/github-api'

// local
import { fileUrl } from './util.js'
import { getBadgesInCategory } from './badge.js'
import type { BackerOptions, Github, FilenamesForReadmeFiles } from './types'

function getContributeLink(
	data: { filenamesForReadmeFiles: FilenamesForReadmeFiles; github: Github },
	optional = false,
): string {
	// Prepare
	const file = data.filenamesForReadmeFiles.contributing
	if (!file) {
		if (optional) return ''
		throw new Error(
			'Contributing section requires a CONTRIBUTING file to exist',
		)
	}
	const url = fileUrl(data, file)
	const inner = t(['Discover how to contribute via the', mcode(file), 'file.'])

	// Return
	return ma({ url, inner })
}

function getBackersLink(
	data: { filenamesForReadmeFiles: FilenamesForReadmeFiles; github: Github },
	optional = false,
): string {
	// Prepare
	const file = data.filenamesForReadmeFiles.backers
	if (!file) {
		if (optional) return ''
		throw new Error('Backers section requires a BACKERS file to exist')
	}
	const url = fileUrl(data, file)
	const inner = t(['Discover every backer via the', mcode(file), 'file.'])

	// Return
	return ma({ url, inner })
}

export function getContributeSection(data: {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	github: Github
}): string {
	return lines([mh2('Contribute'), getContributeLink(data)])
}

function getBackersText(data: BackerOptions, headingLevel: number): string {
	const backersLink: string = getBackersLink(data, true) || ''
	const showExtras: boolean = headingLevel === 1 || backersLink === ''
	const renderedBackers = renderBackers(data, {
		format: BackersRenderFormat.markdown,
		githubSlug: data.github.slug,
	})
	return lines([
		mh(headingLevel, 'Backers'),
		i(showExtras, () => backersLink),
		// Code
		mh(headingLevel + 1, 'Code'),
		mp(getContributeLink(data, true)),
		// Authors
		i(renderedBackers.authors?.length, () => [
			mh(headingLevel + 2, 'Authors'),
			mul(renderedBackers.authors!),
		]),
		// Maintainers
		i(renderedBackers.maintainers?.length, () => [
			mh(headingLevel + 2, 'Maintainers'),
			mul(renderedBackers.maintainers!),
		]),
		// Contributors
		i(renderedBackers.contributors?.length && showExtras, () => [
			mh(headingLevel + 2, 'Contributors'),
			mul(renderedBackers.contributors!),
		]),
		// Finances
		mh(headingLevel + 1, 'Finances'),
		mp(getBadgesInCategory('funding', data)),
		// Funders
		i(renderedBackers.funders?.length, () => [
			mh(headingLevel + 2, 'Funders'),
			mul(renderedBackers.funders!),
		]),
		// Sponsors
		i(renderedBackers.sponsors?.length, () => [
			mh(headingLevel + 2, 'Sponsors'),
			mul(renderedBackers.sponsors!),
		]),
		// Donors
		i(renderedBackers.donors?.length && showExtras, () => [
			mh(headingLevel + 2, 'Donors'),
			mul(renderedBackers.donors!),
		]),
	])
}

export function getBackersSection(data: BackerOptions): string {
	return getBackersText(data, 2)
}

export function getBackersFile(data: BackerOptions): string {
	return getBackersText(data, 1)
}
