
<!-- TITLE/ -->

# Projectz

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](http://img.shields.io/travis-ci/bevry/projectz.png?branch=master)](http://travis-ci.org/bevry/projectz "Check this project's build status on TravisCI")
[![NPM version](https://badge.fury.io/js/projectz.png)](https://npmjs.org/package/projectz "View this project on NPM")
[![Gittip donate button](http://img.shields.io/gittip/true.png)](https://www.gittip.com/true/ "Donate weekly to this project using Gittip")
[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Stop wasting time syncing and updating your project's README and Package Files!

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [Node](http://nodejs.org/), [Browserify](http://browserify.org/)
- Use: `require('projectz')`
- Install: `npm install --save projectz`

### [Ender](http://ender.jit.su/)
- Use: `require('projectz')`
- Install: `ender add projectz`

<!-- /INSTALL -->


## Todo

The following is still left to do before we publish v1.0.0:

- Only output `CONTRIBUTE` block if `CONTRIBUTING.md` exists
- Only output `HISTORY` block if `HISTORY.md` exists
- Provide documentation for data overrides
- Provide documentation for readme overrides
- Tests


## Usage

### Data Files
Projectz helps you maintain the following data files:

- `package.json`
- `bower.json`
- `component.json`
- `jquery.json`

It does this by reading them, combining their data in memory, and then outputting the appropriate fields and over-rides for each file.

Each file can serve as the master meta data file, however you can also define a `projectz.cson` [CSON](https://github.com/bevry/cson) file that you can use if you'd like to have the benefit of comments, optional commas, multiline strings, etc for your primary meta data file.

The special fields are as so:

``` coffee
{	
	# Project's human readable name
	title: "Projectz" 

	# Project slug name
	name: "projectz"

	# Project GitHub repository full name
	# If `repository` is set, or if `homepage` is a GitHub URL, we set this automatically
	repo: "bevry/projectz"

	# Project's homepage URL
	# If `repo`, `repository`, or `demo` is set, we set this automatically
	homepage: "https://github.com/bevry/projectz"
	
	# Project's demo URL
	# If `homepage` or  is set, we set this automatically
	demo: "https://github.com/bevry/projectz"
	
	# Project description
	description: "Stop wasting time syncing and updating your project's README and Package Files!"
	
	# Project keywords
	# Can be an array or CSV string
	keywords: "a, b, c"

	# Project's author details
	# Can be an array or CSV string
	authors: ["2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)"]
	author: null

	# Maintainers
	# Can be an array or CSV string
	maintainers: ["Benjamin Lupton (b@lupton.cc) (http://bevry.me)"]
	maintainer: null

	# Sponsors
	# Can be an array or CSV string
	sponsors: ["Benjamin Lupton (b@lupton.cc) (http://bevry.me)"]

	# Contributors
	# Pulled in automatically from the GitHub Repository API and the GitHub Repository's `package.json` file
	contributors: null

	# Project's license details
	# Can be an array or CSV string
	license: "MIT"  # {type:"MIT", url:"http://..."}
	licenses: null
	
	# Project's repository details
	# If `repo` is set, or if `homepage` is a GitHub URL, we set this automatically
	repository:
		type: "git"
		url: "https://github.com/bevry/projectz.git"
	
	# Project's repository details
	# If `repo` is set, or if `homepage` is a GitHub URL, we set this automatically
	bugs:
		url: "https://github.com/bevry/projectz/issues"
	
	# Project's badges for use in the readme files
	badges:
		travis: true
		npm: true
		gittip: true
		flattr: "344188/balupton-on-Flattr"
		paypal: "QB8GQPZAH84N6"

}
```


### Readme Files
Projectz helps you maintain the following readme files:

- `README.md`
- `CONTRIBUTING.md`
- `LICENSE.md`
- `BACKERS.md`
- `HISTORY.md`

It does this by reading them, and replacing comment tags with the approriate data.

The following comment tags are supported:

- `<!-- TITLE -->`
- `<!-- BADGES -->`
- `<!-- DESCRIPTION -->`
- `<!-- INSTALL -->`
- `<!-- HISTORY -->`
- `<!-- CONTRIBUTE -->`
- `<!-- BACKERS -->`
- `<!-- LICENSE -->`

As well as these comment tags for updating entire files:
- `<!-- LICENSEFILE -->`
- `<!-- BACKERSFILE -->`

As an example, here is a a basic `README.md` file:

	<!-- TITLE -->
	<!-- BADGES -->
	<!-- DESCRIPTION -->
	<!-- INSTALL -->
	## Usage
	Usage instructions go here
	<!-- HISTORY -->
	<!-- CONTRIBUTE -->
	<!-- BACKERS -->
	<!-- LICENSE -->


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `History.md` file.](https://github.com/bevry/projectz/blob/master/History.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `Contributing.md` file.](https://github.com/bevry/projectz/blob/master/Contributing.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton (b@lupton.cc) (http://bevry.me)

### Sponsors

These amazing people have contributed finances to this project:

- Benjamin Lupton (b@lupton.cc) (http://bevry.me)

Become a sponsor!

[![Gittip donate button](http://img.shields.io/gittip/true.png)](https://www.gittip.com/true/ "Donate weekly to this project using Gittip")
[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")

### Contributors

These amazing people have contributed code to this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton) - [view contributions](https://github.com/bevry/projectz/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/projectz/blob/master/Contributing.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

<!-- /LICENSE -->


