// Import
const typeChecker = require('typechecker')

// License
export class License {
	constructor (spdx) {
		this.setSPDX(spdx)
	}

	setSPDX (spdx) {
		const result = License.parseSPDX(spdx)
		const {id, name, body, url} = result
		this.id = id
		this.name = name
		this.body = body
		this.url = url
		this.updateHTML()
		return this
	}

	updateHTML () {
		this.descriptionHTML = `<a href="${this.url}">${this.name}</a>`
		this.bodyHTML = this.body
			// Remove useless copyright headers
			.replace('\nCopyright (c) <year> <copyright holders>\n', '')

			// Remove license introductions
			.replace(/^[\s\S]+<<endOptional>>\s*/m, '')

			// Convert the license into HTML
			.replace(/^(.+?)\n\s*([\s\S]+)\s*$/, '<h2>$1</h2>\n\n<pre>\n$2\n</pre>')
		return this
	}

	static parseSPDX (spdx) {
		const result = require('spdx-license-list/spdx-full')[spdx]
		const id = spdx
		const name = result.name
		const body = result.license
		const url = `http://spdx.org/licenses/${id}.html`
		return {id, name, body, url}
	}

}

// Licenses
export class Licenses {
	constructor (spdx) {
		this.setSPDX(spdx)
	}

	setSPDX (spdx) {
		this.licenses = Licenses.parseSPDX(spdx)
		this.updateHTML()
		return this
	}

	updateHTML () {
		const {descriptionHTML, bodyHTML} = Licenses.toHTML(this.licenses)
		this.descriptionHTML = descriptionHTML
		this.bodyHTML = bodyHTML
		return this
	}

	static parseSPDX (value, depth = 0) {
		if ( typeof value === 'string' ) {
			value = require('spdx').parse(value)
		}

		if ( value.license ) {
			const license = new License(value.license)
			if ( depth === 0 ) {
				return [license]
			}
			else {
				return license
			}
		}
		else {
			const licenses = []
			licenses.push(Licenses.parseSPDX(value.left, depth + 1))
			licenses.push(value.conjunction)
			licenses.push(Licenses.parseSPDX(value.right, depth + 1))
			return licenses
		}
	}

	// ['MIT', 'and', 'CC']
	static toHTML (licenses, depth = 0) {
		if ( licenses.length === 0 ) {
			return {
				descriptionHTML: '',
				bodyHTML: ''
			}
		}
		else {
			const descriptions = []
			const bodies = []

			licenses.forEach((item) => {
				if ( item instanceof License ) {
					descriptions.push('<li>' + item.descriptionHTML + '</li>')
					bodies.push(item.bodyHTML)
				}
				else if ( Array.isArray(item) ) {
					const items = Licenses.toHTML(item, depth + 1)
					descriptions.push('<li>' + items.descriptionHTML + '</li>')
					bodies.push(items.bodyHTML)
				}
				else if ( typeof item === 'string' ) {
					descriptions.push('<li>' + item + '</li>')
				}
				else {
					throw new Error('Unknown item type')
				}
			})

			return {
				descriptionHTML: '<ul>' + descriptions.join('\n') + '</ul>',
				bodyHTML: bodies.join('\n\n')
			}
		}
	}
}


// Get Person HTML
export function getPersonHTML (person, opts = {}) {
	if ( person.name ) {
		let html = ''

		if ( opts.copyright )  html += 'Copyright &copy; '
		if ( opts.years && person.years )  html += person.years + ' '

		html += person.url ? `<a href="${person.url}">${person.name}</a>` : person.name

		if ( person.githubUsername && opts.githubSlug ) {
			const contributionsURL = `https://github.com/${opts.githubSlug}/commits?author=${person.githubUsername}`
			html += ` — <a href="${contributionsURL}" title="View the GitHub contributions of ${person.name} on repository ${opts.githubSlug}">view contributions</a>`
		}
		return html
	}
	else {
		return ''
	}
}

// Get People HTML
export function getPeopleHTML (people, opts = {}) {
	if ( people.length === 0 ) {
		return ''
	}
	else {
		return '<ul>' + people.map(function (person) {
			return '<li>' + getPersonHTML(person, opts) + '</li>'
		}).join('\n') + '</ul>'
	}
}

export function getPersonText (person, opts = {}) {
	if ( person.name ) {
		let text = ''
		if ( opts.years && person.years )  text += person.years + ' '
		text += person.name
		if ( person.email )  text += ' <' + person.email + '>'
		if ( person.url )    text += ' (' + person.url + ')'
		return text
	}
	else {
		return ''
	}
}

export function getPeopleTextArray (people, opts = {}) {
	if ( people.length === 0 ) {
		return []
	}
	else {
		let textArray = []
		people.forEach(function (person) {
			if ( !person.name || person.name === 'null' ) throw new Error('For some reason the person doesn\'t have a name')
			const text = getPersonText(person, opts)
			if ( text )  textArray.push(text)
		})
		return textArray
	}
}

// Get File URL
export function getFileUrl (opts, filename) {
	return `https://github.com/${opts.username}/${opts.name}/blob/master/${filename}#files`
}

// Get Function Named
// e.g. {getMitLicense,getLicenses} with 'mit' returns getMitLicense
export function getFunctionNamed (str) {
	// Prepare
	str = str.toLowerCase()

	// Find
	for ( const name of Object.keys(this) ) {
		const fn = this[fn]
		if ( name.substr(3).substr(str.length * -1).toLowerCase() === str ) {
			return fn
		}
	}

	// Return
	return null
}

// Get Functions Ending With
// e.g. {getNpmBadge,getBadges} with 'Badge' returns [getNpmBadge]
export function getFunctionsEndingWith (str) {
	// Prepare
	const fns = []

	// Find
	for ( const name of Object.keys(this) ) {
		const fn = this[fn]
		if ( name.substr(str.length * -1) === str ) {
			fns.push(fn)
		}
	}

	// Return
	return fns
}

// Replace Section
export function replaceSection (names, source, inject) {
	let regexName, sectionName
	if ( typeChecker.isArray(names) ) {
		regexName = '(' + names.join('|') + ')'
		sectionName = names[0]
	}
	else {
		regexName = sectionName = names
	}
	sectionName = sectionName.toUpperCase()

	/* eslint indent:0 */
	const regex = new RegExp([
		'^(',
			`<!--\\s*${regexName}\\s*-->`,
			'|',
			`<!--\\s*${regexName}/\\s*-->`,
			'[\\s\\S]*?',
			`<!--\\s*/${regexName}\\s*-->`,
		')\\s+'
	].join(''), 'gim')

	const replace = `<!-- ${sectionName}/ -->\n\n${inject}\n\n<!-- /${sectionName} -->\n\n\n`

	const result = source.replace(regex, replace)

	return result
}

export function csvToArray ( str ) {
	if ( typeof str === 'string') {
		return str.split(/[,\n]/).map(function (i) {
			return i.trim()
		})
	}
	return []
}
