Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};


module.exports = {
	getShotFromData: function(data, disziplin){
		var scheibe = disziplin.scheibe

		console.log(scheibe.title)

		var shot = {
			ring: 0,
			ringInt: 0,
			time: null,
			x: null,
			y: null,
			teiler: 0,
			winkel: 0,
			log: function(){
				console.log("Ring: "+this.ring+" Teiler: "+this.teiler+" Winkel "+this.winkel+"("+this.x+", "+this.y+")")
			},
		}

		if (data[2] == "1d") {
			shot.time = new Date()//parseInt(data[3] + data[4] + data[5] + data[6], 16)

			var xData = data[7] + data[8] + data[9] + data[10]
			var x = parseInt(xData, 16)
			if (x > 2290649224) x = x - 4294967295
			shot.x = x
			console.log("x: "+x+ " ("+xData+")")

			var yData = data[11]+ data[12]+ data[13] + data[14]
			var y = parseInt(yData, 16)
			if (y > 2290649224) y = y - 4294967295
			shot.y = y
			console.log("y: "+y + " ("+yData+")")

			var diff = Math.pow((x*x + y*y), 0.5) / 1000


			var winkel = Math.atan2(y, x) * (180 / Math.PI)
			if (x >= 0 && y >= 0) shot.winkel = winkel
			else if (x >= 0 && y < 0) shot.winkel = 360 + winkel
			else if (x < 0 && y >= 0) shot.winkel = winkel
			else if (x < 0 && y < 0) shot.winkel = 360 + winkel

			shot.teiler = diff*100
			console.log("diff: "+diff)


			for (var i in scheibe.ringe){
				var k = scheibe.kugelDurchmesser/2
				var rb = scheibe.ringe[i].width/2 + k

				if (rb >= diff){
					var rbv = 0
					if (i != 0) {
						rbv = scheibe.ringe[i-1].width/2 + k
					}

					var zehntel = ( (rb - diff) / (rb - rbv) ).toFixedDown(1)

					if (zehntel > 0.9) zehntel = 0.9
					console.log("ring: "+scheibe.ringe[i].value+" Zehntel: "+zehntel)

					shot.ring = (scheibe.ringe[i].value + zehntel).toFixed(1)
					shot.ringInt = scheibe.ringe[i].value
					break
				}
			}

			shot.log();
			return shot
		}
		else {
			return null
		}
	}
}
