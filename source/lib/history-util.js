/* @flow */
const {getLink, getFileUrl} = require('./projectz-util.js')

// Get History Section
function getHistorySection (data /* :Object */) /* :string */ {
	// Prepare
	let link = null
	const file = data.filenamesForReadmeFiles.history
	if ( file ) {
		link = getLink({
			url: getFileUrl(data, file),
			text: `Discover the release history by heading on over to the <code>${file}</code> file.`
		})
	}
	else if ( data.github.slug ) {
		link = getLink({
			url: `https://github.com/${data.github.slug}/releases`,
			text: 'Discover the release history by heading on over to the releases page.'
		})
	}
	else {
		throw new Error('History section either requires a HISTORY file or a Github repository')
	}

	// Return
	return '<h2>History</h2>\n\n' + link
}

// Exports
module.exports = {getHistorySection}
