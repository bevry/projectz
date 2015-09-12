// Import
const projectzUtil = require('./projectz-util')

// Define
const historyUtil = {
	// Get History Section
	getHistorySection: function (opts) {
		// Prepare
		const file = 'HISTORY.md'
		const url = projectzUtil.getFileUrl(opts, file)

		// Return
		return [
			'## History',
			`[Discover the change history by heading on over to the \`${file}\` file.](${url})`
		].join('\n')
	}
}

// Export
export default historyUtil
