Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

// var Ring = require("./Ring.js");

module.exports = class Disziplin {
	constructor(position, scheibe, part) {
		
	}
};
