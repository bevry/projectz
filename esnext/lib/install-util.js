export function getInstallInstructions (opts) {
	const parts = []

	// DocPad
	if ( opts.name.indexOf('docpad-plugin-') === 0 ) {
		const pluginName = opts.name.substring(14)
		parts.push([
			'``` shell',
			`docpad install ${pluginName}`,
			'```'
		].join('\n'))
	}

	else {
		// Node
		if ( opts.packages.package ) {
			if ( opts.preferGlobal ) {
				const commands = '`' + Object.keys(opts.bin || {}).join('` ') + '`'

				// Global NPM
				parts.push([
					'### [NPM](http://npmjs.org/)',
					`- Use: ${commands}`,
					`- Install: \`npm install --global ${opts.name}\``
				].join('\n'))
			}
			else {
				// Local NPM
				parts.push([
					'### [NPM](http://npmjs.org/)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`npm install --save ${opts.name}\``
				].join('\n'))
			}

			// Browser
			if ( opts.browsers ) {
				parts.push([
					'### [Browserify](http://browserify.org/)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`npm install --save ${opts.name}\``,
					`- CDN URL: \`//wzrd.in/bundle/${opts.name}@${opts.version}\``,
				].join('\n'))
				parts.push([
					'### [Ender](http://enderjs.com)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`ender add ${opts.name}\``
				].join('\n'))
			}
		}

		// Component
		if ( opts.packages.component ) {
			parts.push([
				'### [Component](http://github.com/component/component)',
				`- Use: \`require('${opts.name}')\``,
				`- Install: \`component install ${opts.repo}\``
			].join('\n'))
		}

		// Bower
		if ( opts.packages.bower ) {
			parts.push([
				'### [Bower](http://bower.io/)',
				`- Use: \`require('${opts.name}')\``,
				`- Install: \`bower install ${opts.name}\``
			].join('\n'))
		}
	}

	return '## Install\n\n' + parts.join('\n\n')
}
