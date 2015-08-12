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
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','00','00',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','00','01',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','00','0a',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)


		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','07','d1',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)


		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','09','c4',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','09','c5',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','09','ce',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','13','88',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','13','89',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','13','92',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','1d','4c',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','1d','4d',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','00',
							'00','00','1d','56',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		}, 600)
		// setTimeout(function(){
		// 	var data = [ 	'55','01','1d',
		// 					'00','00','af','80',
		// 					'00','00','00','00',
		// 					'00','00','09','c5',
		// 					'9b' ]
		// 	esa.onNewShot( esaHelper.getShotFromData(data,config.disziplinen.lgTraining) )
		// }, 600)
	// }, 600)



	// var intervalId = setInterval(function(){
	// 	var scheibe = config.disziplinen.demo.parts.probe.scheibe
	//
	// 	var x = Math.random()*6000 - 3000
	// 	var y = Math.random()*6000 - 3000
	//
	// 	var shot = esaHelper.getShotFromXY(x, y, scheibe)
	// 	shot.log();
	//
	// 	esa.onNewShot( shot )
	// 	esa.onNewStatus(true)
	// }, interf.time)


	esa.stop = function(){
		clearInterval(intervalId)
	}


	return esa
}
