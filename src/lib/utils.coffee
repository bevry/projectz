# Utils
utils =
	# Get File URL
	getFileUrl: (opts, file) ->
		return "https://github.com/#{opts.username}/#{opts.name}/blob/master/#{file}#files"

	# Get Function Named
	# e.g. {getMitLicense,getLicenses} with 'mit' returns getMitLicense
	getFunctionNamed: (str) ->
		# Prepare
		str = str.toLowerCase()

		# Find
		for own name,fn of @
			if name.substr(3).substr(str.length*-1).toLowerCase() is str
				return fn

		# Return
		return null

	# Get Functions Ending With
	# e.g. {getNpmBadge,getBadges} with 'Badge' returns [getNpmBadge]
	getFunctionsEndingWith: (str) ->
		# Prepare
		fns = []

		# Find
		for own name,fn of @
			if name.substr(str.length*-1) is str
				fns.push(fn)

		# Return
		return fns

# Export
module.exports = utils