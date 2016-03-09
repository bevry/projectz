/* @flow */

// Define
class Person extends require('fellow') {

	/**
	If the name is empty, we will try to fallback to githubUsername then twitterUsername
	If the name is prefixed with a series of numbers, that is considered the year
	E.g. In `2015+ Bevry Pty Ltd` then `2015+` is the years
	E.g. In `2013-2015 Bevry Pty Ltd` then `2013-2015` is the years
	@property name
	@type String
	*/
	/* eslint no-magic-numbers: 0 */
	set name (value) {
		const match = (/^((?:[0-9]+[\-\+]?)+)?(.+)$/).exec(value)
		if ( match ) {
			const years = String(match[1] || '').trim() || null
			const name = match[2].trim() || null
			if ( years ) {
				this.years = years
			}
			this._name = name
		}
	}

	get name () {
		return this._name || this.githubUsername || this.twitterUsername || this.facebookUsername || null
	}

	/**
	The years that this fellow has
	@property years
	@type String
	*/

}

// Exports
module.exports = Person
