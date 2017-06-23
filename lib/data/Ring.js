Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};


module.exports = class Ring {
	constructor(teiler, scheibe, part) {
		if (teiler == null || scheibe == null || part == null) {
			throw new Error("One or more paramerter is null");
		}

		var ringGroß = scheibe.ringe[0];
		var ringKlein = scheibe.ringe[scheibe.ringe.length-1];
		var k = scheibe.kugelDurchmesser*100/2;

		var ring;
		if (teiler === 0){
			ring = 10.9;
		}
		else if (teiler > ringKlein.width*100/2 + k){
			ring = 0;
		}
		else {
			var m = (ringGroß.value - ringKlein.value) / (ringGroß.width*100/2 - ringKlein.width*100/2);
			var t =  ringGroß.value - m * (ringGroß.width*100/2 + k);

			ring = (m * teiler + t).toFixedDown(1).toFixed(1);
		}

		this.display = parseFloat(ring).toFixed(1);
		this.int = parseFloat(ring).toFixedDown(0);
		if (part.zehntel === true) {
			this.value = parseFloat(ring).toFixedDown(1);
		}
		else {
			this.value = parseFloat(ring).toFixedDown(0);
		}
	}
};
