var config = require("../config/index.js")
var exec = require('exec');


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

function getShotFromData(data, scheibe){
	var shot = {
		ring: 0,
		ringInt: 0,
		time: null,
		x: null,
		y: null,
		teiler: 0,
		log: function(){
			console.log("Ring: "+this.ring+" Teiler: "+this.teiler+" ("+this.x+", "+this.y+")")
		}
	}

	if (data[2] == "1d") {
		shot.time = parseInt(data[3] + data[4] + data[5] + data[6], 16)
		// console.log("time: "+time)

		var xData = data[7] + data[8] + data[9] + data[10]
		var x = parseInt(xData, 16)
		if (x > 2290649224) x = 4294967295 - x
		shot.x = x
		console.log("x: "+x+ " ("+xData+")")

		var yData = data[11]+ data[12]+ data[13] + data[14]
		var y = parseInt(yData, 16)
		if (y > 2290649224) y = 4294967295 - y
		shot.y = y
		console.log("y: "+y + " ("+yData+")")

		var diff = Math.pow((x*x + y*y), 0.5) / 1000// - scheibe.kugelDurchmesser/2
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

				var zehntel = (( Math.round( (rb - diff) / (rb - rbv) * 10 ) / 10 ) ).toFixedDown(1)

				if (zehntel > 0.9) zehntel = 0.9
				console.log("ring: "+scheibe.ringe[i].value+" Zehntel: "+zehntel)

				shot.ring = scheibe.ringe[i].value + zehntel
				shot.ringInt = scheibe.ringe[i].value
				break
			}
		}

		shot.log();
		return shot
	}
	else {
		console.log("no")
		return null
	}
}


module.exports = function(){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}
	/*
	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'ff','ff','eb','50',
						'ff','ff','f9','f5',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 3000)

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','1e','29',
						'00','00','0e','2e',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 3500)

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','1e','29',
						'00','00','4e','2e',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 4000)

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','2e','29',
						'00','00','4e','2e',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 4500)
	*/

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','1a','09',
						'00','00','0e','2e',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 00)

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','1e','29',
						'00','00','0e','2e',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 00)


	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'ff','ff','eb','50',
						'ff','ff','f9','f5',
						'9b' ]
		esa.onNewShot( getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 00)


	return esa
}
