var config = require("../config.js")
var exec = require('exec');



function cleanOutput(out){
	console.log(out)
	var outBytes = out.match(/.{1,2}/g)
	var cleanOutput = []
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
	return cleanOutput
}



module.exports = function(){

	var esa = {}

	esa.onNewData = function(){}

	esa.band = function(){
		exec([__dirname+'/HaeringAPI/Band', config.esa.com], function(err, out, code) {
			var clean = cleanOutput(out)
			esa.onNewData(clean)
		});
	}

	esa.nop = function(){
		exec([__dirname+'/HaeringAPI/NOP', config.esa.com], function(err, out, code) {
			var clean = cleanOutput(out)
			esa.onNewData(clean)
		});
	}

	esa.set = function(){
		exec([__dirname+'/HaeringAPI/Set', config.esa.com], function(err, out, code) {

			exec([__dirname+'/HaeringAPI/ReadSettings', config.esa.com], function(err, out, code) {
				var clean = cleanOutput(out)
				esa.onNewData(clean)
			});

			// var clean = cleanOutput(out)
			// esa.onNewData(clean)
		});
	}


	esa.set()

	setTimeout(function(){
		setInterval(esa.nop, 1000)
	}, 1000)


	return esa
}
