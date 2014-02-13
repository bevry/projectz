module.exports = installUtil =

	getInstallInstructions: (opts) ->
		result = "## Install"

		if opts.packages.package
			result += """
				\n
				### [Node](http://nodejs.org/)
				- Use: `require('#{opts.name}')`
				- Install: `npm install --save #{opts.name}`
				"""

		if opts.name.indexOf('docpad-plugin-') == 0
			pluginName = opts.name.substring(14)
			result += """
				\n
				### [DocPad](http://docpad.org/)
				- Install: `docpad install #{pluginName}`
				"""

		if opts.packages.package and opts.browsers
			result += """
				\n
				### [Browserify](http://browserify.org/)
				- Use: `require('#{opts.name}')`
				- Install: `npm install --save #{opts.name}`
				- CDN URL: `//wzrd.in/bundle/#{opts.name}@#{opts.version}`

				### [Ender](http://ender.jit.su/)
				- Use: `require('#{opts.name}')`
				- Install: `ender add #{opts.name}`
				"""

		if opts.packages.component
			result += """
				\n
				### [Component](http://github.com/component/component)
				- Use: `require('#{opts.name}')`
				- Install: `component install #{opts.repo}`
				"""

		if opts.packages.bower
			result += """
				\n
				### [Bower](http://bower.io/)
				- Use: `require('#{opts.name}')`
				- Install: `bower install #{opts.name}`
				"""

		return result
