// 2015 September 18
// https://github.com/bevry/base
module.exports = require('esnextguardian')(
	require('path').join(__dirname, 'esnext', 'lib', 'projectz.js'),
	require('path').join(__dirname, 'es5', 'lib', 'projectz.js')
)
