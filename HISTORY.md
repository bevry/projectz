# History

## v0.4.3 February 13, 2015
- Appends new line when saving packages

## v0.4.2 February 11, 2015
- Fixes cmd line -d option
- Fixes CRLF issue that occurred in the v0.4.1 npm package

## v0.4.1 February 09, 2015
- Fixes incorrect handling of CSON.parseFile

## v0.4.0 February 09, 2015
- Removed merging of dependencies between Package.json and Bower.json
- Added Node v0.12.0 support

## v0.3.17 December 11, 2014
- Fixed david badges (regression from v0.3.16)

## v0.3.16 December 11, 2014
- Better badges
- New npm downloads badge
- Updated dependencies

## v0.3.15 June 23, 2014
- Updated dependencies

## v0.3.14 May 31, 2014
- Add support for global install instructions

## v0.3.13 May 17, 2014
- Keep contributor cache valid for one day

## v0.3.12 May 17, 2014
- Updated dependencies

## v0.3.11 February 19, 2014
- Added [DocPad](http://docpad.org) plugin install instructions
- Added support for the `browser` field, see readme

## v0.3.10 February 6, 2014
- Added [Waffle.io](http://waffle.io) badge
- Added Wishlist badge

## v0.3.9 Unknown
- Always show david dependency and dev dependency badges if they are enabled, rather than disabling them if there are no dependencies or dev dependencies

## v0.3.8 Unknown
- Cleaner badge determination

## v0.3.7 January 03, 2014
- Updated [david-dm](https://david-dm.org/) to use the [Shields.io](http://shields.io/) theme
	- Thanks to [Rob Loach](https://github.com/RobLoach) for [pull request #26](https://github.com/bevry/projectz/pull/26)

## v0.3.6 January 03, 2014
- Added bitcoin badge which accepts a URL via the `bitcoin` badge option
- Donation badges are now on their own line

## v0.3.5 January 01, 2014
- Only show david dm badges if there actually are dependencies for that badge

## v0.3.4 January 01, 2014
- Added [david-dm](https://david-dm.org/) dev dependency badge support
- Automatic badge detection for `daviddev`

## v0.3.3 January 01, 2014
- Added [david-dm](https://david-dm.org/) badge support
	- Thanks to [Rob Loach](https://github.com/RobLoach) for [pull request #21](https://github.com/bevry/projectz/pull/21)
- Automatic badge detection for `travis`, `npm`, and `david` badges
- Travis file is now regarded as a readme file

## v0.3.2 December 16, 2013
- Formatting changes to backers listing

## v0.3.1 December 16, 2013
- Formatting changes to backers listing

## v0.3.0 December 12, 2013
- Client-side install instructions will only show if `browser` property is truthy
- Added new `browser` property that will default to true if `bower` or `component` packages are defined

## v0.2.10 December 12, 2013
- Moved `docco` from `dependencies` into `devDependencies` where it belongs

## v0.2.9 December 12, 2013
- Fixed CDN URL highlighting

## v0.2.8 December 12, 2013
- Changed `HISTORY.md` and `CONTRIBUTING.md` URLs and names to always be uppercase
- Added [wzrd.in](http://wzrd.in/) CDN URL to the Node/Browserify install section

## v0.2.7 November 25, 2013
- Updated dependencies

## v0.2.6 November 6, 2013
- Updated dependencies

## v0.2.5 October 31, 2013
- Seems github doesn't like `//` urls

## v0.2.4 October 31, 2013
- Updated badges to use `//` for their urls

## v0.2.3 October 23, 2013
- Fixed error when encountering an unknown license

## v0.2.2 October 23, 2013
- Fixed `license` and `licenses` duplicate in `package.json` file
- Fixed some issues with contributors and `package.json` files

## v0.2.1 October 16, 2013
- Fixed some issues. Now stable enough to use for your projects.

## v0.2.0 October 16, 2013
- Added INSTALL, BACKER, and BACKERFILE tags

## v0.1.0 October 15, 2013
- Mostly working except for BACKER tags

## v0.0.2 September 19, 2013
- Renamed from `readme-utils` to `projectz`

## v0.0.1 June 19, 2013
- Initial non-working commit
