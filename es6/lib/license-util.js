// Import
const projectzUtil = require('./projectz-util')


// -------------------------------------
// Define

const licenseUtil = {
	// Get License Introduction
	getLicenseIntroduction: function (opts) {
		// Check
		if ( !opts.licenses )  return ''

		// Prepare
		const result = [
			'Unless stated otherwise all works are:',
			'',
			projectzUtil.getPeopleHTML(opts.authors, {years: true}),
			'',
			'and licensed under:',
			'',
			opts.licenses.descriptionHTML
		].join('\n')

		// Return
		return result
	},

	// Get License File
	getLicenseFile: function (opts) {
		// Check
		if ( !opts.licenses )  return ''

		// Prepare
		const result = [
			'# License',
			'',
			licenseUtil.getLicenseIntroduction(opts),
			'',
			opts.licenses.bodyHTML
		].join('\n')

		// Return
		return result
	}
}

// Export
export default licenseUtil
