var config = require("../config/index.js")
var esaHelper = require("./esaHelper.js")
var exec = require('exec');


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};




module.exports = function(){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}

	
	setInterval(function(){
		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'ff','ff','eb','50',
							'ff','ff','f9','f5',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 1000)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','1e','29',
							'00','00','0e','2e',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 2000)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','1e','29',
							'00','00','4e','2e',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 3000)

		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','0e','29',
							'00','00','0e','2e',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 4000)


		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','0e','29',
							'00','00','4e','2e',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 5000)


		setTimeout(function(){
			var data = [ 	'55','01','1d',
							'00','00','af','80',
							'00','00','00','29',
							'00','00','00','2e',
							'9b' ]
			esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
		}, 6000)
	}, 6000)





	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','10','30',
						'ff','ff','f8','d7',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 1000)

	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'00','00','02','ac',
						'ff','ff','e7','59',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 2000)


	setTimeout(function(){
		var data = [ 	'55','01','1d',
						'00','00','af','80',
						'ff','ff','dc','c7',
						'00','00','10','15',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	}, 2500)
	//
	//
	// setTimeout(function(){
	// 	var data = [ 	'55','01','1d',
	// 					'00','00','af','80',
	// 					'00','00','03','15',
	// 					'ff','ff','ff','c7',
	// 					'9b' ]
	// 	esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// }, 3000)
	//
	// setTimeout(function(){
	// 	var data = [ 	'55','01','1d',
	// 					'00','00','af','80',
	// 					'00','00','03','15',
	// 					'ff','ff','45','c7',
	// 					'9b' ]
	// 	esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// }, 5000)
	//
	// setTimeout(function(){
	// 	var data = [ 	'55','01','1d',
	// 					'00','00','af','80',
	// 					'00','00','03','15',
	// 					'ff','ff','f7','c7',
	// 					'9b' ]
	// 	esa.onNewShot( esaHelper.getShotFromData(data, config.disziplinen.lgTraining.scheibe) )
	// }, 6000)


	return esa
}
