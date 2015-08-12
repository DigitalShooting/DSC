var config = require("../config/index.js")
var esaHelper = require("./esaHelper.js")
var exec = require('exec');


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};




module.exports = function(interf){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}
	esa.onNewStatus = function(){}


	// setInterval(function(){
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'ff','ff','eb','50',
	// 						'ff','ff','f9','f5',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 100)
	//
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'00','00','1e','29',
	// 						'00','00','0e','2e',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 200)
	//
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'00','00','1e','29',
	// 						'00','00','4e','2e',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 300)
	//
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'00','00','0e','29',
	// 						'00','00','0e','2e',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 400)
	//
	//
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'00','00','0e','29',
	// 						'00','00','4e','2e',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 500)
	//
	//
	// 	setTimeout(function(){
	// 		var data = [ 	'55','01','1d',
	// 						'00','00','af','80',
	// 						'00','00','00','29',
	// 						'00','00','00','2e',
	// 						'9b' ]
	// 		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// 	}, 600)
	// }, 600)

	var intervalId = setInterval(function(){

		var scheibe = config.disziplinen.demo.parts.probe.scheibe

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

		shot.time = new Date()

		var x = Math.random()*20000 - 10000
		shot.x = x
		console.log("x: "+shot.x)

		var y = Math.random()*20000 - 10000
		shot.y = y
		console.log("y: "+shot.y)

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

		esa.onNewShot( shot )
		esa.onNewStatus(true)
	}, interf.time)


	esa.stop = function(){
		clearInterval(intervalId)
	}


	return esa
}
