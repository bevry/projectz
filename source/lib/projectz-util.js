/* @flow */

// Import
const typeChecker = require('typechecker')

// License
class License {
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
class Licenses {
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

	/* eslint no-magic-numbers: 0 */
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
					descriptions.push(`<li>${item.descriptionHTML}</li>`)
					bodies.push(item.bodyHTML)
				}
				else if ( Array.isArray(item) ) {
					const items = Licenses.toHTML(item, depth + 1)
					descriptions.push(`<li>${items.descriptionHTML}</li>`)
					bodies.push(items.bodyHTML)
				}
				else if ( typeof item === 'string' ) {
					descriptions.push(`<li>${item}</li>`)
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
function getPersonHTML (person, opts = {}) {
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
function getPeopleHTML (people, opts = {}) {
	if ( people.length === 0 ) {
		return ''
	}
	else {
		return '<ul>' + people.map(function (person) {
			return '<li>' + getPersonHTML(person, opts) + '</li>'
		}).join('\n') + '</ul>'
	}
}

function getPersonText (person, opts = {}) {
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

function getPeopleTextArray (people, opts = {}) {
	if ( people.length === 0 ) {
		return []
	}
	else {
		const textArray = []
		people.forEach(function (person) {
			if ( !person.name || person.name === 'null' ) {
				console.error(person)
				throw new Error('For some reason the person doesn\'t have a name')
			}
			const text = getPersonText(person, opts)
			if ( text )  textArray.push(text)
		})
		return textArray
	}
}

// Get File URL
function getFileUrl (opts, filename) {
	if ( opts.github.slug ) {
		return `https://github.com/${opts.github.slug}/blob/master/${filename}#files`
	}
	else {
		throw new Error('File links are currently only supported for github repositories')
	}
}

// Get HTML Link
function getLink ({url, title, text}) {
	if ( !url || !text ) {
		throw new Error('Links must have both a url and text')
	}
	if ( title ) {
		return `<a href="${url}" title="${title}">${text}</a>`
	}
	else {
		return `<a href="${url}">${text}</a>`
	}
}

// Replace Section
function replaceSection (names, source, inject) {
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

	function replace () {
		const result = typeof inject === 'function' ? inject() : inject
		return `<!-- ${sectionName}/ -->\n\n${result}\n\n<!-- /${sectionName} -->\n\n\n`
	}

	const result = source.replace(regex, replace)

	return result
}

// Trim all whitespace at front and back
function trim (str) {
	return str.replace(/^\s+|\s+$/g, '')
}

// Exports
module.exports = {
	License,
	Licenses,
	getPersonHTML,
	getPeopleHTML,
	getPersonText,
	getPeopleTextArray,
	getFileUrl,
	getLink,
	replaceSection,
	trim
}
