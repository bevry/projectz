<!-- TITLE/ -->

<h1>Projectz</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry/projectz" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry/projectz/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/v/projectz.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/projectz.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/projectz" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/projectz.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/projectz#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/projectz.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-slackin"><a href="https://slack.bevry.me" title="Join this project's slack community"><img src="https://slack.bevry.me/badge.svg" alt="Slack community badge" /></a></span>
<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Stop wasting time syncing and updating your project's README and Package Files!

<!-- /DESCRIPTION -->


Here's some of the things it can do:

- Keep your projects data files synchronised appropriately, supports:
	- `package.json`
	- `bower.json`
	- `component.json`
	- `jquery.json`
- Create beautiful standardised readme files that stay in sync with your data files, supports:
	- `README`
	- `CONTRIBUTING`
	- `LICENSE`
	- `BACKERS`
	- `HISTORY`
- Automatic injection of the appropriate installation methods, supports:
	- [NPM](https://www.npmjs.com)
	- [Browserify](http://browserify.org/)
	- [Ender](http://enderjs.com)
	- [Component](http://github.com/component/component)
	- [Bower](http://bower.io/)
	- [Editions](https://github.com/bevry/editions)
	- [DocPad](https://docpad.org) Plugins
- Automatic injection of your desired [badges](https://github.com/bevry/badges)
- Automatic injection of your [SPDX](http://spdx.org/licenses/) license information
- Keep your data and readme files up to date with remote data, supports:
	- Pulling in your latest contributors from GitHub
	- Pulling in your latest sponsors from remote APIs (coming soon)


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --global projectz</code></li>
<li>Executable: <code>projectz</code></li></ul>

<h3><a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>projectz</code> aliases <code>projectz/index.js</code> which uses <a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a> to automatically select the correct edition for the consumers environment</li>
<li><code>projectz/source/index.js</code> is Source + <a href="https://babeljs.io/docs/learn-es2015/" title="ECMAScript Next">ESNext</a> + <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> + <a href="http://flowtype.org/blog/2015/02/20/Flow-Comments.html" title="Flow is a static type checker for JavaScript">Flow Type Comments</a></li>
<li><code>projectz/es2015/index.js</code> is <a href="https://babeljs.io" title="The compiler for writing next generation JavaScript">Babel</a> Compiled + <a href="http://babeljs.io/docs/plugins/preset-es2015/" title="ECMAScript 2015">ES2015</a> + <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a></li></ul>

<p>Older environments may need <a href="https://babeljs.io/docs/usage/polyfill/" title="A polyfill that emulates missing ECMAScript environment features">Babel's Polyfill</a> or something similar.</p>

<!-- /INSTALL -->


## Running Projectz

### Directly

Once installed locally, you can compile your project using projectz by running the following in your terminal:

``` shell
node ./node_modules/.bin/projectz compile
```


### Automatically

To make projectz more automatic, we recommended adding the direct command above to your build tool.

If you don't use a build tool, but do use npm, then you can add the following to your project's `package.json` file:

```
{
  "scripts": {
    "compile": "projectz compile",
    "posttest": "npm run compile"
  }
}
```

The `compile` script here is runnable via the command `npm run-script compile` and will compile your project with projectz.

The `posttest` script here automatically compiles your project with projectz after your tests have successfully completed, providing you use `npm test` to run your tests. This is a great place to put projectz as projectz only updates meta documents so won't affect your test, and will always run before a publish.



## Configuring Projectz

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
	title: "Projectz",

	# Project name
	name: "projectz",

	# Project's Website URL
	homepage: "https://github.com/bevry/projectz",

	# Project's demo URL
	# If this is missing, and `homepage` is set, we set it to the `homepage` value
	demo: "https://github.com/bevry/projectz",

	# Project description
	description: "Stop wasting time syncing and updating your project's README and Package Files!",

	# Project's SPDX License
	# Uses https://www.npmjs.com/packages/spdx for parsing
	license: "MIT",

	# Whether the project can run on the client-side in web browsers
	# If this is missing, and the component or bower package files exist, then this becomes `true`
	browsers: true,

	# Project's author details
	# Can be an array or CSV string
	author: "2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)",

	# Maintainers
	maintainers: [
		"Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
	],

	# Sponsors
	sponsors: [
		"Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
	],

	# Contributors
	# Automatically combined with the contributors from the GitHub Repository API
	contributors: [
		"Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
	],

	# Project's repository details
	# If this is missing, and `homepage` is a GitHub URL, this determined automatically
	repository: {
		type: "git",
		url: "https://github.com/bevry/projectz.git"
	},

	# Project's issue tracker
	# If this is missing, and `repository` is a GitHub repository, this determined automatically
	bugs: {
		url: "https://github.com/bevry/projectz/issues"
	},

	# Project's badges for use in the readme files
	# Uses https://www.npmjs.com/packages/badges for parsing and rendering, see for usage
	badges: {
		list: []
		config: {}
	}
}
```


### Readme Files
Projectz helps you maintain the following readme files:

- `README.md`
- `CONTRIBUTING.md`
- `LICENSE.md`
- `BACKERS.md`
- `HISTORY.md`

It does this by reading them, and replacing comment tags with the appropriate data.

The following comment tags are supported:

- `<!-- TITLE -->` — outputs the package's `title` field
- `<!-- BADGES -->` — outputs the badges you have enabled from your package's `badges` field
- `<!-- DESCRIPTION -->` — outputs the package's `description` field
- `<!-- INSTALL -->` — outputs the package's installation instructions
- `<!-- HISTORY -->` — outputs a link to the `HISTORY` file if it exists, otherwise if it is a Github repository, outputs a link to the releases page
- `<!-- CONTRIBUTE -->` — outputs a link to the `CONTRIBUTE` file if it exists
- `<!-- BACKERS -->` — outputs the information from the `sponsors` field, as well as any funding badges
- `<!-- LICENSE -->` — outputs a summary of the license information

As well as these comment tags for updating entire files:

- `<!-- LICENSEFILE -->` — outputs the complete license information
- `<!-- BACKERSFILE -->` — same as `<!-- BACKERS -->` but made for an individual file instead

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

<h2>History</h2>

<a href="https://github.com/bevry/projectz/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/projectz/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a></li>
<li><a href="http://robloach.net">Rob Loach</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a></li>
<li><a href="https://github.com/pflannery">Peter Flannery</a> — <a href="https://github.com/bevry/projectz/commits?author=pflannery" title="View the GitHub contributions of Peter Flannery on repository bevry/projectz">view contributions</a></li>
<li><a href="http://robloach.net">Rob Loach</a></li>
<li><a href="https://github.com/Zearin">Zearin</a> — <a href="https://github.com/bevry/projectz/commits?author=Zearin" title="View the GitHub contributions of Zearin on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/vsopvsop">vsopvsop</a> — <a href="https://github.com/bevry/projectz/commits?author=vsopvsop" title="View the GitHub contributions of vsopvsop on repository bevry/projectz">view contributions</a></li>
<li><a href="http://mightyi.am">Shahar Or</a></li></ul>

<a href="https://github.com/bevry/projectz/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2013+ <a href="http://bevry.me">Bevry Pty Ltd</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
