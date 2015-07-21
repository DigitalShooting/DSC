var scheibeLG = {
	title: "LG 10m",
	ringe: [
		{ value: 10, width:  0.5 },
		{ value:  9, width:  5.5 },
		{ value:  8, width: 10.5 },
		{ value:  7, width: 15.5 },
		{ value:  6, width: 20.5 },
		{ value:  5, width: 25.5 },
		{ value:  4, width: 30.5 },
		{ value:  3, width: 35.5 },
		{ value:  2, width: 40.5 },
		{ value:  1, width: 45.5 },
	],
	kugelDurchmesser: 4.5,
}

var scheibeLP = {
	title: "LP 10m",
	ringe: [
		{ value: 10, width:  11.5 },
		{ value:  9, width:  27.5 },
		{ value:  8, width:  43.5 },
		{ value:  7, width:  59.5 },
		{ value:  6, width:  75.5 },
		{ value:  5, width:  91.5 },
		{ value:  4, width: 107.5 },
		{ value:  3, width: 123.5 },
		{ value:  2, width: 139.5 },
		{ value:  1, width: 155.5 },
	],
	kugelDurchmesser: 4.5,
}




function getShootFromData(data, scheibe){
	var shot = {
		ring: 0,
		time: null,
		ringDez: function(){return Math.round(this.ring*10)/10},
		x: null,
		y: null,
		log: function(){
			console.log("Ring: "+this.ringDez()+" ("+this.x+", "+this.y+")")
		}
	}

	if (data[2] == "1d") {
		shot.time = parseInt(data[3] + data[4] + data[5] + data[6], 16)
		// console.log("time: "+time)

		var x = parseInt(data[7] + data[8] + data[9] + data[10], 16)
		if (x > 2290649224) x = x - 4294967295
		shot.x = x
		// console.log("x: "+x)

		var y = parseInt(data[11]+ data[12]+ data[13] + data[14], 16)
		if (y > 2290649224) y = y - 4294967295
		shot.y = y
		// console.log("y: "+y)

		var diff = Math.pow((x*x + y*y), 0.5) / 1000 - scheibe.kugelDurchmesser/2
		// console.log("diff: "+diff)

		for (var i in scheibe.ringe){
			if (scheibe.ringe[i].width/2 >= diff) {
				var zehntel;
				if (i == 0) {
					zehntel = diff / scheibe.ringe[i].width/2 * 10
				}
				else {
					zehntel = ((scheibe.ringe[i].width/2 - scheibe.ringe[i-1].width/2) - (diff - scheibe.ringe[i-1].width/2)) / (scheibe.ringe[i].width/2 - scheibe.ringe[i-1].width/2)
				}
				shot.ring = scheibe.ringe[i].value + zehntel
				break
			}
		}
	}

	return shot
}




var data76 = ["55", "01", "1d", "00", "00", "30", "cd", "00", "00", "1e", "29", "00", "00", "0e", "2e", "a3", "aa"]
var data88 = ["55", "01", "1d", "00", "00", "3c", "5f", "ff", "ff", "eb", "50", "ff", "ff", "f9", "f5", "9d", "aa"]

getShootFromData(data76, scheibeLG).log()
getShootFromData(data88, scheibeLG).log()
