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
		var ring
		if (teiler == 0){
			ring = 10.9
		}
		else {
			var k = scheibe.kugelDurchmesser/2
			var ring1 = scheibe.ringe[0]
			var ring2 = scheibe.ringe[scheibe.ringe.length-1]

			var m = (ring1.value - ring2.value) / (ring1.width*100/2 - ring2.width*100/2)
			var t =  ring1.value - m * (ring1.width*100/2 + k*100)

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

		shot.teiler = (Math.pow((x*x + y*y), 0.5) / 10).toFixedDown(0)
		// console.log("Teiler: " + shot.teiler)

		var winkel = Math.atan2(y, x) * (180 / Math.PI)
		if (x >= 0 && y >= 0) shot.winkel = winkel
		else if (x >= 0 && y < 0) shot.winkel = 360 + winkel
		else if (x < 0 && y >= 0) shot.winkel = winkel
		else if (x < 0 && y < 0) shot.winkel = 360 + winkel

		shot.ring = this.getRingFromTeiler(shot.teiler, scheibe)
		shot.ringInt = parseFloat(shot.ring).toFixedDown(0)

		shot.log()

		return shot
	},
}
