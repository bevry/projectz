// local
import { ma, Link, trim } from '@bevry/render'
import type { Github } from './types.js'

export function fileUrl(data: { github: Github }, filename: string): string {
	if (data.github.slug) {
		return `https://github.com/${data.github.slug}/blob/HEAD/${filename}#files`
	} else {
		throw new Error(
			'File links are currently only supported for GitHub repositories',
		)
	}
}

// @todo replace this with bevry/ropo
export function replaceSection(
	names: string | string[],
	source: string,
	inject: string | Function,
	remove: boolean = false,
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
		return `<!-- ${sectionName}/ -->\n\n${trim(
			result,
		)}\n\n<!-- /${sectionName} -->\n\n\n`
	}

	const result = remove
		? source.replace(regex, '')
		: source.replace(regex, replace)
	return result
}

export function hydrateTextWithLinks(text: string) {
	const linksArray: Link[] = [
		{
			inner: 'Deno',
			url: 'https://deno.land',
			title:
				'Deno is a secure runtime for JavaScript and TypeScript, it is an alternative to Node.js',
		},
		{
			inner: 'Editions Autoloader',
			url: 'https://github.com/bevry/editions',
			title:
				'You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment',
		},
		{
			inner: 'Editions',
			url: 'https://editions.bevry.me',
			title:
				'Editions are the best way to produce and consume packages you care about.',
		},
		{
			inner: 'ESNextGuardian',
			url: 'https://github.com/bevry/esnextguardian',
			title:
				"Loads ES6+ files if the user's environment supports it, otherwise gracefully fallback to ES5 files.",
		},
		{
			inner: "Babel's Polyfill",
			url: 'https://babeljs.io/docs/usage/polyfill/',
			title: 'A polyfill that emulates missing ECMAScript environment features',
		},
		{
			inner: 'Babel',
			url: 'https://babeljs.io',
			title: 'The compiler for writing next generation JavaScript',
		},
		{
			inner: 'CoffeeScript',
			url: 'https://coffeescript.org',
			title: 'CoffeeScript is a little language that compiles into JavaScript',
		},
		{
			inner: 'Require',
			url: 'https://nodejs.org/dist/latest-v5.x/docs/api/modules.html',
			title: 'Node/CJS Modules',
		},
		{
			inner: 'Import',
			url: 'https://babeljs.io/docs/learn-es2015/#modules',
			title: 'ECMAScript Modules',
		},
		{
			inner: 'ESNext',
			url: 'https://en.wikipedia.org/wiki/ECMAScript#ES.Next',
			title: 'ECMAScript Next',
		},
		{
			inner: 'ES2015',
			url: 'https://babeljs.io/docs/en/learn#ecmascript-2015-features',
			title: 'ECMAScript 2015',
		},
		...(function () {
			const results: Array<Link> = []
			const year = new Date().getFullYear()
			for (let i = 2016; i <= year; i++) {
				results.push({
					inner: `ES${i}`,
					url: `https://en.wikipedia.org/wiki/ES${i}`,
					title: `ECMAScript ${i}`,
				})
			}
			return results
		})(),
		{
			inner: 'JSDoc Comments',
			url: 'http://usejsdoc.org',
			title:
				'JSDoc is an API documentation generator for JavaScript, similar to Javadoc or phpDocumentor',
		},
		{
			inner: 'Flow Type Comments',
			url: 'http://flowtype.org/blog/2015/02/20/Flow-Comments.html',
			title: 'Flow is a static type checker for JavaScript',
		},
		{
			inner: 'Flow Type',
			url: 'http://flowtype.org',
			title: 'Flow is a static type checker for JavaScript',
		},
		{
			inner: 'JSX',
			url: 'https://facebook.github.io/jsx/',
			title: 'XML/HTML inside your JavaScript',
		},
		{
			inner: 'Node.js',
			url: 'https://nodejs.org',
			title:
				"Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine",
		},
		{
			inner: 'TypeScript',
			url: 'https://www.typescriptlang.org/',
			title:
				'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
		},
	]

	// build a map
	const linksMap: Record<string, string> = {}
	for (const link of linksArray) {
		linksMap[link.inner.toLowerCase()] = ma(link)
	}

	// do the replacement
	const linksMatch = new RegExp(
		linksArray.map((link) => link.inner).join('|'),
		'g',
	)
	return text.replace(linksMatch, function (match) {
		return linksMap[match.toLowerCase()]
	})
}
