var esaHelper = require("./helper.js");
var exec = require('exec');


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};




module.exports = function(interf, disziplin){

	var esa = {};

	esa.onNewShot = function(){};
	esa.onNewData = function(){};
	esa.onNewStatus = function(){};
	esa.session = null;

	esa.band = function(){

	};



	var intervalId = setInterval(function(){
		var scheibe = disziplin.scheibe;

		var x = Math.random()*10000 - 5000;
		var y = Math.random()*10000 - 5000;

		var shot = esaHelper.getShotFromXY(x, y, scheibe, disziplin.parts[esa.session.type]);

		esa.onNewShot( shot );
		esa.onNewStatus(true);
	}, disziplin.interface.time);



	esa.stop = function(){
		clearInterval(intervalId);
	};


	return esa;
};
