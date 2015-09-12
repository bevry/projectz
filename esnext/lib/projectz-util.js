// Import
const typeChecker = require('typechecker')

// License
export class License {
	constructor (spdx) {
		this.setSPDX(spdx)
	}

	setSPDX (spdx) {
		const {id, name, body, url} = License.parseSDPX(spdx)
		this.id = id
		this.name = name
		this.body = body
		this.url = url
		this.updateHTML()
		return this
	}

	updateHTML () {
		this.descriptionHTML = `<a href="${this.url}">${this.name}</a>`
		this.bodyHTML = `<h2>${this.name}</h2>\n${this.body}`
		return this
	}

	static parseSPDX (spdx) {
		const license = require('spdx-license-list/spdx-full')[spdx]
		const id = license.id
		const name = license.name
		const body = license.license
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
		this.licenses = Licenses.parseSDPX(spdx)
		this.updateHTML()
		return this
	}

	updateHTML () {
		this.html = Licenses.toHTML(this.licenses)
		this.descriptionHTML = this.html.description
		this.bodyHTML = this.html.body
		return this
	}

	static parseSPDX (value) {
		if ( value === 'string' ) {
			value = require('spdx').parse(value)
		}

		const licenses = []

		if ( value.license ) {
			const license = new License(value.license)
			licenses.push(license)
		}
		else {
			licenses.push(Licenses.parseSPDX(value.left))
			licenses.push(value.conjuction)
			licenses.push(Licenses.parseSPDX(value.right))
		}

		return licenses
	}

	static toHTML (licenses) {
		if ( licenses.length === 0 ) {
			return {
				description: '',
				body: ''
			}
		}
		else {
			const descriptions = []
			const bodies = []
			licenses.forEach((item) => {
				if ( item instanceof License ) {
					descriptions.push('<li>' + item.description + '</li>')
					bodies.push(item.body)
				}
				else if ( Array.isArray(item) ) {
					const items = Licenses.toHTML(item)
					descriptions.push('<li>' + items.description + '</li>')
					bodies.push(items.bodies)
				}
				else if ( typeof item === 'string' ) {
					descriptions.push('<li>' + item + '</li>')
				}
				else {
					throw new Error('Unknown item type')
				}
			})

			return {
				description: '<ul>' + descriptions.join('\n') + '</ul>',
				body: bodies.join('\n\n')
			}
		}
	}
}


// Get Person HTML
export function getPersonHTML (person, opts = {}) {
	if ( person.name ) {
		let text = ''

		if ( opts.years && person.years )  text += person.years + ' '
		text += person.name

		let html = person.url ? `<a href="${person.url}">${text}</a>` : person.name

		if ( person.githubUsername && opts.githubSlug ) {
			const contributionsURL = `https://github.com/${opts.githubSlug}/commits?author=${person.githubUsername}`
			html += `<a href="${contributionsURL}" title="View the GitHub contributions of ${person.name} on repository ${opts.githubSlug}">view contributions</a>`
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
			return getPersonHTML(person, opts)
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
		'\n(',
			`<!--\s*${regexName}\s*-->`,
			'|',
			`<!--\s*${regexName}/\s*-->`,
			'[\s\S]*?',
			`<!--\s*/${regexName}\s*-->`,
		')\s*'
	].join(''), 'gim')

	const replace = `\n<!-- ${sectionName}/ -->\n\n${inject}\n\n<!-- /${sectionName} -->\n\n\n`

	const result = source.replace(regex, replace)

	return result
}
