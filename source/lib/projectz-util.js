/* @flow */

/* :: declare type Person = Object; */
/* :: declare type PersonOptions = {displayCopyright?:boolean; displayYears?:boolean; githubSlug?:string}; */

function getPersonHTML (person /* :Person */, opts /* :PersonOptions */ = {}) /* :string */ {
	if ( person.name ) {
		let html = ''

		if ( opts.displayCopyright )  html += 'Copyright &copy; '
		if ( opts.displayYears && person.years )  html += person.years + ' '

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

function getPeopleHTML (people /* :Array<Person> */, opts /* :PersonOptions */ = {}) /* :string */ {
	if ( people.length === 0 ) {
		return ''
	}
	else {
		return '<ul>' + people.map(function (person) {
			return '<li>' + getPersonHTML(person, opts) + '</li>'
		}).join('\n') + '</ul>'
	}
}

function getPersonText (person /* :Person */, opts /* :PersonOptions */ = {}) /* :string */ {
	if ( person.name ) {
		let text = ''
		if ( opts.displayYears && person.years )  text += person.years + ' '
		text += person.name
		if ( person.email )  text += ' <' + person.email + '>'
		if ( person.url )    text += ' (' + person.url + ')'
		return text
	}
	else {
		return ''
	}
}

function getPeopleTextArray (people /* :Array<Person> */, opts /* :PersonOptions */ = {}) /* :Array<string> */ {
	if ( people.length === 0 ) {
		return []
	}
	else {
		const textArray = []
		people.forEach(function (person) {
			if ( !person.name || person.name === 'null' ) {
				throw new Error(`For some reason the person doesn't have a name: ${JSON.stringify(person, null, '  ')}`)
			}
			const text = getPersonText(person, opts)
			if ( text )  textArray.push(text)
		})
		return textArray
	}
}

function getFileUrl (data /* :Object */, filename /* :string */) /* :string */ {
	if ( data.github.slug ) {
		return `https://github.com/${data.github.slug}/blob/master/${filename}#files`
	}
	else {
		throw new Error('File links are currently only supported for github repositories')
	}
}

function getLink ({url, text, title} /* :Object */) /* :string */ {
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

function replaceSection (names /* :string|Array<string> */, source /* :string */, inject /* :: :string|function */) /* :string */ {
	let regexName, sectionName
	if ( Array.isArray(names) ) {
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

function trim (str /* :string */) /* :string */ {
	return str.replace(/^\s+|\s+$/g, '')
}

// Exports
module.exports = {getPersonHTML, getPeopleHTML, getPersonText, getPeopleTextArray, getFileUrl, getLink, replaceSection, trim}
