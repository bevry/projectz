// Import
const projectzUtil = require('./projectz-util')
const badgeUtil = require('./badge-util')
const Fellow = require('fellow')

// Define
const backerUtil = {

	getSponsorsText: function (opts) {
		let result = ''

		if ( opts.sponsors.length === 0 ) {
			// ignore
			result +=
				'No sponsors yet! Will you be the first?\n\n' +
				badgeUtil.getTypedBadges('donation', opts)
		}
		else {
			result +=
				'These amazing people have contributed finances to this project:\n\n' +
				projectzUtil.getPeopleHTML(opts.sponsors, {githubSlug: opts.github.slug}) +
				`\n\nBecome a sponsor!\n\n${badgeUtil.getTypedBadges('donation', opts)}`
		}

		return result
	},

	getMaintainersText: function (opts) {
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
	},

	getContributorsText: function (opts) {
		let result = ''

		if ( opts.contributors.length === 0 ) {
			// ignore
			result +=
				'No contributors yet! Will you be the first?' +
				`\n${backerUtil.getContributeText(opts)}`
		}
		else {
			result +=
				'These amazing people have contributed code to this project:\n\n'
					+ projectzUtil.getPeopleHTML(opts.contributors, {githubSlug: opts.github.slug}) +
					`\n\n${backerUtil.getContributeText(opts, 'Become a contributor!')}`
		}

		return result
	},

	getContributeText: function (opts, text) {
		// Prepare
		const file = 'CONTRIBUTING.md'
		const url = projectzUtil.getFileUrl(opts, file)
		if ( text == null )  text = `Discover how you can contribute by heading on over to the \`${file}\` file.`

		// Return
		return `[${text}](${url})`
	},

	getBackerSection: function (opts) {
		// Check
		if ( !opts.licenses )  return ''

		// Prepare
		const result = [
			'## Backers',
			'',
			'### Maintainers',
			'',
			backerUtil.getMaintainersText(opts),
			'',
			'### Sponsors',
			'',
			backerUtil.getSponsorsText(opts),
			'',
			'### Contributors',
			'',
			backerUtil.getContributorsText(opts)
		].join('\n')

		// Return
		return result
	},

	getBackerFile: function (opts) {
		// Check
		if ( !opts.licenses )  return ''

		// Prepare
		const result = [
			'# Backers',
			'',
			'## Maintainers',
			'',
			backerUtil.getMaintainersText(opts),
			'',
			'## Sponsors',
			'',
			backerUtil.getSponsorsText(opts),
			'',
			'## Contributors',
			'',
			backerUtil.getContributorsText(opts)
		].join('\n')

		// Return
		return result
	},

	getContributeSection: function (opts) {
		// Prepare
		const result = [
			'## Contribute',
			'',
			backerUtil.getContributeText(opts)
		].join('\n')

		// Return
		return result
	}
}

// Export
export default backerUtil
