

var DD = DD || { REVISION: '01' };


DD.extend = function ( obj, source ) {
	// ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
	if ( Object.keys ) {
		var keys = Object.keys( source );
		for (var i = 0, il = keys.length; i < il; i++) {
			var prop = keys[i];
			Object.defineProperty( obj, prop, Object.getOwnPropertyDescriptor( source, prop ) );
		}
	} else {
		var safeHasOwnProperty = {}.hasOwnProperty;
		for ( var prop in source ) {
			if ( safeHasOwnProperty.call( source, prop ) ) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};

// using 'self' instead of 'window' for compatibility with both NodeJS and IE10.
( function () {

	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

	for ( var x = 0; x < vendors.length && !self.requestAnimationFrame; ++ x ) {
		self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
		self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
	}

	if ( self.requestAnimationFrame === undefined && self['setTimeout'] !== undefined ) {
		self.requestAnimationFrame = function ( callback ) {
			var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = self.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if( self.cancelAnimationFrame === undefined && self['clearTimeout'] !== undefined ) {
		self.cancelAnimationFrame = function ( id ) { self.clearTimeout( id ) };
	}

}() );
