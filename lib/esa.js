var config = require("../config.js")
var exec = require('exec');



function cleanOutput(out){
	var outBytes = out.match(/.{1,2}/g)
	var cleanOutput = []
	for (var i in outBytes){
		var byte = outBytes[i]
		if (cleanOutput.length == 0) {
			if (byte == "55") {
				cleanOutput.push(byte)
			}
		}
		else {
			if (byte != "ff") {
				cleanOutput.push(byte)
				if (byte == "aa") {
					break
				}
			}
		}
	}
	return cleanOutput
}



module.exports = function(){

	var esa = {}

	esa.band = function(){
		exec([__dirname+'/HaeringAPI/Band', config.esa.com], function(err, out, code) {
			// if (err instanceof Error) throw err;
			// process.stderr.write(err);
			// process.stdout.write(out);

			console.log(cleanOutput(out));

			//process.exit(code);
		});
	}

	esa.nop = function(){
		exec([__dirname+'/HaeringAPI/NOP', config.esa.com], function(err, out, code) {
			// if (err instanceof Error) throw err;
			// process.stderr.write(err);
			// process.stdout.write(out);

			console.log(cleanOutput(out));

			//process.exit(code);
		});
	}

	return esa
}
