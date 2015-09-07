Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};


module.exports = {
	getShotFromData: function(data, disziplin){
		var scheibe = disziplin.scheibe

		if (data[2] == "1d") {
			// var time = parseInt(data[3] + data[4] + data[5] + data[6], 16)

			var xData = data[7] + data[8] + data[9] + data[10]
			var x = parseInt(xData, 16)
			if (x > 2290649224) x = x - 4294967295
			// console.log("x: "+x+ " ("+xData+")")

			var yData = data[11]+ data[12]+ data[13] + data[14]
			var y = parseInt(yData, 16)
			if (y > 2290649224) y = y - 4294967295
			// console.log("y: "+y + " ("+yData+")")

			var shot = this.getShotFromXY(x, y, scheibe)
			return shot
		}
		else {
			return null
		}
	},

	getRingFromTeiler: function(teiler, scheibe){
		var ringGroß = scheibe.ringe[0]
		var ringKlein = scheibe.ringe[scheibe.ringe.length-1]
		var k = scheibe.kugelDurchmesser*100/2

		var ring
		if (teiler == 0){
			ring = 10.9
		}
		else if (teiler > ringKlein.width*100/2 + k){
			ring = 0
		}
		else {
			var m = (ringGroß.value - ringKlein.value) / (ringGroß.width*100/2 - ringKlein.width*100/2)
			var t =  ringGroß.value - m * (ringGroß.width*100/2 + k)

			ring = (m * teiler + t).toFixedDown(1).toFixed(1)
		}
		return ring
	},


	getShotFromXY: function(x, y, scheibe){
		var shot = {
			ring: 0,
			ringInt: 0,
			time: new Date(),
			x: x,
			y: y,
			teiler: 0,
			winkel: 0,
			log: function(){
				console.log("Ring: "+this.ring+" Teiler: "+this.teiler+" Winkel "+this.winkel+"("+this.x+", "+this.y+")")
			},
		}

		shot.teiler = (Math.pow((x*x + y*y), 0.5) / 10).toFixedDown(1).toFixed(1)
		// console.log("Teiler: " + shot.teiler)

		var winkel = Math.atan2(y, x) * (180 / Math.PI)
		if (x >= 0 && y >= 0) shot.winkel = winkel
		else if (x >= 0 && y < 0) shot.winkel = 360 + winkel
		else if (x < 0 && y >= 0) shot.winkel = winkel
		else if (x < 0 && y < 0) shot.winkel = 360 + winkel
		shot.winkel = shot.winkel.toFixedDown(1).toFixed(1)

		shot.ring = this.getRingFromTeiler(shot.teiler, scheibe)
		shot.ringInt = parseFloat(shot.ring).toFixedDown(0)

		return shot
	},
}
