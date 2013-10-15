# Import
utils = require('./utils')

# Define
licenses =
	getAuthorText: (author={}) ->
		return """
			Copyright &copy; #{author.markdown or author.text or author}
			"""

	getLicenseText: (license) ->
		fn = licenses.sections[license.toLowerCase()]
		if fn
			return fn.call(@, license)
		else
			return licenses.sections.unknown.call(@, license)

	files:
		mit: (opts={}) ->
			return """
				## The MIT License

				Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

				The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

				THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
				"""

	sections:
		mit: (license) ->
			url = license.url or 'http://creativecommons.org/licenses/MIT/'
			return """
				the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](#{url})
				"""

		unknown: (license) ->
			if license.url
				"[#{license.type}](#{license.url})"
			else
				license.type

	# Get License Section
	getLicenseSection: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = "## License"

		# Authors
		if opts.authors.length is 0
			# ignore
		else if opts.authors.length is 1
			author = opts.authors[0]
			result += '\n\n'+licenses.getAuthorText(author)
		else
			result += (licenses.getLicenseText(license)  for license in opts.licenses).join('- ')

		# Concatenate badges
		if opts.licenses.length is 0
			# ignore
		else if opts.licenses.length is 1
			license = opts.licenses[0]
			result += "\n\nLicensed under #{licenses.getLicenseText(license)}"
		else
			result += "\n\nLicensed under:\n\n"
			result += '- '+(licenses.getLicenseText(license)  for license in opts.licenses).join('- ')

		# Return
		return result

	# Get License File
	getLicenseFile: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = ''
		result += """
			# License#{if opts.licenses.length is 1 then '' else 's'}

			"""  if opts.header isnt false

		# Authors
		authors = @getAuthors(opts)
		result += authors  if authors

		# Handle
		for license in opts.licenses
			fn = utils.getFunctionNamed.call(licenses, license.type+'License')
			result += '\n\n'+fn.call(@, opts)+'\n'

		# Return
		return result

# Export
module.exports = licenses