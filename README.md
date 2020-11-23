<!-- TITLE/ -->

<h1>Projectz</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/v/projectz.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/projectz.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/projectz" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/projectz.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/projectz#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/projectz.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Stop wasting time syncing and updating your project's README and Package Files!

<!-- /DESCRIPTION -->


This far, projectz is used directly by [802 repositories](https://github.com/bevry/projectz/network/dependents) and [348 packages](https://github.com/bevry/projectz/network/dependents?dependent_type=PACKAGE), and indirectly by [2936 repositories](https://libraries.io/npm/projectz/dependent-repositories) and [349 packages](https://libraries.io/npm/projectz/dependents).

[Watch the talk.](https://youtu.be/IAB8_UlcNWI)

Here's some of the things it can do:

-   [Keep your projects data files synchronised appropriately](https://github.com/bevry/projectz#data-files), supports:
    -   `package.json`
    -   `bower.json`
    -   `component.json`
    -   `jquery.json`
-   [Create beautiful standardised readme files that stay in sync with your data files](https://github.com/bevry/projectz#readme-files), supports:
    -   `README`
    -   `CONTRIBUTING`
    -   `LICENSE`
    -   `BACKERS`
    -   `HISTORY`
-   Automatic injection of the appropriate installation methods, supports:
    -   [npm](https://www.npmjs.com)
    -   [jspm](http://jspm.io)
    -   [Component](http://github.com/component/component)
    -   [Bower](http://bower.io/)
    -   [Editions](https://github.com/bevry/editions)
    -   [DocPad](https://docpad.org) Plugins
-   Automatic injection of your desired [badges](https://github.com/bevry/badges)
-   Automatic injection of your [SPDX](http://spdx.org/licenses/) license information
-   Keep your data and readme files up to date with remote data, supports:
    -   Pulling in your latest contributors from GitHub
    -   Pulling in your latest sponsors from remote APIs ([coming soon](https://github.com/bevry/projectz/issues/80))

## Running Projectz

### Directly

Once installed locally, you can compile your project using projectz by running the following in your terminal:

```shell
npx projectz compile
```

### Automatically

To make projectz more automatic, we recommended adding the direct command above to your build tool.

If you don't use a build tool, but do use npm, then you can add the following to your project's `package.json` file:

```json
{
    "scripts": {
        "compile": "projectz compile",
        "posttest": "npm run compile"
    }
}
```

The `compile` script here is runnable via the command `npm run-script compile` and will compile your project with projectz.

The `posttest` script here automatically compiles your project with projectz after your tests have successfully completed, providing you use `npm test` to run your tests. This is a great place to put projectz as projectz only updates meta documents so won't affect your test, and will always run before a publish.

### GitHub Rate Limiting

If you get a rate limit warning, you will need to add `GITHUB_ACCESS_TOKEN` (or a `GITHUB_CLIENT_ID` AND `GITHUB_CLIENT_SECRET` combination) to your environment. To do this:

1. Create a personal access token for your computer at: https://github.com/settings/tokens
2. Projectz needs the readonly/access permissions for repos and users
3. Generate the token and copy it
4. Inside your dotfile profile (`.bashrc`, `.zshrc`) add `export GITHUB_ACCESS_TOKEN="the token value"`
5. Open a new shell, or run `export GITHUB_ACCESS_TOKEN="the token value"` in your current shell
6. Run projectz again

## Configuring Projectz

### Data Files

Projectz helps you maintain the following data files:

-   `package.json`
-   `bower.json`
-   `component.json`
-   `jquery.json`

It does this by reading them, combining their data in memory, and then outputting the appropriate fields and over-rides for each file.

If you are making use of multiple meta data files, you may find defining a projectz meta file (`projectz.json` for JSON, or `projectz.cson` for [CSON](https://github.com/bevry/cson)) to be useful. The projectz meta file can serve as a central location for the configuration of all the other files. However, if you only require one meta data file, then you can ignore this ability.

Projectz takes notes of these meta data fields:

```javascript
{
    // Specify your project's human readable name
    "title": "Projectz",

    // Specify your project name
    "name": "projectz",

    // Specify your project's Website URL
    "homepage": "https://github.com/bevry/projectz",

    // Specify your project's demo URL
    // If this is missing, and `homepage` is set, we set it to the `homepage` value
    "demo": "https://github.com/bevry/projectz",

    // Specify your project description
    "description": "Stop wasting time syncing and updating your project's README and Package Files!",

    // Specify your project's SPDX License
    // Uses https://www.npmjs.com/packages/spdx for parsing
    "license": "MIT",

    // Specify your whether the project can run on the client-side in web browsers
    // If this is missing, and the component or bower package files exist, then this becomes `true`
    "browsers": true,

    // Specify your project's author details
    // Can be an array or CSV string
    "author": "2013+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)",

    // Specify your maintainers
    "maintainers": [
        "Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
    ],

    // Specify your sponsors
    "sponsors": [
        "Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
    ],

    // Specify your contributors
    // This is automatically combined with the contributors from the GitHub Repository API
    "contributors": [
        "Benjamin Lupton (b@lupton.cc) (http://balupton.com)"
    ],

    // Specify your project's repository details
    // If this is missing, and `homepage` is a GitHub URL, this determined automatically
    "repository": {
        "type": "git",
        "url": "https://github.com/bevry/projectz.git"
    },

    // Specify your project's issue tracker
    // If this is missing, and `repository` is a GitHub repository, this determined automatically
    "bugs": {
        "url": "https://github.com/bevry/projectz/issues"
    },

    // Specify your project's badges for use in the readme files
    // Projectz renders badges by sending the `badges` field to the `badges` package.
    // Below is some sample projectz configuration for this field to render our most common badges.
    // Even more badge types and configurations are available than just those included below.
    // Complete details of what is available can be found over at the badges package:
    // https://github.com/bevry/badges
    "badges": {
        "list": [
            "travisci",
            "npmversion",
            "npmdownloads",
            "daviddm",
            "daviddmdev",
            "---",
            "slackin",
            "patreon",
            "gratipay",
            "flattr",
            "paypal",
            "bitcoin",
            "wishlist"
        ],
        "config": {
            "patreonUsername": "bevry",
            "gratipayUsername": "bevry",
            "flattrUsername": "balupton",
            "paypalURL": "https://bevry.me/paypal",
            "bitcoinURL": "https://bevry.me/bitcoin",
            "wishlistURL": "https://bevry.me/wishlist",
            "slackinURL": "https://slack.bevry.me"
        }
    },

  // If you are using the projectz meta file, you can also define this field
  // it allows you to set the configuration for other package systems
  "packages": {
    "bower": {},
    "component": {},
    "jquery": {}
  }
}
```

### Readme Files

Projectz helps you maintain the following readme files:

-   `README.md`
-   `CONTRIBUTING.md`
-   `LICENSE.md`
-   `BACKERS.md`
-   `HISTORY.md`

It does this by reading them, and replacing comment tags with the appropriate data.

The following comment tags are supported:

-   `<!-- TITLE -->` — outputs the package's `title` field
-   `<!-- BADGES -->` — outputs the badges you have enabled from your package's `badges` field
-   `<!-- DESCRIPTION -->` — outputs the package's `description` field
-   `<!-- INSTALL -->` — outputs the package's installation instructions
-   `<!-- HISTORY -->` — outputs a link to the `HISTORY` file if it exists, otherwise if it is a Github repository, outputs a link to the releases page
-   `<!-- CONTRIBUTE -->` — outputs a link to the `CONTRIBUTE` file if it exists
-   `<!-- BACKERS -->` — outputs who the backers are for the project, including maintainers, sponsors, funding badges, and contributors
-   `<!-- LICENSE -->` — outputs a summary of the license information

As well as these comment tags for updating entire files:

-   `<!-- LICENSEFILE -->` — outputs the complete license information
-   `<!-- BACKERSFILE -->` — same as `<!-- BACKERS -->` but made for an individual file instead

As an example, here is a a basic `README.md` file:

    <!-- TITLE -->
    <!-- BADGES -->
    <!-- DESCRIPTION -->
    <!-- INSTALL -->

    ## Usage

[Complete API Documentation.](http://master.projectz.bevry.surge.sh/docs/globals.html)

    Usage instructions go here

    <!-- HISTORY -->
    <!-- CONTRIBUTE -->
    <!-- BACKERS -->
    <!-- LICENSE -->

This README is also, expectedly, built with projectz. [View its source.](https://raw.githubusercontent.com/bevry/projectz/master/README.md)

<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<h4>Install Globally</h4>
<ul>
<li>Install: <code>npm install --global projectz</code></li>
<li>Executable: <code>projectz</code></li>
</ul>
<h4>Install Locally</h4>
<ul>
<li>Install: <code>npm install --save projectz</code></li>
<li>Executable: <code>npx projectz</code></li>
<li>Import: <code>import * as pkg from ('projectz')</code></li>
<li>Require: <code>const pkg = require('projectz')</code></li>
</ul>

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>projectz/source/index.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> source code with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>projectz</code> aliases <code>projectz/edition-es2019/index.js</code></li>
<li><code>projectz/edition-es2019/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>projectz/edition-es2019-esm/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li></ul>

<!-- /INSTALL -->


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

<ul><li><a href="https://github.com/balupton">Benjamin Lupton</a> — <a href="https://github.com/bevry/projectz/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/jamesgeorge007">James George</a> — <a href="https://github.com/bevry/projectz/commits?author=jamesgeorge007" title="View the GitHub contributions of James George on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/RobLoach">Rob Loach</a> — <a href="https://github.com/bevry/projectz/commits?author=RobLoach" title="View the GitHub contributions of Rob Loach on repository bevry/projectz">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://github.com/balupton">Benjamin Lupton</a> — <a href="https://github.com/bevry/projectz/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/jamesgeorge007">James George</a> — <a href="https://github.com/bevry/projectz/commits?author=jamesgeorge007" title="View the GitHub contributions of James George on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/oliverlorenz">Oliver Lorenz</a> — <a href="https://github.com/bevry/projectz/commits?author=oliverlorenz" title="View the GitHub contributions of Oliver Lorenz on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/peterkc">Peter C</a> — <a href="https://github.com/bevry/projectz/commits?author=peterkc" title="View the GitHub contributions of Peter C on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/pflannery">Peter Flannery</a> — <a href="https://github.com/bevry/projectz/commits?author=pflannery" title="View the GitHub contributions of Peter Flannery on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/RobLoach">Rob Loach</a> — <a href="https://github.com/bevry/projectz/commits?author=RobLoach" title="View the GitHub contributions of Rob Loach on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/mightyiam">Shahar Dawn Or</a> — <a href="https://github.com/bevry/projectz/commits?author=mightyiam" title="View the GitHub contributions of Shahar Dawn Or on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/Zearin">Zearin</a> — <a href="https://github.com/bevry/projectz/commits?author=Zearin" title="View the GitHub contributions of Zearin on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/zlatanvasovic">Zlatan Vasović</a> — <a href="https://github.com/bevry/projectz/commits?author=zlatanvasovic" title="View the GitHub contributions of Zlatan Vasović on repository bevry/projectz">view contributions</a></li>
<li><a href="https://github.com/vsopvsop">vsopvsop</a> — <a href="https://github.com/bevry/projectz/commits?author=vsopvsop" title="View the GitHub contributions of vsopvsop on repository bevry/projectz">view contributions</a></li></ul>

<a href="https://github.com/bevry/projectz/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2013+ <a href="http://bevry.me">Bevry Pty Ltd</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
