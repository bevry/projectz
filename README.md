
<!-- TITLE/ -->
# Projectz
<!-- /TITLE -->
<!-- BADGES/ -->
[![Build Status](https://secure.travis-ci.org/bevry/projectz.png?branch=master)](http://travis-ci.org/bevry/projectz "Check this project's build status on TravisCI")
[![NPM version](https://badge.fury.io/js/projectz.png)](https://npmjs.org/package/projectz "View this project on NPM")
[![Gittip donate button](http://badgr.co/gittip/bevry.png)](https://www.gittip.com/bevry/ "Donate weekly to this project using Gittip")
[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
<!-- /BADGES -->
<!-- DESCRIPTION/ -->
Stop wasting time syncing and updating your project's README and Package Files!
<!-- /DESCRIPTION -->

<!-- INSTALL -->

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


<!-- HISTORY/ -->
## History
[You can discover the history inside the `History.md` file](https://github.com/bevry/projectz/blob/master/History.md#files)
<!-- /HISTORY -->

<!-- CONTRIBUTE/ -->
## Contributing
[You can discover the contributing instructions inside the `Contributing.md` file](https://github.com/bevry/projectz/blob/master/Contributing.md#files)
<!-- /CONTRIBUTE -->

<!-- BACKERS -->
<!-- LICENSE/ -->
## License

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<!-- /LICENSE -->

