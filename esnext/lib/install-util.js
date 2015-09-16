const projectzUtil = require('./projectz-util')

export function getInstallInstructions (opts) {
	const parts = []

	// DocPad
	if ( opts.name.indexOf('docpad-plugin-') === 0 ) {
		const pluginName = opts.name.substring(14)
		parts.push(`Install this DocPad plugin by entering <code>docpad install ${pluginName}</code> into your terminal.`)
	}

	else {
		// Node
		if ( opts.filenamesForPackageFiles.package ) {
			const npmLink = projectzUtil.getLink({text: '<h3>NPM</h3>', url: 'https://npmjs.com', title: 'npm is a package manager for javascript'})

			if ( opts.preferGlobal ) {
				const commands = '<code>' + Object.keys(opts.bin || {}).join('</code> <code>') + '</code>'

				// Global NPM
				parts.push([
					`${npmLink}<ul>`,
					`<li>Install: <code>npm install --global ${opts.name}</code></li>`,
					`<li>Use: ${commands}</li></ul>`
				].join('\n'))
			}
			else {
				// Local NPM
				parts.push([
					`${npmLink}<ul>`,
					`<li>Install: <code>npm install --save ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li></ul>`
				].join('\n'))
			}

			// Browser
			if ( opts.browsers ) {
				const browserifyLink = projectzUtil.getLink({text: '<h3>Browserify</h3>', url: 'http://browserify.org', title: "Browserify lets you require('modules') in the browser by bundling up all of your dependencies"})
				parts.push([
					`${browserifyLink}<ul>`,
					`<li>Install: <code>npm install --save ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li>`,
					`<li>CDN URL: <code>//wzrd.in/bundle/${opts.name}@${opts.version}</code></li></ul>`
				].join('\n'))

				const enderLink = projectzUtil.getLink({text: '<h3>Ender</h3>', url: 'http://enderjs.com', title: 'Ender is a full featured package manager for your browser'})
				parts.push([
					`${enderLink}<ul>`,
					`<li>Install: <code>ender add ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li></ul>`
				].join('\n'))
			}
		}

		// Component
		if ( opts.filenamesForPackageFiles.component ) {
			const componentLink = projectzUtil.getLink({text: '<h3>Component</h3>', url: 'https://github.com/component/component', title: 'Frontend package manager and build tool for modular web applications'})
			parts.push([
				`${componentLink}<ul>`,
				`<li>Install: <code>component install ${opts.name}</code></li>`,
				`<li>Use: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}

		// Bower
		if ( opts.filenamesForPackageFiles.bower ) {
			const bowerLink = projectzUtil.getLink({text: '<h3>Bower</h3>', url: 'http://bower.io', title: 'A package manager for the web'})
			parts.push([
				`${bowerLink}<ul>`,
				`<li>Install: <code>bower install ${opts.name}</code></li>`,
				`<li>Use: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}
	}

	return '<h2>Install</h2>\n\n' + parts.join('\n\n')
}
