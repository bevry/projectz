export function getInstallInstructions (opts) {
	let result = '## Install'

	// DocPad
	if ( opts.name.indexOf('docpad-plugin-') === 0 ) {
		const pluginName = opts.name.substring(14)
		result += [
			'\n',
			'``` shell',
			`docpad install ${pluginName}`,
			'```'
		].join('\n')
	}

	else {
		// Node
		if ( opts.packages.package ) {
			if ( opts.preferGlobal ) {
				const commands = '`' + Object.keys(opts.bin || {}).join('` ') + '`'

				// Global NPM
				result += [
					'\n',
					'### [NPM](http://npmjs.org/)',
					`- Use: ${commands}`,
					`- Install: \`npm install --global ${opts.name}\``
				].join('\n')
			}
			else {
				// Local NPM
				result += [
					'\n',
					'### [NPM](http://npmjs.org/)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`npm install --save ${opts.name}\``
				].join('\n')
			}

			// Browser
			if ( opts.browsers ) {
				result += [
					'\n',
					'### [Browserify](http://browserify.org/)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`npm install --save ${opts.name}\``,
					`- CDN URL: \`//wzrd.in/bundle/${opts.name}@${opts.version}\``,
					'',
					'',
					'### [Ender](http://enderjs.com)',
					`- Use: \`require('${opts.name}')\``,
					`- Install: \`ender add ${opts.name}\``
				].join('\n')
			}
		}

		// Component
		if ( opts.packages.component ) {
			result += [
				'\n',
				'### [Component](http://github.com/component/component)',
				`- Use: \`require('${opts.name}')\``,
				`- Install: \`component install ${opts.repo}\``
			].join('\n')
		}

		// Bower
		if ( opts.packages.bower ) {
			result += [
				'\n',
				'### [Bower](http://bower.io/)',
				`- Use: \`require('${opts.name}')\``,
				`- Install: \`bower install ${opts.name}\``
			].join('\n')
		}
	}

	return result
}
