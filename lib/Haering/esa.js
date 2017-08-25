var child_process = require('child_process');
var esaHelper = require("./helper.js");



function cleanOutput(out){
	var cleanOutput = [];
	if (out){
		var length = 0;
		for (var i in out){
			var byte = out[i];
			if (cleanOutput.length === 0) {
				if (byte == "55") {
					cleanOutput.push(byte);
				}
			}
			else {
				cleanOutput.push(byte);

				if (cleanOutput.length == 2) {
					if (byte == "08") length = 5;
					else if (byte == "1a") length = 29;
					else if (byte == "1b") length = 26;
					else if (byte == "1d") length = 17;
				}
				if (cleanOutput.length == length) {
					break;
				}
			}
		}
	}
	return cleanOutput;
}




module.exports = function(interf, disziplin){

	var esa = {};

	var child = child_process.spawn(__dirname+"/bin/HaeringAPI", [interf.com]);
	child.stdin.setEncoding('utf-8');
	child.stdout.on('data', function(data) {
		console.log("DATA", data.toString());
		var shotData = cleanOutput(data);
		esa.onNewData(shotData);

		var shot = esaHelper.getShotFromData(shotData, disziplin, esa.session);
		if (shot) {
			esa.onNewShot(shot);
			esa.onNewStatus(true);
		}
		else if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
			esa.onNewStatus(true);
		}
		else {
			// TODO
			esa.onNewStatus(false);
		}

	});
	child.stderr.on('data', function(data) {
		console.log("ERROR", data.toString());
		// TODO
	});
	child.on('close', function(code) {
		console.log('closing code: ' + code);
		// TODO
	});


	esa.onNewStatus = function(){};
	esa.onNewShot = function(){};
	esa.onNewData = function(){};
	esa.session = null;

	esa.band = function(){
		child.stdin.write("band " + disziplin.interface.band.onChangePart + "\n");
		// child_process.exec(__dirname+"/bin/HaeringAPI " + interf.com + " band " + disziplin.interface.band.onChangePart, function(err, out, code) {
		// 	var clean = cleanOutput(out);
		// 	esa.onNewData(clean);
		// });
	};

	esa.nop = function(){
		child.stdin.write("nop\n");
		// child_process.exec(__dirname+"/bin/HaeringAPI " + interf.com + " nop", function(err, out, code) {
		// 	var shotData = cleanOutput(out);
		//
		// 	var shot = esaHelper.getShotFromData(shotData, disziplin, esa.session);
		// 	if (shot) {
		// 		esa.onNewShot(shot);
		// 		esa.onNewStatus(true);
		// 	}
		// 	else if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
		// 		esa.onNewStatus(true);
		// 	}
		// 	else {
		// 		esa.onNewStatus(false);
		// 	}
		// });
	};

	esa.set = function(){
		child.stdin.write("set " + disziplin.interface.band.onShot + "\n");
		// TODO
		// child_process.exec(__dirname+"/bin/HaeringAPI " + interf.com + " set " + disziplin.interface.band.onShot, function(err, out, code) {
		// 	child_process.exec(__dirname+"/bin/HaeringAPI " + interf.com + " readSettings", function(err, out, code) {
		// 		var clean = cleanOutput(out);
		// 		esa.onNewData(clean);
		// 	});
		// });
	};



	setTimeout(function(){
		esa.set();
	}, 5000);
	setTimeout(function(){
		esa.band();
	}, 6000);

	var intervalId;
	setTimeout(function(){
		intervalId = setInterval(esa.nop, 1500);
	}, 7000);


	esa.stop = function(){
		clearInterval(intervalId);
		child.kill("SIGTERM");
	};


	return esa;
};
