# Import
projectzUtil = require('./projectz-util')

# Define
module.exports = licenseUtil =
	getAuthorText: (author={}) ->
		return """
			Copyright &copy; #{projectzUtil.getPersonText(author)}
			"""

	getLicenseText: (license) ->
		fn = licenseUtil.sections[license.type.toLowerCase()]
		if fn
			return fn.call(@, license)
		else
			return licenseUtil.sections.unknown.call(@, license)

	getLicenseFileText: (license) ->
		fn = licenseUtil.files[license.type.toLowerCase()]
		if fn
			return fn.call(@, license)
		else
			return licenseUtil.files.unknown.call(@, license)

	getAuthors: (opts) ->
		result = ''

		if opts.authors.length is 0
			# ignore
		else if opts.authors.length is 1
			author = opts.authors[0]
			result += licenseUtil.getAuthorText(author)
		else
			result += (licenseUtil.getAuthorText(author)  for author in opts.authors).join('\n<br/>')

		return result

	getLicenses: (opts) ->
		result = ''

		if opts.licenses.length is 0
			# ignore
		else if opts.licenses.length is 1
			license = opts.licenses[0]
			result += "Licensed under #{licenseUtil.getLicenseText(license)}"
		else
			result += "Licensed under:\n\n"
			result += '- '+(licenseUtil.getLicenseText(license)  for license in opts.licenses).join('\n- ')

		return result

	getLicensesFiles: (opts) ->
		return (licenseUtil.getLicenseFileText(license)  for license in opts.licenses).join('\n\n')

	files:
		mit: (opts={}) ->
			return """
				## The MIT License
				Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

				The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

				THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
				"""

		unknown: (license) ->
			return """
				## #{license.type}
				#{badges.sections.unknown.call(@, license)}
				"""

	sections:
		mit: (license) ->
			url = license.url or 'http://creativecommons.org/licenses/MIT/'
			return """
				the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](#{url})
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
		result = """
			## License

			#{licenseUtil.getLicenses(opts)}

			#{licenseUtil.getAuthors(opts)}
			"""

		# Return
		return result

	# Get License File
	getLicenseFile: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = """
			# License

			#{licenseUtil.getAuthors(opts)}

			#{licenseUtil.getLicensesFiles(opts)}
			"""

		# Return
		return result
