<!-- TTITLE -->
<!-- BADGES -->
<!-- DESCRIPTION -->


## Usage

Projectz auto-generates the following parts of the following files:

- `package.json`
- `bower.json`
- `component.json`
- `jquery.json`
- `README.md`
	- Badges
		- Travis CI
		- Package Version
		- Gittip
		- Flattr
		- Paypal
	- Install
		- Node / Browserify
		- Ender
		- Bower
		- Component
	- History
	- Contributing
	- Backers
	- License
- `CONTRIBUTING.md`
- `LICENSE.md`
- `BACKERS.md`
	- Maintainers
	- Contributors
	- Sponsors
	- Participants

Values are determined from your `projectz.cson` file and your github repository.


## Spec

Here is the spec for the `projectz.cson` file:

``` coffee
{
	# Over-rides for the `package.json` file
	# Set to `false` to avoid touching
	# https://npmjs.org/doc/json.html
	package: {}

	# Over-rides for the `bower.json` file
	# Set to `false` to avoid touching
	# http://bower.io/#defining-a-package
	bower: {}

	# Over-rides for the `component.json` file
	# Set to `false` to avoid touching
	# https://github.com/component/component/wiki/Spec
	component: {}

	# Over-rides for the `jquery.json` file
	# Set to `false` to avoid touching
	# http://plugins.jquery.com/docs/package-manifest/
	jquery: {}
	
	# Customisations for the `README.md` file
	# Set to `false` to avoid touching
	readme:
		# Badges to add to the readme header
		badges:
			# Travis CI Badge
			# determined from repository
			travis: true
			
			# Version Badge by Fury.io
			# determined from name
			fury: true
			
			# Gittip Donate
			# determined from repository username
			gittip: true

			# Flattr Donate
			# not determined
			flattr: false
			
			# Paypal Donate
			# not determined
			paypal: false
	
	# Whether or not we should write to the `LICENSE.md` file
	# Set to `false` to avoid touching
	license: true

	# Whether or not we should write to the `BACKERS.md` file
	# Set to `false` to avoid touching
	backers: true

	# Whether or not we should write to the `CONTRIBUTING.md` file
	# Set to `false` to avoid touching
	contributing: true
}
```

[Here is an example `projectz.cson` file.](https://github.com/bevry/projectz/blob/master/test/src/projectz.cson)


<!-- INSTALL -->
<!-- HISTORY -->
<!-- CONTRIBUTE -->
<!-- BACKERS -->
<!-- LICENSE -->