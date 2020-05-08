<!-- TITLE/ -->

<h1>ambi</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry/ambi" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry/ambi/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/ambi" title="View this project on NPM"><img src="https://img.shields.io/npm/v/ambi.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/ambi" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/ambi.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/ambi" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/ambi.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/ambi#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/ambi.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-slackin"><a href="https://slack.bevry.me" title="Join this project's slack community"><img src="https://slack.bevry.me/badge.svg" alt="Slack community badge" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/thing/344188/balupton-on-Flattr" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=QB8GQPZAH84N6" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Execute a function ambidextrously (normalizes the differences between synchronous and asynchronous functions). Useful for treating synchronous functions as asynchronous functions (like supporting both synchronous and asynchronous event definitions automatically).

<!-- /DESCRIPTION -->


## Usage

### Example

``` javascript
// Import
var ambi = require('ambi');
var result;

// Sample methods
var syncMethod = function(x,y){
	return x*y;
};
var asyncMethod = function(x,y,next){
	return setTimeout(function(){
		next(null,x*y);
	},0);
};

// Call the synchronous function asynchronously
result = ambi(syncMethod, 5, 2, function(err,result){ // ambi adds support for this asynchronous callback automatically
	console.log(err, result); // null, 10
});
console.log(result); // 10 - just like normal

// Call the asynchronous function asynchronously
result = ambi(asyncMethod, 5, 2, function(err,result){ // ambi doesn't do anything special here
	console.log(err, result); // null, 10
});
console.log(result); // setTimeout - just like normal
```

### Notes

- Ambi accepts the arguments `(method, args...)`
	- `method` is the function to execute
	- `args...` is the arguments to send to the method
		- the last argument is expected to be the completion callback
		- the completion callback is optional, but if defined, is expected to have the signature of `(err, results...)`
- If the method has the same amount of arguments as those ambi received, then we assume it is an asynchronous method and let it handle calling of the completion callback itself
- If the method does not have the same amount of arguments as those ambi received, then we assume it is a synchronous method and we'll call the completion callback ourselves
	- If the synchronous method throws an error or returns an error, we'll try to call the completion callback with a single `err` argument
	- If the synchronous method executes without error, we'll try to call the completion callback with a `err` argument equal to null, and a `result` argument equal to the returned result of the synchronous method
- Ambi can also introspect a different method than the one it fires, by passing `[methodToFire, methodToIntrospect]` as the `method` argument



<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<ul>
<li>Install: <code>npm install --save ambi</code></li>
<li>Import: <code>import * as pkg from ('ambi')</code></li>
<li>Require: <code>const pkg = require('ambi')</code></li>
</ul>

<a href="https://jspm.io" title="Native ES Modules CDN"><h3>jspm</h3></a>

``` html
<script type="module">
    import * as pkg from '//dev.jspm.io/ambi@2.1.4'
</script>
```

<a href="https://github.com/componentjs/component" title="Frontend package manager and build tool for modular web applications"><h3>Component</h3></a>
<ul><li>Install: <code>component install ambi</code></li></ul>

<a href="https://bower.io" title="A package manager for the web"><h3>Bower</h3></a>
<ul><li>Install: <code>bower install ambi</code></li></ul>

<!-- /INSTALL -->


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/ambi/releases">Discover the release history by heading on over to the releases page.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/ambi/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/ambi">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/thing/344188/balupton-on-Flattr" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=QB8GQPZAH84N6" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/ambi/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/ambi">view contributions</a></li>
<li><a href="https://github.com/sfrdmn">Sean Fridman</a> — <a href="https://github.com/bevry/ambi/commits?author=sfrdmn" title="View the GitHub contributions of Sean Fridman on repository bevry/ambi">view contributions</a></li>
<li><a href="http://aristidesfl.github.io/">Francisco Lourenço</a></li>
<li><a href="https://github.com/christav">Chris Tavares</a> — <a href="https://github.com/bevry/ambi/commits?author=christav" title="View the GitHub contributions of Chris Tavares on repository bevry/ambi">view contributions</a></li></ul>



<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2015+ <a href="http://bevry.me">Bevry Pty Ltd</a></li>
<li>Copyright &copy; 2011-2014 <a href="http://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li>
<li>and</li>
<li><a href="http://spdx.org/licenses/CC-BY-4.0.html">Creative Commons Attribution 4.0 International</a></li></ul>

<!-- /LICENSE -->
