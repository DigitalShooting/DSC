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




module.exports = function(interf, session){

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

			var shot = esaHelper.getShotFromData(shotData, session)
			if (shot) {
				esa.onNewShot(shot)
				esa.onNewStatus(true)
			}
			else if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
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
