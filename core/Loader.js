DD.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? DD.Loader.prototype.addStatusElement() : null;

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

DD.Loader.prototype = {
	constructor: DD.Loader,
	addStatusElement: function () {
		var e = document.createElement( "div" );
		e.style.position = "absolute";
		e.style.right = "0px";
		e.style.top = "0px";
		e.style.fontSize = "0.8em";
		e.style.textAlign = "left";
		e.style.background = "rgba(0,0,0,0.25)";
		e.style.color = "#fff";
		e.style.width = "120px";
		e.style.padding = "0.5em 0.5em 0.5em 0.5em";
		e.style.zIndex = 1000;
		e.innerHTML = "Loading ...";
		return e;
	},
	updateProgress: function ( progress ) {
		var message = "Loaded ";
		if ( progress.total ) {
			message += ( 100 * progress.loaded / progress.total ).toFixed(0) + "%";
		} else {
			message += ( progress.loaded / 1000 ).toFixed(2) + " KB";
		}
		this.statusDomElement.innerHTML = message;
	},
	load : function ( url, callback, scope) {
		this.onLoadStart();
		this.loadAjaxJSON( this, url, callback, this.updateProgress, scope );
	},
	loadAjaxJSON : function ( context, url, callback, callbackProgress, scope ) {
		var xhr = new XMLHttpRequest();
		var length = 0;
		xhr.onreadystatechange = function () {
			if ( xhr.readyState === xhr.DONE ) {
				if ( xhr.status === 200 || xhr.status === 0 ) {
					if ( xhr.responseText ) {
						var json = JSON.parse( xhr.responseText );
						callback( json, scope );
					} else {
						console.warn( "[" + url + "] seems to be unreachable or file there is empty" );
					}
					context.onLoadComplete();
				} else {
					console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );
				}
			} else if ( xhr.readyState === xhr.LOADING ) {
				if ( this.showStatus ) {
					if ( length === 0 ) {
						length = xhr.getResponseHeader( "Content-Length" );
					}
					callbackProgress( { total: length, loaded: xhr.responseText.length } );
				}
			} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {
				if ( this.showStatus !== undefined ) {
					length = xhr.getResponseHeader( "Content-Length" );
				}
			}
		};

		xhr.open( "GET", url, true );
		xhr.withCredentials = false;
		xhr.send( null );
	}
};