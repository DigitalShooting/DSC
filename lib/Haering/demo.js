var esaHelper = require("./helper.js")
var exec = require('exec');


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};




module.exports = function(interf, disziplin){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}
	esa.onNewStatus = function(){}


	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','00','00',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','00','01',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','00','0a',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)


	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','07','d1',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)


	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','09','c4',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','09','c5',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','09','ce',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','13','88',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','13','89',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','13','92',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','1d','4c',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','1d','4d',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','1d','56',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','61','a8',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)
	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','00','00',
						'00','00','61','b2',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)


	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','10','30',
						'ff','ff','f8','d7',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','02','ac',
						'ff','ff','e7','59',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','08','15',
						'ff','ff','dc','c7',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','0b','22',
						'ff','ff','c7','dc',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'ff','ff','fb','6f',
						'ff','ff','f1','bf',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','0a','1c',
						'00','00','09','1d',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','00','0c','77',
						'ff','ff','fa','cd',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)

	setTimeout(function(){
		var data = [ 	'55','01','1d', '00','00','af','80',
						'00','01','3c','77',
						'ff','ff','fa','cd',
						'9b' ]
		esa.onNewShot( esaHelper.getShotFromData(data, disziplin) )
	}, 600)



	var intervalId = setInterval(function(){
		var scheibe = disziplin.scheibe

		var x = Math.random()*6000 - 3000
		var y = Math.random()*6000 - 3000

		var shot = esaHelper.getShotFromXY(x, y, scheibe)
		shot.log();

		esa.onNewShot( shot )
		esa.onNewStatus(true)
	}, interf.time)



	esa.stop = function(){
		clearInterval(intervalId)
	}


	return esa
}
