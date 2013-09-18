# Projectz

[![Build Status](https://secure.travis-ci.org/bevry/projectz.png?branch=master)](http://travis-ci.org/bevry/projectz "Check this project's build status on TravisCI")
[![NPM version](https://badge.fury.io/js/projectz.png)](https://npmjs.org/package/projectz "View this project on NPM")
[![Gittip donate button](http://badgr.co/gittip/bevry.png)](https://www.gittip.com/bevry/ "Donate weekly to this project using Gittip")
[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")

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

Values are determined from your `package.json` file and your github repository.


## `package.json` spec
The spec is the same as [npm `package.json` spec](https://npmjs.org/doc/json.html) with the following additions:

``` coffee
{
	# Badges to add to the readme header
	badges:
		# Travis CI Badge
		# determined from package.json repository
		travis: true
		
		# Version Badge by Fury.io
		# determined from package.json name
		fury: true
		
		# Gittip Donate
		# determined from package.json repository username
		gittip: true

		# Flattr Donate
		# not determined
		flattr: false
		
		# Paypal Donate
		# not determined
		paypal: false
	
	# Bower
	# determined from package.json values
	# can also be an object to over-ride determined values
	bower: true

	# Component
	# determined from package.json values
	# can also be an object to over-ride determined values
	
	# Whether or not we should keep these files updated
	projectzFiles:
		readme: true
		license: true
		backers: true
		contributing: true
		package: true
		bower: true
		component: true
		jquery: true
}
```


## History
[You can discover the history inside the `History.md` file](https://github.com/bevry/projectz/blob/master/History.md#files)


## Contributing
[You can discover the contributing instructions inside the `Contributing.md` file](https://github.com/bevry/projectz/blob/master/Contributing.md#files)


## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright &copy; 2013+ [Bevry Pty Ltd](http://bevry.me) <us@bevry.me>
