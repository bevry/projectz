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
		if ( opts.packages.package ) {
			if ( opts.preferGlobal ) {
				const commands = '<code>' + Object.keys(opts.bin || {}).join('</code> <code>') + '</code>'

				// Global NPM
				parts.push([
					`<h3>${projectzUtil.getLink({text: 'NPM', url: 'https://npmjs.com', title: 'npm is a package manager for javascript'})}</h3><ul>`,
					`<li>Install: <code>npm install --global ${opts.name}</code></li>`,
					`<li>Use: ${commands}</li></ul>`
				].join('\n'))
			}
			else {
				// Local NPM
				parts.push([
					`<h3>${projectzUtil.getLink({text: 'NPM', url: 'https://npmjs.com', title: 'npm is a package manager for javascript'})}</h3><ul>`,
					`<li>Install: <code>npm install --save ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li></ul>`
				].join('\n'))
			}

			// Browser
			if ( opts.browsers ) {
				parts.push([
					`<h3>${projectzUtil.getLink({text: 'Browserify', url: 'http://browserify.org', title: "Browserify lets you require('modules') in the browser by bundling up all of your dependencies"})}</h3><ul>`,
					`<li>Install: <code>npm install --save ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li>`
					`<li>CDN URL: <code>//wzrd.in/bundle/${opts.name}@${opts.version}</code></li></ul>`
				].join('\n'))
				parts.push([
					`<h3>${projectzUtil.getLink({text: 'Ender', url: 'http://enderjs.com', title: 'Ender is a full featured package manager for your browser'})}</h3><ul>`,
					`<li>Install: <code>ender add ${opts.name}</code></li>`,
					`<li>Use: <code>require('${opts.name}')</code></li></ul>`
				].join('\n'))
			}
		}

		// Component
		if ( opts.packages.component ) {
			parts.push([
				`<h3>${projectzUtil.getLink({text: 'Component', url: 'https://github.com/component/component', title: 'Frontend package manager and build tool for modular web applications'})}</h3><ul>`,
				`<li>Install: <code>component install ${opts.name}</code></li>`,
				`<li>Use: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}

		// Bower
		if ( opts.packages.bower ) {
			parts.push([
				`<h3>${projectzUtil.getLink({text: 'Bower', url: 'http://bower.io', title: 'A package manager for the web'})}</h3><ul>`,
				`<li>Install: <code>bower install ${opts.name}</code></li>`,
				`<li>Use: <code>require('${opts.name}')</code></li></ul>`
			].join('\n'))
		}
	}

	return '<h2>Install</h2>\n\n' + parts.join('\n\n')
}
