// 9 September 2015
// https://github.com/bevry/base
if ( process.env.REQUIRE_ESNEXT ) {
	module.exports = require('./esnext/lib/safefs.js')
}
else if ( process.env.REQUIRE_ES5 || !process.versions.v8 || process.versions.v8.split('.')[0] < 4 ) {
	module.exports = require('./es5/lib/safefs.js')
}
else {
	try {
		module.exports = require('./esnext/lib/safefs.js')
	}
	catch (e) {
		// console.log('Downgrading from ESNEXT to ES5 due to:', e.stack)
		module.exports = require('./es5/lib/safefs.js')
	}
}
