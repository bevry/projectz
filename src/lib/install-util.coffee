module.exports = installUtil =

	getInstallInstructions: (opts) ->
		result = "## Install"

		# DocPad
		if opts.name.indexOf('docpad-plugin-') is 0
			pluginName = opts.name.substring(14)
			result += """
				\n
				``` bash
				docpad install #{pluginName}
				```
				"""

		else
			# Node
			if opts.packages.package
				if opts.preferGlobal
					commands = '`'+Object.keys(opts.bin || {}).join('` ')+'`'
					# NPM
					result += """
						\n
						### [NPM](http://npmjs.org/)
						- Use: #{commands}
						- Install: `npm install --global #{opts.name}`
						"""
				else
					# NPM
					result += """
						\n
						### [NPM](http://npmjs.org/)
						- Use: `require('#{opts.name}')`
						- Install: `npm install --save #{opts.name}`
						"""

				# Browser
				if opts.browsers
					result += """
						\n
						### [Browserify](http://browserify.org/)
						- Use: `require('#{opts.name}')`
						- Install: `npm install --save #{opts.name}`
						- CDN URL: `//wzrd.in/bundle/#{opts.name}@#{opts.version}`

						### [Ender](http://enderjs.com)
						- Use: `require('#{opts.name}')`
						- Install: `ender add #{opts.name}`
						"""

			# Component
			if opts.packages.component
				result += """
					\n
					### [Component](http://github.com/component/component)
					- Use: `require('#{opts.name}')`
					- Install: `component install #{opts.repo}`
					"""

			# Bower
			if opts.packages.bower
				result += """
					\n
					### [Bower](http://bower.io/)
					- Use: `require('#{opts.name}')`
					- Install: `bower install #{opts.name}`
					"""

		return result
