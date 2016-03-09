/* @flow */

// Import
const projectzUtil = require('./projectz-util')

// Define
function getInstallInstructions (opts) {
	const parts = []

	// DocPad
	const prefix = 'docpad-plugin-'
	if ( opts.name.indexOf(prefix) === 0 ) {
		const pluginName = opts.name.substring(prefix.length)
		parts.push(`Install this DocPad plugin by entering <code>docpad install ${pluginName}</code> into your terminal.`)
	}

	else {
		// Node
		if ( opts.filenamesForPackageFiles.package ) {
			const npmLink = projectzUtil.getLink({text: '<h3>NPM</h3>', url: 'https://npmjs.com', title: 'npm is a package manager for javascript'})
			const flag = opts.preferGlobal ? '--global' : '--save'
			const commands = typeof opts.bin === 'string' ? [opts.name] : Object.keys(opts.bin || {})

			// Global NPM
			/* eslint no-magic-numbers:0 */
			parts.push(
				`${npmLink}<ul>` +
				`\n<li>Install: <code>npm install ${flag} ${opts.name}</code></li>` +
				(commands.length ? `\n<li>Executable${commands.length === 1 ? '' : 's'}: <code>${commands.join('</code>, <code>')}</code></li>` : '') +
				(flag === '--save' ? `\n<li>Module: <code>require('${opts.name}')</code></li>` : '') +
				'</ul>'
			)

			// Browser
			if ( opts.browsers ) {
				const browserifyLink = projectzUtil.getLink({text: '<h3>Browserify</h3>', url: 'http://browserify.org', title: "Browserify lets you require('modules') in the browser by bundling up all of your dependencies"})
				parts.push([
					`${browserifyLink}<ul>`,
					`<li>Install: <code>npm install --save ${opts.name}</code></li>`,
					`<li>Module: <code>require('${opts.name}')</code></li>`,
					`<li>CDN URL: <code>//wzrd.in/bundle/${opts.name}@${opts.version}</code></li></ul>`
				].join('\n'))

				const enderLink = projectzUtil.getLink({text: '<h3>Ender</h3>', url: 'http://enderjs.com', title: 'Ender is a full featured package manager for your browser'})
				parts.push([
					`${enderLink}<ul>`,
					`<li>Install: <code>ender add ${opts.name}</code></li>`,
					`<li>Module: <code>require('${opts.name}')</code></li></ul>`
				].join('\n'))
			}
		}

		// Component
		if ( opts.filenamesForPackageFiles.component ) {
			const componentLink = projectzUtil.getLink({text: '<h3>Component</h3>', url: 'https://github.com/component/component', title: 'Frontend package manager and build tool for modular web applications'})
			parts.push([
				`${componentLink}<ul>`,
				`<li>Install: <code>component install ${opts.name}</code></li>`,
				`<li>Module: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}

		// Bower
		if ( opts.filenamesForPackageFiles.bower ) {
			const bowerLink = projectzUtil.getLink({text: '<h3>Bower</h3>', url: 'http://bower.io', title: 'A package manager for the web'})
			parts.push([
				`${bowerLink}<ul>`,
				`<li>Install: <code>bower install ${opts.name}</code></li>`,
				`<li>Module: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}

		// Babel
		if ( opts.editions ) {
			const links = [
				{text: 'ESNextGuardian', url: 'https://www.npmjs.com/package/esnextguardian', title: `Loads ES6+ files if the user's environment supports it, otherwise gracefully fallback to ES5 files.`},
				{text: 'Babel', url: 'https://babeljs.io', title: 'The compiler for writing next generation JavaScript'},
				{text: 'ESNext', url: 'https://babeljs.io/docs/learn-es2015/'},
				{text: 'ES2015', url: 'http://babeljs.io/docs/plugins/preset-es2015/'},
				{text: 'Flow Type', url: 'http://flowtype.org', title: 'Flow is a static type checker for JavaScript'}
			]
			const polyfillLink = projectzUtil.getLink({text: `Babel's Polyfill`, url: 'https://babeljs.io/docs/usage/polyfill/', title: 'A polyfill by the Babel project that emulates missing ECMAScript environment features'})
			const otherLink = 'something else'

			let defaultEdition = null
			let part = [
				`<h3>Editions</h3>`,
				`<p>The published package includes the following editions:<ul>`
			].concat(
				opts.editions.map(function (edition) {
					let suffix = ''
					if ( edition.entry === opts.main ) {
						defaultEdition = edition
						suffix = ', this is the default entry'
					}
					return `<li>The ${edition.description} is at <code>${opts.name + '/' + edition.directory}</code> with entry at <code>${opts.name + '/' + edition.entry}</code>${suffix}</li>`
				})
			).concat([
				((defaultEdition === null)
					? ((opts.main || '').indexOf('esnextguardian') !== -1
						? `<li>The default entry uses ESNextGuardian and is at <code>${opts.name + '/' + opts.main}</code></li>`
						: `<li>The default entry is at <code>${opts.name + '/' + opts.main}</code></li>`)
					: '') + '</ul>',
				`Older ECMAScript environments may need ${polyfillLink} or ${otherLink}.</p>`
			]).join('\n')

			for ( const link of links ) {
				part = part.replace(link.text, projectzUtil.getLink(link))
			}

			parts.push(part)
		}
	}

	return '<h2>Install</h2>\n\n' + parts.join('\n\n')
}

// Export
module.exports = {getInstallInstructions}
