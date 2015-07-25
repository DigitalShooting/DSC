var config = require("../config/index.js")
var exec = require('exec');
var esaHelper = require("./esaHelper.js")



function cleanOutput(out){
	console.log(out.length)
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




module.exports = function(){

	var esa = {}

	esa.onNewShot = function(){}
	esa.onNewData = function(){}

	esa.band = function(){
		exec([__dirname+'/HaeringAPI/bin/Band', config.esa.com], function(err, out, code) {
			var clean = cleanOutput(out)
			esa.onNewData(clean)
		});
	}

	esa.nop = function(){
		exec([__dirname+'/HaeringAPI/bin/NOP', config.esa.com], function(err, out, code) {
			var shotData = cleanOutput(out)

			var shot = esaHelper.getShotFromData(shotData, config.disziplinen.lgTraining.scheibe)
			if (shot) {
				esa.onNewShot(shot)
			}

		});
	}

	esa.set = function(){
		exec([__dirname+'/HaeringAPI/bin/Set', config.esa.com], function(err, out, code) {

			exec([__dirname+'/HaeringAPI/bin/ReadSettings', config.esa.com], function(err, out, code) {
				var clean = cleanOutput(out)
				esa.onNewData(clean)
			});

			// var clean = cleanOutput(out)
			// esa.onNewData(clean)
		});
	}


	esa.set()

	setTimeout(function(){
		setInterval(esa.nop, 1500)
	}, 1500)


	return esa
}
