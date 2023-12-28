<!-- TITLE/ -->

# Projectz

<!-- /TITLE -->

<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/projectz/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/projectz/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/v/projectz.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/projectz" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/projectz.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<br class="badge-separator" />
<span class="badge-discord"><a href="https://discord.gg/nQuXddV7VP" title="Join this project's community on Discord"><img src="https://img.shields.io/discord/1147436445783560193?logo=discord&amp;label=discord" alt="Discord server badge" /></a></span>
<span class="badge-twitch"><a href="https://www.twitch.tv/balupton" title="Join this project's community on Twitch"><img src="https://img.shields.io/twitch/status/balupton?logo=twitch" alt="Twitch community badge" /></a></span>

<!-- /BADGES -->

<!-- DESCRIPTION/ -->

Stop wasting time syncing and updating your project's README and Package Files!

<!-- /DESCRIPTION -->


This far, projectz is used directly by [802 repositories](https://github.com/bevry/projectz/network/dependents) and [348 packages](https://github.com/bevry/projectz/network/dependents?dependent_type=PACKAGE), and indirectly by [2936 repositories](https://libraries.io/npm/projectz/dependent-repositories) and [349 packages](https://libraries.io/npm/projectz/dependents).

[Watch the talk.](https://youtu.be/IAB8_UlcNWI)

Here's some of the things it can do:

-   [Keep your project's package files synchronised appropriately](https://github.com/bevry/projectz#data-files), supports:
    -   `package.json`
    -   `bower.json`
    -   `component.json`
    -   `jquery.json`
-   [Create beautiful standardised readme files that stay in sync with your package files](https://github.com/bevry/projectz#readme-files), supports:
    -   `README`
    -   `CONTRIBUTING`
    -   `LICENSE`
    -   `BACKERS`
    -   `HISTORY`
-   Automatic injection of the appropriate installation methods, supports:
    -   [npm](https://www.npmjs.com)
    -   [deno](https://deno.land)
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
npx projectz
```

### Automatically

To make projectz more automatic, we recommended adding the direct command above to your build tool.

If you don't use a build tool, but do use npm, then you can add the following to your project's `package.json` file:

```json
{
    "scripts": {
        "compile": "projectz",
        "posttest": "projectz"
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

### Package Files

Projectz helps you maintain the following package files:

-   `package.json`
-   `bower.json`
-   `component.json`
-   `jquery.json`

It does this by reading them, combining their data in memory, and then outputting the appropriate fields and over-rides for each file.

If you are making use of multiple package files, you may find defining a `projectz.json` package file will help, as it can serve as a central location for the configuration of all the other files. However, if you only require one package file, then you can ignore this ability.

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

[Complete API Documentation.](http://master.projectz.bevry.surge.sh/docs/)

    Usage instructions go here

    <!-- HISTORY -->
    <!-- CONTRIBUTE -->
    <!-- BACKERS -->
    <!-- LICENSE -->

This README is also, expectedly, built with projectz. [View its source.](https://raw.githubusercontent.com/bevry/projectz/master/README.md)

<!-- INSTALL/ -->

## Install

### [npm](https://npmjs.com "npm is a package manager for javascript")

#### Install Globally

-   Install: `npm install --global projectz`
-   Executable: `projectz`

#### Install Locally

-   Install: `npm install --save projectz`
-   Executable: `npx projectz`
-   Import: `import * as pkg from ('projectz')`
-   Require: `const pkg = require('projectz')`

### [Editions](https://editions.bevry.me "Editions are the best way to produce and consume packages you care about.")

This package is published with the following editions:
-   `projectz/source/index.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") source code with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `projectz` aliases `projectz/edition-es2022/index.js`
-   `projectz/edition-es2022/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 20 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `projectz/edition-es2022-esm/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 20 with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `projectz/edition-types/index.d.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled Types with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules

<!-- /INSTALL -->

<!-- HISTORY/ -->

## History

[Discover the release history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/projectz/blob/HEAD/HISTORY.md#files)

<!-- /HISTORY -->

<!-- BACKERS/ -->

## Backers

### Code

[Discover how to contribute via the `CONTRIBUTING.md` file.](https://github.com/bevry/projectz/blob/HEAD/CONTRIBUTING.md#files)

#### Authors

-   [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.

#### Maintainers

-   [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.

#### Contributors

-   [Benjamin Lupton](https://github.com/balupton) — [view contributions](https://github.com/bevry/projectz/commits?author=balupton "View the GitHub contributions of Benjamin Lupton on repository bevry/projectz")
-   [James George](https://github.com/jamesgeorge007) — [view contributions](https://github.com/bevry/projectz/commits?author=jamesgeorge007 "View the GitHub contributions of James George on repository bevry/projectz")
-   [Oliver Lorenz](https://github.com/oliverlorenz) — [view contributions](https://github.com/bevry/projectz/commits?author=oliverlorenz "View the GitHub contributions of Oliver Lorenz on repository bevry/projectz")
-   [Peter C](https://github.com/peterkc) — [view contributions](https://github.com/bevry/projectz/commits?author=peterkc "View the GitHub contributions of Peter C on repository bevry/projectz")
-   [Peter Flannery](https://github.com/pflannery) — [view contributions](https://github.com/bevry/projectz/commits?author=pflannery "View the GitHub contributions of Peter Flannery on repository bevry/projectz")
-   [Rob Loach](https://github.com/RobLoach) — [view contributions](https://github.com/bevry/projectz/commits?author=RobLoach "View the GitHub contributions of Rob Loach on repository bevry/projectz")
-   [Shahar "Dawn" Or](https://github.com/mightyiam) — [view contributions](https://github.com/bevry/projectz/commits?author=mightyiam "View the GitHub contributions of Shahar &quot;Dawn&quot; Or on repository bevry/projectz")
-   [vsopvsop](https://github.com/vsopvsop) — [view contributions](https://github.com/bevry/projectz/commits?author=vsopvsop "View the GitHub contributions of vsopvsop on repository bevry/projectz")
-   [Zearin](https://github.com/Zearin) — [view contributions](https://github.com/bevry/projectz/commits?author=Zearin "View the GitHub contributions of Zearin on repository bevry/projectz")
-   [Zlatan Vasović](https://github.com/zlatanvasovic) — [view contributions](https://github.com/bevry/projectz/commits?author=zlatanvasovic "View the GitHub contributions of Zlatan Vasović on repository bevry/projectz")

### Finances

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

#### Sponsors

-   [Andrew Nesbitt](https://nesbitt.io) — Software engineer and researcher
-   [Balsa](https://balsa.com) — We're Balsa, and we're building tools for builders.
-   [Codecov](https://codecov.io) — Empower developers with tools to improve code quality and testing.
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io) — Real-time crash reporting for your web apps, mobile apps, and games.
-   [Syntax](https://syntax.fm) — Syntax Podcast

#### Donors

-   [Andrew Nesbitt](https://nesbitt.io)
-   [Armen Mkrtchian](https://mogoni.dev)
-   [Balsa](https://balsa.com)
-   [Chad](https://opencollective.com/chad8)
-   [Codecov](https://codecov.io)
-   [dr.dimitru](https://veliovgroup.com)
-   [Elliott Ditman](https://elliottditman.com)
-   [entroniq](https://gitlab.com/entroniq)
-   [GitHub](https://github.com/about)
-   [Hunter Beast](https://cryptoquick.com)
-   [Jean-Luc Geering](https://github.com/jlgeering)
-   [Michael Duane Mooring](https://mdm.cc)
-   [Michael Harry Scepaniak](https://michaelscepaniak.com)
-   [Mohammed Shah](https://github.com/smashah)
-   [Mr. Henry](https://mrhenry.be)
-   [Nermal](https://arjunaditya.vercel.app)
-   [Pleo](https://www.pleo.io)
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Robert de Forest](https://github.com/rdeforest)
-   [Sentry](https://sentry.io)
-   [ServieJS](https://github.com/serviejs)
-   [Skunk Team](https://skunk.team)
-   [Syntax](https://syntax.fm)
-   [WriterJohnBuck](https://github.com/WriterJohnBuck)

<!-- /BACKERS -->

<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

-   Copyright &copy; [Benjamin Lupton](https://balupton.com)

and licensed under:

-   [Artistic License 2.0](http://spdx.org/licenses/Artistic-2.0.html)

<!-- /LICENSE -->
