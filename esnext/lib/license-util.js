// Import
const projectzUtil = require('./projectz-util')

// Get License Introduction
export function getLicenseIntroduction (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'Unless stated otherwise all works are:',
		'',
		projectzUtil.getPeopleHTML(opts.authors, {copyright: true, years: true}),
		'',
		'and licensed under:',
		'',
		opts.licenses.descriptionHTML
	].join('\n')

	// Return
	return result
}

// Get License File
export function getLicenseFile (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'<h1>License</h1>',
		'',
		getLicenseIntroduction(opts),
		'',
		opts.licenses.bodyHTML
	].join('\n')

	// Return
	return result
}

export function getLicenseSection (opts) {
	// Check
	if ( !opts.licenses )  return ''

	// Prepare
	const result = [
		'<h2>License</h2>',
		'',
		getLicenseIntroduction(opts)
	].join('\n')

	// Return
	return result
}
