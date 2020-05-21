# History

## v2.3.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.2.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.1.0 2020 May 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.0.0 2020 May 8

-   Converted from JavaScript to TypeScript
-   `-p <value>` cli arg is now `--path=<value>`
-   `-d` cli arg is now `--verbose`
-   Contributors are no longer fetched from github, if you want that functionality, use [@bevry/update-contributors](https://github.com/bevry/update-contributors)
    -   If this is an issue, file an issue with a small bounty and it can be re-added
    -   This was done, as
        -   now projectz is purely reading, merging, and rendering of local files
        -   fetching contributors requires [github authorisation env variables](https://github.com/bevry/githubauthreq) to be provided
-   Contributors and Maintainers will now have their github URL used instead of their homepage in the json listings
-   No more duplicate contributors and maintainers
-   No more bots listed as contributors and maintainers
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=14` as projectz's tests have issues with supporting all but the latest LTS

## v1.19.1 2020 April 21

-   Fix crash when trying to generate install instructions for an edition that lacks an entry
    -   This can happen in the case of editioned websites, which only specify `directory: '.'`

## v1.19.0 2019 December 18

-   Ignore contributors that are bots (identified by `[bot]` in their name)

## v1.18.0 2019 December 18

-   Removed browser edition entry from unkpkg URL as it is not necessary
-   Added links for Node.js, the Editions Autoloader, and ECMAScript versions
-   Babel Polyfill section is removed as modern ecosystem doesn't need it

## v1.17.1 2019 December 18

-   Fixed v1.17.0 busting edition names

## v1.17.0 2019 December 18

-   Install instructions adjust accordingly depending on if there is a default export or not (detected by presence of the `export-default` keyword)
-   Add install instructions for pika and unpkg if the project is a module
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.16.0 2019 December 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.15.0 2019 December 6

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.14.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.13.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.12.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.11.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.10.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.9.0 2019 November 11

-   Implemented support for `GITHUB_API` environment variable to access the GitHub API via a proxy

## v1.8.0 2019 November 11

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.7.5 2019 September 11

-   Show help if no arguments were supplied
    -   Thanks to [James George](https://github.com/jamesgeorge007) for [pull request #94](https://github.com/bevry/projectz/pull/94)
-   Updated dependencies
    -   Update SPDX dependency
        -   Thanks to [Peter Chanthamynavong](https://github.com/peterkc) for [pull request #95](https://github.com/bevry/projectz/pull/95)
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.7.4 2018 December 22

-   Prevent `pacakge-lock.json` from being read
-   Switched from `CSON` to `season`, as CSON doesn't handle sync errors, and no one has maintained it

## v1.7.3 2018 December 19

-   Internal documentation updates

## v1.7.2 2018 December 19

-   Moved npm require instructions after the command instructions for consistency

## v1.7.1 2018 December 19

-   Fixed an eyesore with the jspm installation instructions
-   Only output TypeScript blurb on modules

## v1.7.0 2018 December 19

-   Updated installation instructions for latest ecosystem changes

## v1.6.0 2018 December 19

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v1.5.3 2018 November 15

-   Note that contributors may also fail to fetch if the internet is disconnected.

## v1.5.2 2018 November 15

-   Update [githubauthquerystring](https://github.com/bevry/githubauthquerystring) to v1 and make use of its redaction abilities

## v1.5.1 2018 November 15

-   Fixed failures in fetching contributors causing projectz to crash
-   Now uses [githubauthquerystring](https://github.com/bevry/githubauthquerystring) to generate the GitHub Auth Query Strings.

## v1.5.0 2018 November 15

-   Removed compiled editions as they are no longer needed with modern node versions
-   Updated editions format for [editions](https://github.com/bevry/editions) v2.1.0
-   Updated [base files](https://github.com/bevry/base) using [boundation](https://github.com/bevry/boundation)
-   Updated for latest dependencies

## v1.4.0 2017 April 10

-   Updated base files
-   Updated dependencies

## v1.3.2 2016 October 24

-   Load the fellow edition that corresponds with the projectz edition

## v1.3.1 2016 October 23

-   Update dependencies

## v1.3.0 2016 October 19

-   Add new support for the newer editions standard while keeping support for the old standard

## v1.2.0 2016 September 19

-   Add support for `repository` field being github repo shortname, and prefer it - Thanks to [Zlatan Vasović](https://github.com/zdroid) for [pull request #83](https://github.com/bevry/projectz/pull/83)

## v1.1.6 2016 June 8

-   Updated dependencies
-   Updated internal conventions

## v1.1.5 2016 May 4

-   Updated dependencies

## v1.1.4 2016 May 2

-   Fix error if have a cached version of fellow
-   Updated base files

## v1.1.3 2016 May 2

-   Use ES2015 edition of [fellow](https://github.com/bevry/fellow) - Fixes https://github.com/bevry/projectz/issues/81

## v1.1.2 2016 March 20

-   Repackaged

## v1.1.1 2016 March 20

-   Fix `projectz: line 1: //: is a directory`

## v1.1.0 2016 March 20

-   Repackaged with [Editions](https://github.com/bevry/editions)
-   Added editions rendering

## v1.0.9 2015 December 10

-   Updated esnextguardian script

## v1.0.8 2015 December 7

-   Moved from ECMAScript Modules to CommonJS Modules due to lack of Node.js support
-   Updated base files

## v1.0.7 2015 November 30

-   Updated dependencies

## v1.0.6 2015 September 21

-   Browser install instructions will now correctly display is bower or component configuration exists, or `browser` or `jspm` fields exist

## v1.0.5 2015 September 21

-   Updated dependencies

## v1.0.4 2015 September 20

-   Fixed missing `esnextguardian` dependency (regression since v1.0.3)

## v1.0.3 2015 September 20

-   Readme files will correctly finish with a newline character
-   Updated dependencies
-   Fixed second author losing their year

## v1.0.2 2015 September 18

-   Continue if fetching github contributors fails

## v1.0.1 2015 September 16

-   Fixed github API auth for user api requests

## v1.0.0 2015 September 16

-   Initial stable release
-   Readme and Package files are now extension independent
-   Readme sections are now outputted in HTML instead of Markdown to be more universal
-   Support SPDX licenses - Implements [#72](https://github.com/bevry/projectz/issues/72), [#66](https://github.com/bevry/projectz/issues/66) - Fixes [#65](https://github.com/bevry/projectz/issues/65)
-   Uses new [bevry/badges](https://github.com/bevry/badges) package for badge rendering - Implements [#67](https://github.com/bevry/projectz/issues/67), [#55](https://github.com/bevry/projectz/issues/55), [#25](https://github.com/bevry/projectz/issues/25), [#10](https://github.com/bevry/projectz/issues/10)
-   Uses new [bevry/fellow](https://github.com/bevry/fellow) package for people handling - Implements [#37](https://github.com/bevry/projectz/issues/37), [#11](https://github.com/bevry/projectz/issues/11)
-   Newline no longer required at start of readme file - Fixes [#53](https://github.com/bevry/projectz/issues/53)
-   Moved from CoffeeScript to ES6+ - Fixes [#20](https://github.com/bevry/projectz/issues/20)

## v0.5.0 2015 February 24

-   Support multiple licenses - Currently only MIT and CC-BY-4.0 are supported

## v0.4.3 2015 February 13

-   Appends new line when saving packages

## v0.4.2 2015 February 11

-   Fixes cmd line -d option
-   Fixes CRLF issue that occurred in the v0.4.1 npm package

## v0.4.1 2015 February 09

-   Fixes incorrect handling of CSON.parseFile

## v0.4.0 2015 February 09

-   Removed merging of dependencies between Package.json and Bower.json
-   Added Node v0.12.0 support

## v0.3.17 2014 December 11

-   Fixed david badges (regression from v0.3.16)

## v0.3.16 2014 December 11

-   Better badges
-   New npm downloads badge
-   Updated dependencies

## v0.3.15 2014 June 23

-   Updated dependencies

## v0.3.14 2014 May 31

-   Add support for global install instructions

## v0.3.13 2014 May 17

-   Keep contributor cache valid for one day

## v0.3.12 2014 May 17

-   Updated dependencies

## v0.3.11 2014 February 19

-   Added [DocPad](http://docpad.org) plugin install instructions
-   Added support for the `browser` field, see readme

## v0.3.10 2014 February 6

-   Added [Waffle.io](http://waffle.io) badge
-   Added Wishlist badge

## v0.3.9 Unknown

-   Always show david dependency and dev dependency badges if they are enabled, rather than disabling them if there are no dependencies or dev dependencies

## v0.3.8 Unknown

-   Cleaner badge determination

## v0.3.7 2014 January 03

-   Updated [david-dm](https://david-dm.org/) to use the [Shields.io](http://shields.io/) theme - Thanks to [Rob Loach](https://github.com/RobLoach) for [pull request #26](https://github.com/bevry/projectz/pull/26)

## v0.3.6 2014 January 03

-   Added bitcoin badge which accepts a URL via the `bitcoin` badge option
-   Donation badges are now on their own line

## v0.3.5 2014 January 01

-   Only show david dm badges if there actually are dependencies for that badge

## v0.3.4 2014 January 01

-   Added [david-dm](https://david-dm.org/) dev dependency badge support
-   Automatic badge detection for `daviddev`

## v0.3.3 2014 January 01

-   Added [david-dm](https://david-dm.org/) badge support - Thanks to [Rob Loach](https://github.com/RobLoach) for [pull request #21](https://github.com/bevry/projectz/pull/21)
-   Automatic badge detection for `travis`, `npm`, and `david` badges
-   Travis file is now regarded as a readme file

## v0.3.2 2013 December 16

-   Formatting changes to backers listing

## v0.3.1 2013 December 16

-   Formatting changes to backers listing

## v0.3.0 2013 December 12

-   Client-side install instructions will only show if `browser` property is truthy
-   Added new `browser` property that will default to true if `bower` or `component` packages are defined

## v0.2.10 2013 December 12

-   Moved `docco` from `dependencies` into `devDependencies` where it belongs

## v0.2.9 2013 December 12

-   Fixed CDN URL highlighting

## v0.2.8 2013 December 12

-   Changed `HISTORY.md` and `CONTRIBUTING.md` URLs and names to always be uppercase
-   Added [wzrd.in](http://wzrd.in/) CDN URL to the Node/Browserify install section

## v0.2.7 2013 November 25

-   Updated dependencies

## v0.2.6 2013 November 6

-   Updated dependencies

## v0.2.5 2013 October 31

-   Seems github doesn't like `//` urls

## v0.2.4 2013 October 31

-   Updated badges to use `//` for their urls

## v0.2.3 2013 October 23

-   Fixed error when encountering an unknown license

## v0.2.2 2013 October 23

-   Fixed `license` and `licenses` duplicate in `package.json` file
-   Fixed some issues with contributors and `package.json` files

## v0.2.1 2013 October 16

-   Fixed some issues. Now stable enough to use for your projects.

## v0.2.0 2013 October 16

-   Added INSTALL, BACKER, and BACKERFILE tags

## v0.1.0 2013 October 15

-   Mostly working except for BACKER tags

## v0.0.2 2013 September 19

-   Renamed from `readme-utils` to `projectz`

## v0.0.1 2013 June 19

-   Initial non-working commit
