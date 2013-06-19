# Define
licenses =
	# Get Authors
	getAuthors: (opts-{}) ->
		# Check
		return ''  if !opts.authors

		# Prepare
		authors = ''

		# Handle
		for author in opts.authors
			authors += "- Copyright &copy; #{author.year} #{author.markdown}"

		# Return
		return authors


	# Get MIT License
	getMitLicense: (opts={}) ->
		# Return
		return """
			## The MIT License

			Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
			"""

	# Get MIT Section
	getMitSection: (opts={}) ->
		# Return
		return """
			Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
			"""

	# Get Multi License Section
	getMultiSection: (opts={}) ->
		# Check
		return ''  if !opts.licenses

		# Prepare
		licenses = []
		url = @getFileUrl(opts, 'LICENSE.md')

		# Handle
		for license in opts.licenses
			licenses.push "[#{license.type}](#{license.url})"

		# Concatenate
		licenses = licenses.join(' and ')

		# Return
		return """
			Licensed under the #{licenses} licenses, [for more details see the `LICENSE.md` file](#{url})
			"""

	# Get License Section
	getLicenseSection: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = ''
		result += """
			## License

			"""  if opts.header isnt false

		# Handle
		if opts.licenses.length is 1
			result += @getFunctionNamed.call(licenses, opts.licenes[0].type+'Section')
		else
			result += @getFunctionNamed.call(licenses, 'MultiSection')

		# Authors
		authors = @getAuthors(opts)
		result += '\n\n'+authors  if authors

		# Return
		return result

	# Get Licenses File
	getLicensesFile: (opts={}) ->
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
			fn = @getFunctionNamed.call(licenses, license.type+'License')
			result += '\n\n'+fn.call(@, opts)+'\n'

		# Return
		return result

# Export
modules.exports = licenses