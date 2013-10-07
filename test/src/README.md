<!-- TTITLE -->
<!-- BADGES -->
<!-- DESCRIPTION -->


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


<!-- INSTALL -->
<!-- HISTORY -->
<!-- CONTRIBUTE -->
<!-- BACKERS -->
<!-- LICENSE -->