var config = require("../config/")
var exec = require('exec');
var esaHelper = require("./esaHelper.js")



function cleanOutput(out){
	var cleanOutput = []
	if (out){
		var outBytes = out.match(/.{1,2}/g)
		var length = 0;
		for (var i in outBytes){
			var byte = outBytes[i]
			if (cleanOutput.length == 0) {
				if (byte == "55") {
					cleanOutput.push(byte)
				}
			}
			else {
				cleanOutput.push(byte)

				if (cleanOutput.length == 2) {
					if (byte == "08") length = 5;
					else if (byte == "1a") length = 29;
					else if (byte == "1b") length = 26;
					else if (byte == "1d") length = 17;
				}
				if (cleanOutput.length == length) {
					break
				}
			}
		}
		console.log(cleanOutput)
	}
	return cleanOutput
}




module.exports = function(interf){

	var esa = {}

	esa.onNewStatus = function(){}
	esa.onNewShot = function(){}
	esa.onNewData = function(){}

	esa.band = function(){
		exec([__dirname+'/HaeringAPI/bin/Band', interf.com], function(err, out, code) {
			var clean = cleanOutput(out)
			esa.onNewData(clean)
		});
	}

	esa.nop = function(){
		exec([__dirname+'/HaeringAPI/bin/NOP', interf.com], function(err, out, code) {
			var shotData = cleanOutput(out)

			var shot = esaHelper.getShotFromData(shotData, config.disziplinen.lgTraining.scheibe)
			if (shot) {
				esa.onNewShot(shot)
			}
			else if(out[0] == "55" && out[1] == "01" && out[2] == "13" && out[3] == "00" && out[4] == "47" && out[5] == "AA") {
				esa.onNewStatus(true)
			}
			else {
				esa.onNewStatus(false)
			}

		});
	}

	esa.set = function(){
		exec([__dirname+'/HaeringAPI/bin/Set', interf.com], function(err, out, code) {

			exec([__dirname+'/HaeringAPI/bin/ReadSettings', interf.com], function(err, out, code) {
				var clean = cleanOutput(out)
				esa.onNewData(clean)
			});
		});
	}


	esa.set()

	var intervalId
	setTimeout(function(){
		intervalId = setInterval(esa.nop, 1500)
	}, 1500)


	esa.stop = function(){
		clearInterval(intervalId)
	}


	return esa
}
