"use strict";

var child_process = require('child_process');
var esaHelper = require("./helper.js");


// TODO doku, clean up
function cleanOutput(out){
	var cleanOutput = [];
	if (out){
		var outBytes = out.toString().match(/.{1,2}/g);
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




const DeviceInterface = require("./DeviceInterface.js");

class ESADeviceInterface extends DeviceInterface {
  constructor(interf, disziplin) {
    super();

		this.interf = interf;

		this.onShotBandMove = disziplin.interface.band.onShot;
		this.onChangePartBandMove = disziplin.interface.band.onChangePart;

		this.initChild(interf, disziplin);

		// Call set after init time
		setTimeout(function(){
			this.set();
		}.bind(this), 500);

		// Call band after some more time
		setTimeout(function(){
			this.band();
		}.bind(this), 1000);

		// Start shot pooling
		var intervalId;
		setTimeout(function(){
			this.intervalId = setInterval(this.nop.bind(this), 250);
		}.bind(this), 1500);
  }

	initChild(interf, disziplin){
		this.child = child_process.spawn(__dirname+"/bin/HaeringAPI", [interf.com]);
		this.child.stdin.setEncoding('utf-8');

		this.child.stdout.on('data', function(data) {
			var shotData = cleanOutput(data);
			this.call("onNewData", shotData);

			var shot = esaHelper.getShotFromData(shotData, disziplin, this.session);
			if (shot) {
				this.call("onNewShot", shot);
				this.call("onNewStatus", true);
			}
			else if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
				this.call("onNewStatus", true);
			}
			else {
				this.call("onNewStatus", false);
			}
		}.bind(this));

		this.child.stderr.on('data', function(data) {
			console.error("HaeringAPI", data.toString());
			this.call("onNewStatus", false);
		}.bind(this));

		this.child.on('close', function(code) {
			console.error("HaeringAPI", "closing code: " + code);
			this.call("onNewStatus", false);
		}.bind(this));
	}

	band(){
		this.child.stdin.write("band " + this.onChangePartBandMove + "\n");
	}

	nop(){
		this.child.stdin.write("nop\n");
	}

	set(){
		this.child.stdin.write("set " + this.onShotBandMove + "\n");
		// TODO readSettings
	}

	setSession(session) {
		super.setSession(session);
    this.band();
  }

  stop(){
		clearInterval(this.intervalId);
		this.child.kill("SIGTERM");
  }
}

module.exports = ESADeviceInterface;
