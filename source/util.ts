/* :: declare type Person = Object; */
/* :: declare type PersonOptions = {displayCopyright?:boolean; displayYears?:boolean; githubSlug?:string}; */

import { Github, Link } from './types'
import type { default as Fellow, FormatOptions } from 'fellow'

export function getGithubSlug(data: {
	homepage?: string
	repository?: string | { url?: string }
}) {
	let match = null
	if (typeof data.repository === 'string') {
		match = data.repository.match(/^(?:github:)?([^/:]+\/[^/:]+)$/)
	} else {
		let url = null
		if (data.repository && typeof data.repository.url === 'string') {
			url = data.repository && data.repository.url
		} else if (typeof data.homepage === 'string') {
			url = data.homepage
		} else {
			return null
		}
		match = url.match(/github\.com[/:]([^/:]+\/[^/:]+?)(?:\.git|\/)?$/)
	}
	return (match && match[1]) || null
}

export function getPeopleHTML(people: Fellow[], opts?: FormatOptions): string {
	if (people.length === 0) {
		return ''
	} else {
		return (
			'<ul>' +
			people
				.map(function (person) {
					return '<li>' + person.toHTML(opts) + '</li>'
				})
				.join('\n') +
			'</ul>'
		)
	}
}

export function getPeopleTextArray(
	people: Fellow[],
	opts?: FormatOptions,
): string[] {
	if (people.length === 0) {
		return []
	} else {
		const textArray: string[] = []
		people.forEach(function (person) {
			if (!person.name || person.name === 'null') {
				throw new Error(
					`For some reason the person doesn't have a name: ${JSON.stringify(
						person,
						null,
						'  ',
					)}`,
				)
			}
			const text = person.toString(opts)
			if (text) textArray.push(text)
		})
		return textArray
	}
}

export function getFileUrl(data: { github: Github }, filename: string): string {
	if (data.github.slug) {
		return `https://github.com/${data.github.slug}/blob/master/${filename}#files`
	} else {
		throw new Error(
			'File links are currently only supported for github repositories',
		)
	}
}

export function getLink({ url, text, title }: Link): string {
	if (!url || !text) {
		throw new Error('Links must have both a url and text')
	}
	if (title) {
		return `<a href="${url}" title="${title}">${text}</a>`
	} else {
		return `<a href="${url}">${text}</a>`
	}
}

// @todo replace this with bevry/ropo
export function replaceSection(
	names: string | string[],
	source: string,
	inject: string | Function,
): string {
	let regexName: string, sectionName: string
	if (Array.isArray(names)) {
		regexName = '(' + names.join('|') + ')'
		sectionName = names[0]
	} else {
		regexName = sectionName = names
	}
	sectionName = sectionName.toUpperCase()

	/* eslint indent:0 */
	const regex = new RegExp(
		[
			'^(',
			`<!--\\s*${regexName}\\s*-->`,
			'|',
			`<!--\\s*${regexName}/\\s*-->`,
			'[\\s\\S]*?',
			`<!--\\s*/${regexName}\\s*-->`,
			')\\s+',
		].join(''),
		'gim',
	)

	function replace() {
		const result = typeof inject === 'function' ? inject() : inject
		return `<!-- ${sectionName}/ -->\n\n${result}\n\n<!-- /${sectionName} -->\n\n\n`
	}

	const result = source.replace(regex, replace)
	return result
}

export function trim(str: string): string {
	return str.replace(/^\s+|\s+$/g, '')
}
