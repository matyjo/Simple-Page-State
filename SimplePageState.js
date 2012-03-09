// Requires jquery
// Requires jquery.hashchange.js
// Requires jquery.base64.js
// Requires JSON

//=================
//
// written by Matt O.
//

// Example usage:

// this.pageState = new SimplePageState();
// this.pageState.init({
//		callback: function name // req // to be called when the hash changes
//		,isJson: boolean // opt // will base64 encode/decode if JSON
//		,context: class instance // opt
// });

// this.pageState.setHash(string); // sets the value to be hashed
// var myHash = this.pageState.getHash(); // gets the stored hash

//
//=================

function SimplePageState() {};

(function($) {

SimplePageState.prototype._callback = null; // req
SimplePageState.prototype._context = null; // opt
SimplePageState.prototype._forceCallback = false;
SimplePageState.prototype._isJson = false;

SimplePageState.prototype.init = function(args) {
	args = args || {};
	this._setCallback(args);
	this._initEvent();
	
	if (!SimplePageState.isNull(this.getHash()) || this._forceCallback) {
		this.initCallback();
		this._forceCallback = false;
	};
};

SimplePageState.prototype.getHash = function() {
	var hash = $.base64Decode(window.location.hash).replace(/#/,'');
	if (!SimplePageState.isNull(hash)) {
		return (this._isJson) ? JSON.parse(hash) : hash;
	};
};

SimplePageState.prototype.setHash = function(data) {
	if (!SimplePageState.isNull(data)) {
		window.location.hash = this.createHash(data);
	};
};

SimplePageState.prototype.createHash = function(data) {
	var hash = data;
	if (!SimplePageState.isNull(data)) {
		if (typeof data === 'object') {
			this._isJson = true;
			hash = JSON.stringify(data);
		}
		return $.base64Encode(hash);
	}
};

SimplePageState.prototype._setCallback = function(args) {
	var requiredSet = false;
	if (args.callback) {
		this._callback = args.callback;
		if (args.context) {
			this._context = args.context;
		};
		requiredSet = true;
	};
	if (args.forceCallback) {
		this._forceCallback = args.forceCallback;
	};
	if (args.isJson) {
		this._isJson = args.isJson;
	};
	
	return requiredSet;
};

SimplePageState.prototype.initCallback = function() {
	var hash = this.getHash();
	if (!SimplePageState.isNull(hash) || this._forceCallback) {
		this._callback.call(this._context, hash);
	};
};

SimplePageState.prototype._initEvent = function() {
	var self = this._context;
	$(window).hashchange(function(){
		self.pageState.initCallback();
	});
};

SimplePageState.isNull = function(str) {
	if (typeof str == 'undefined' || str == '' || str == null) {
		return true;
	};

	return false;
};

})(jQuery);