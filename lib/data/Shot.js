Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

var Ring = require("./Ring.js");

module.exports = class Shot {
	constructor(position, scheibe, part) {
		if (position == null || scheibe == null || part == null) {
			throw new Error("One or more paramerter is null");
		}

		this.x = position.x;
		this.y = position.y;
		this.teiler = (Math.pow((this.x*this.x + this.y*this.y), 0.5) / 10).toFixedDown(1).toFixed(1);

		var winkel = Math.atan2(this.y, this.x) * (180 / Math.PI);
		if (this.x >= 0 && this.y >= 0) this.winkel = winkel;
		else if (this.x >= 0 && this.y < 0) this.winkel = 360 + winkel;
		else if (this.x < 0 && this.y >= 0) this.winkel = winkel;
		else if (this.x < 0 && this.y < 0) this.winkel = 360 + winkel;
		this.winkel = this.winkel.toFixedDown(1).toFixed(1);

		this.ring = new Ring(this.teiler, scheibe, part);

		this.time = new Date().getTime();
	}

	log() {
		return "Ring: "+this.ring.display+" Teiler: "+this.teiler+" Winkel "+this.winkel+" ("+this.x+", "+this.y+")";
	}
};
