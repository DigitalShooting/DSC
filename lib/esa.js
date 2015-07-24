var config = require("../config/index.js")
var exec = require('exec');



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


Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

function getShotFromData(data, scheibe){
	var shot = {
		ring: 0,
		ringInt: 0,
		time: null,
		x: null,
		y: null,
		teiler: 0,
		log: function(){
			console.log("Ring: "+this.ring+" Teiler: "+this.teiler+" ("+this.x+", "+this.y+")")
		}
	}

	if (data[2] == "1d") {
		shot.time = parseInt(data[3] + data[4] + data[5] + data[6], 16)
		// console.log("time: "+time)

		var xData = data[7] + data[8] + data[9] + data[10]
		var x = parseInt(xData, 16)
		if (x > 2290649224) x = x - 4294967295
		shot.x = x
		console.log("x: "+x+ " ("+xData+")")

		var yData = data[11]+ data[12]+ data[13] + data[14]
		var y = parseInt(yData, 16)
		if (y > 2290649224) y = y - 4294967295
		shot.y = y
		console.log("y: "+y + " ("+yData+")")

		var diff = Math.pow((x*x + y*y), 0.5) / 1000// - scheibe.kugelDurchmesser/2
		shot.teiler = diff*100
		console.log("diff: "+diff)


		for (var i in scheibe.ringe){
			var k = scheibe.kugelDurchmesser/2
			var rb = scheibe.ringe[i].width/2 + k

			if (rb >= diff){
				var rbv = 0
				if (i != 0) {
					rbv = scheibe.ringe[i-1].width/2 + k
				}

				//var zehntel = (( Math.round( (rb - diff) / (rb - rbv) * 10 ) / 10 ) ).toFixedDown(1)
				var zehntel = ( (rb - diff) / (rb - rbv) )//.toFixedDown(1)

				if (zehntel > 0.9) zehntel = 0.9
				console.log("ring: "+scheibe.ringe[i].value+" Zehntel: "+zehntel)

				shot.ring = scheibe.ringe[i].value + zehntel
				shot.ringInt = scheibe.ringe[i].value
				break
			}
		}

		shot.log();
		return shot
	}
	else {
		return null
	}
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

			var shot = getShotFromData(shotData, config.disziplinen.lgTraining.scheibe)
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
