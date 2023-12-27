// external
import { lines, t, ma, mcode, mh2 } from '@bevry/render'

// local
import type { FilenamesForReadmeFiles, Github } from './types.js'
import { fileUrl } from './util.js'

// Get History Section
export function getHistorySection(data: {
	filenamesForReadmeFiles: FilenamesForReadmeFiles
	github: Github
}): string {
	let link: string
	const file = data.filenamesForReadmeFiles.history
	if (file) {
		link = ma({
			url: fileUrl(data, file),
			inner: t([
				'Discover the release history by heading on over to the',
				mcode(file),
				'file.',
			]),
		})
	} else if (data.github.slug) {
		link = ma({
			url: `https://github.com/${data.github.slug}/releases`,
			inner:
				'Discover the release history by heading on over to the releases page.',
		})
	} else {
		throw new Error(
			'History section either requires a HISTORY file or a Github repository',
		)
	}

	// Return
	return lines([mh2('History'), link])
}
