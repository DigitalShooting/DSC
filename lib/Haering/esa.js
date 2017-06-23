var child_process = require("child_process");
var Shot = require("../data/Shot.js");



function cleanOutput(out){
	var cleanOutput = [];
	if (out){
		var outBytes = out.match(/.{1,2}/g);
		var length = 0;
		for (var i in outBytes){
			var byte = outBytes[i];
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



function xyFromData(data){
	if (data[2] == "1d") {
		// var time = parseInt(data[3] + data[4] + data[5] + data[6], 16)

		var xData = data[7] + data[8] + data[9] + data[10];
		var x = parseInt(xData, 16);
		if (x > 2290649224) x = x - 4294967295;

		var yData = data[11]+ data[12]+ data[13] + data[14];
		var y = parseInt(yData, 16);
		if (y > 2290649224) y = y - 4294967295;

		return {x: x, y: y};
	}
	else {
		return null;
	}
}


module.exports = function(interf, disziplin){

	var esa = {};

	esa.onNewStatus = function(){};
	esa.onNewShot = function(){};
	esa.onNewData = function(){};
	esa.session = null;

	esa.band = function(){
		child_process.execFile(__dirname+"/bin/HaeringAPI", [interf.com, "band", disziplin.interface.band.onChangePart], function(err, out, code) {
			var clean = cleanOutput(out);
			esa.onNewData(clean);
		});
	};

	esa.nop = function(){
		child_process.execFile(__dirname+"/bin/HaeringAPI", [interf.com, "nop"], function(err, out, code) {
			var shotData = cleanOutput(out);

			if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
				esa.onNewStatus(true);
			}
			else {
				try {
					var position = xyFromData(shotData);
					if (position) {
						var shot = new Shot(position, disziplin.scheibe, disziplin.parts[esa.session.type]);
						esa.onNewShot(shot);
						esa.onNewStatus(true);
					}
					else {
						esa.onNewStatus(false);
					}
				}
				catch (e) {
					console.log(e);
					esa.onNewStatus(false);
				}
			}
		});
	};

	esa.set = function(){
		child_process.execFile(__dirname+"/bin/HaeringAPI", [interf.com, "set", disziplin.interface.band.onShot], function(err, out, code) {
			child_process.execFile(__dirname+"/bin/HaeringAPI", [interf.com, "readSettings"], function(err, out, code) {
				var clean = cleanOutput(out);
				esa.onNewData(clean);
			});
		});
	};


	setTimeout(function(){
		esa.set();
	}, 0);
	setTimeout(function(){
		esa.band();
	}, 1000);

	var intervalId;
	setTimeout(function(){
		intervalId = setInterval(esa.nop, 1500);
	}, 2000);


	esa.stop = function(){
		clearInterval(intervalId);
	};


	return esa;
};
