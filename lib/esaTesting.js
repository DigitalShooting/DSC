var config = require("../config.js")
var exec = require('exec');


module.exports = function(){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}

	setInterval(function(){
		var shot = {
			ring: 5.6,
			time: null,
			ringDez: function(){return Math.round(this.ring*10)/10},
			x: -4000,
			y: 5000,
			log: function(){
				console.log("Ring: "+this.ringDez()+" ("+this.x+", "+this.y+")")
			}
		}
		esa.onNewShot(shot)
	}, 4000)


	return esa
}
