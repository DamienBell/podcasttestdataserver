//Extensions
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.removeExtraWhiteSpace = function(){
	return this.replace( /[\s\n\r]+/g, ' ' );
}

String.prototype.findIntegers = function(){
	return this.match(/\d+/g);
}
