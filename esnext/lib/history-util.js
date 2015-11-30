// Import
const projectzUtil = require('./projectz-util')

// Get History Section
export function getHistorySection (opts) {
	// Prepare
	let link = null
	const file = opts.filenamesForReadmeFiles.history
	if ( file ) {
		link = projectzUtil.getLink({
			url: projectzUtil.getFileUrl(opts, file),
			text: `Discover the release history by heading on over to the <code>${file}</code> file.`
		})
	}
	else if ( opts.github.slug ) {
		link = projectzUtil.getLink({
			url: `https://github.com/${opts.github.slug}/releases`,
			text: `Discover the release history by heading on over to the releases page.`
		})
	}
	else {
		throw new Error('History section either requires a HISTORY file or a Github repository')
	}

	// Return
	return '<h2>History</h2>\n\n' + link
}
