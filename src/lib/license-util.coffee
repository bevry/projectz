# Import
projectzUtil = require('./projectz-util')

# -------------------------------------
# Variables

licenses =
	'cc-by-4.0':
		title: 'Creative Commons Attribution 4.0 International License'
		url: 'http://creativecommons.org/licenses/by/4.0/'
		body: 'See http://creativecommons.org/licenses/by/4.0/ for full legal text.'

	'mit':
		title: 'MIT License'
		category: 'permissive'
		url: 'http://opensource.org/licenses/mit-license.php'
		body: """
			Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
			"""

categories =
	permissive:
		description: 'incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence)'


# -------------------------------------
# Define

module.exports = licenseUtil =
	getAuthorText: (author={}) ->
		return """
			Copyright &copy; #{projectzUtil.getPersonText(author)}
			"""

	getAuthors: (opts) ->
		result = ''

		if opts.authors.length isnt 0
			result += '- '+(
				for author in opts.authors
					entry = licenseUtil.getAuthorText(author)
			).join('\n- ')

		return result

	# Get Descriptions for Licenses
	getDescriptionsForLicenses: (opts) ->
		result = ''

		if opts.licenses.length isnt 0
			result += '- '+(
				for license in opts.licenses
					entry = ''
					{type, scope} = license
					type = type.toLowerCase()
					if licenses[type]
						entry += 'The'
						{title, url, category} = licenses[type]
						categoryDescription = categories[category]?.description
						entry += ' '+categoryDescription  if categoryDescription
						entry += ' ['+title+']('+url+')'
						entry += ' for '+scope  if scope
					else
						entry += 'The #{type} License'
					entry
			).join('\n- ')

		return result

	# Get Bodies for Licenses
	getBodiesForLicenses: (opts) ->
		result = ''

		if opts.licenses.length isnt 0
			result += (
				for license in opts.licenses
					entry = ''
					{type, scope} = license
					type = type.toLowerCase()
					if licenses[type]
						entry += 'The'
						{title, body} = licenses[type]
						entry = '## '+title+'\n'+body
					else
						entry += '## The #{type} License\nMore information possibly available through the the [Open Source Initiative License Listing](http://opensource.org/licenses/alphabetical)'
						# @TODO build a comprhensive listing from https://spdx.org/licenses/ and http://opensource.org/licenses
			).join('\n\n')

		return result

	# Get License Introduction
	getLicenseIntroduction: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = """
			Unless stated otherwise all works are:

			#{licenseUtil.getAuthors(opts)}

			and licensed under:

			#{licenseUtil.getDescriptionsForLicenses(opts)}
			"""

		# Return
		return result


	# Get License Section
	getLicenseSection: (opts={}) ->
		# Check
		return '' if !opts.licenses

		# Prepare
		result = """
			## License

			#{licenseUtil.getLicenseIntroduction(opts)}
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

			#{licenseUtil.getLicenseIntroduction(opts)}

			#{licenseUtil.getBodiesForLicenses(opts)}
			"""

		# Return
		return result
