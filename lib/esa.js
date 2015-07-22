var config = require("../config.js")
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



function getShotFromData(data, scheibe){
	var shot = {
		ring: 0,
		time: null,
		ringDez: function(){return Math.round(this.ring*10)/10},
		x: null,
		y: null,
		log: function(){
			console.log("Ring: "+this.ringDez()+" ("+this.x+", "+this.y+")")
		}
	}

	if (data[2] == "1d") {
		shot.time = parseInt(data[3] + data[4] + data[5] + data[6], 16)
		// console.log("time: "+time)

		var x = parseInt(data[7] + data[8] + data[9] + data[10], 16)
		if (x > 2290649224) x = x - 4294967295
		shot.x = x
		console.log("x: "+x)

		var y = parseInt(data[11]+ data[12]+ data[13] + data[14], 16)
		if (y > 2290649224) y = y - 4294967295
		shot.y = y
		console.log("y: "+y)

		var diff = Math.pow((x*x + y*y), 0.5) / 1000// - scheibe.kugelDurchmesser/2
		console.log("diff: "+diff)



		for (var i in scheibe.ringe){
			var ringWidth = scheibe.ringe[i].width/2 + scheibe.kugelDurchmesser/2
			if (ringWidth >= diff) {
				var zehntel;
				if (i == 0) {
					zehntel = 0.9 - (diff / ringWidth) * 0.9
				}
				else {
					var ringPrevWidth = scheibe.ringe[i-1].width/2 + scheibe.kugelDurchmesser/2
					var delta = ringWidth - ringPrevWidth
					zehntel = 0.9 - ((diff - ringPrevWidth) / delta)*0.9
				}
				console.log("ring: "+scheibe.ringe[i].value+" Zehntel: "+zehntel)
				shot.ring = scheibe.ringe[i].value + zehntel
				break
			}
		}

		shot.log();
		return shot
	}
	else {
		console.log("no")
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

			var shot = getShotFromData(shotData, config.scheiben.lg)
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
		setInterval(esa.nop, 1000)
	}, 1000)


	return esa
}
