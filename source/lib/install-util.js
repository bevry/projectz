/* @flow */
const {getLink} = require('./projectz-util.js')

// Define
function getInstallInstructions (data /* :Object */) /* :string */ {
	const parts = []

	// DocPad
	const prefix = 'docpad-plugin-'
	if ( data.name.indexOf(prefix) === 0 ) {
		const pluginName = data.name.substring(prefix.length)
		parts.push(`Install this DocPad plugin by entering <code>docpad install ${pluginName}</code> into your terminal.`)
	}

	else {
		// Node
		if ( data.filenamesForPackageFiles.package ) {
			const npmLink = getLink({text: '<h3>NPM</h3>', url: 'https://npmjs.com', title: 'npm is a package manager for javascript'})
			const flag = data.preferGlobal ? '--global' : '--save'
			const commands = typeof data.bin === 'string' ? [data.name] : Object.keys(data.bin || {})

			// Global NPM
			/* eslint no-magic-numbers:0 */
			parts.push(
				`${npmLink}<ul>` +
				`\n<li>Install: <code>npm install ${flag} ${data.name}</code></li>` +
				(commands.length ? `\n<li>Executable${commands.length === 1 ? '' : 's'}: <code>${commands.join('</code>, <code>')}</code></li>` : '') +
				(flag === '--save' ? `\n<li>Module: <code>require('${data.name}')</code></li>` : '') +
				'</ul>'
			)

			// Browser
			if ( data.browsers ) {
				const browserifyLink = getLink({text: '<h3>Browserify</h3>', url: 'http://browserify.org', title: "Browserify lets you require('modules') in the browser by bundling up all of your dependencies"})
				parts.push([
					`${browserifyLink}<ul>`,
					`<li>Install: <code>npm install --save ${data.name}</code></li>`,
					`<li>Module: <code>require('${data.name}')</code></li>`,
					`<li>CDN URL: <code>//wzrd.in/bundle/${data.name}@${data.version}</code></li></ul>`
				].join('\n'))

				const enderLink = getLink({text: '<h3>Ender</h3>', url: 'http://enderjs.com', title: 'Ender is a full featured package manager for your browser'})
				parts.push([
					`${enderLink}<ul>`,
					`<li>Install: <code>ender add ${data.name}</code></li>`,
					`<li>Module: <code>require('${data.name}')</code></li></ul>`
				].join('\n'))
			}
		}

		// Component
		if ( data.filenamesForPackageFiles.component ) {
			const componentLink = getLink({text: '<h3>Component</h3>', url: 'https://github.com/component/component', title: 'Frontend package manager and build tool for modular web applications'})
			parts.push([
				`${componentLink}<ul>`,
				`<li>Install: <code>component install ${data.name}</code></li>`,
				`<li>Module: <code>require('${data.name}')</code></li></ul>`
			].join('\n'))
		}

		// Bower
		if ( data.filenamesForPackageFiles.bower ) {
			const bowerLink = getLink({text: '<h3>Bower</h3>', url: 'http://bower.io', title: 'A package manager for the web'})
			parts.push([
				`${bowerLink}<ul>`,
				`<li>Install: <code>bower install ${data.name}</code></li>`,
				`<li>Module: <code>require('${data.name}')</code></li></ul>`
			].join('\n'))
		}

		// Babel
		if ( data.editions ) {
			let hasDefaultEdition = false
			const editions = []
			data.editions.forEach(function (edition) {
				const entry = edition.entry // .replace('/index.js', '')
				if ( edition.entry === data.main ) {
					hasDefaultEdition = true
					editions.push(`<code>${data.name}</code> aliases <code>${data.name}/${entry}</code>`)
				}
				editions.push(`<code>${data.name}/${entry}</code> is ${edition.description}`)
			})

			// Autoloaders
			if ( !hasDefaultEdition ) {
				if ( 'editions' in data.dependencies ) {
					editions.unshift(`<code>${data.name}</code> aliases <code>${data.name}/${data.main}</code> which uses Editions to automatically select the correct edition for the consumers environment`)
				}
				else if ( 'esnextguardian' in data.dependencies ) {
					editions.unshift(`<code>${data.name}</code> aliases <code>${data.name}/${data.main}</code> which uses ESNextGuardian to automatically select the correct edition for the consumers environment`)
				}
			}

			// Compile result
			let result = `<h3>Editions</h3>\n\n<p>This package is published with the following editions:</p>\n\n<ul><li>${editions.join('</li>\n<li>')}</li></ul>`

			// Is the last edition node 0.10 compatible?
			const syntaxes = data.editions[data.editions.length - 1].syntaxes
			if ( syntaxes.indexOf('symbols') !== -1 || syntaxes.indexOf('esnext') !== -1 || syntaxes.indexOf('es2015') !== -1 ) {
				result += "\n\n<p>Older environments may need Babel's Polyfill or something similar.</p>"
			}

			// Add links
			const linksArray = [
				{text: 'Editions', url: 'https://github.com/bevry/editions', title: 'Editions are the best way to produce and consume packages you care about.'},
				{text: 'ESNextGuardian', url: 'https://github.com/bevry/esnextguardian', title: "Loads ES6+ files if the user's environment supports it, otherwise gracefully fallback to ES5 files."},
				{text: "Babel's Polyfill", url: 'https://babeljs.io/docs/usage/polyfill/', title: 'A polyfill that emulates missing ECMAScript environment features'},
				{text: 'Babel', url: 'https://babeljs.io', title: 'The compiler for writing next generation JavaScript'},
				{text: 'Require', url: 'https://nodejs.org/dist/latest-v5.x/docs/api/modules.html', title: 'Node/CJS Modules'},
				{text: 'Import', url: 'https://babeljs.io/docs/learn-es2015/#modules', title: 'ECMAScript Modules'},
				{text: 'ESNext', url: 'https://babeljs.io/docs/learn-es2015/', title: 'ECMAScript Next'},
				{text: 'ES2015', url: 'http://babeljs.io/docs/plugins/preset-es2015/', title: 'ECMAScript 2015'},
				{text: 'Flow Type Comments', url: 'http://flowtype.org/blog/2015/02/20/Flow-Comments.html', title: 'Flow is a static type checker for JavaScript'},
				{text: 'Flow Type', url: 'http://flowtype.org', title: 'Flow is a static type checker for JavaScript'},
				{text: 'JSX', url: 'https://facebook.github.io/jsx/', title: 'XML/HTML inside your JavaScript'}
			]
			const linksMap = {}
			const linksMatch = new RegExp(linksArray.map((link) => link.text).join('|'), 'g')
			linksArray.forEach(function (link) {
				linksMap[link.text] = getLink(link)
			})
			result = result.replace(linksMatch, function (match) {
				return linksMap[match]
			})

			// Push result
			parts.push(result)
		}
	}

	return '<h2>Install</h2>\n\n' + parts.join('\n\n')
}

// Exports
module.exports = {getInstallInstructions}
