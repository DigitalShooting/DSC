var SerialPort = require("serialport").SerialPort
var config = require("../config.js")
var xor = require('bitwise-xor')


function telegram(data){
	var bytes = "55" + "01" + data
	var currenCksum = "54"
	data.match(/.{2}/g).forEach(function(byte){
		currenCksum = xor(new Buffer(currenCksum, 'hex'), new Buffer(byte, 'hex')).toString("hex")
	})
	return bytes + currenCksum + "AA"
}



// STX ADD (data) Chksum ETX
function telegram(data){
	xor(new Buffer('00ff', 'hex'), new Buffer('3344', 'hex'))

	str.match(/.{1,3}/g)
	var bytes = "55" + "01" + data

	return bytes
}

// echo $'\xff\x55\x01\x17\x02\x41\xaa\xff\xff' > /dev/ttyUSB0

module.exports = function(){
	var sp = new SerialPort(config.esa.com, {
		baudrate: 9600,
		//parser: parsers.raw,
		databits : 8,
		stopbits: 1, // 2
		parity: 'none', // 'none' 'even' 'mark' 'odd' 'space'
		bufferSize: 255 // 255
	});

	sp.on("open", function () {
		console.log('open');

		sendData(telegram("170A"))
	});
	sp.on('data', function(data) {
		esa.reciveData(data)
	});

	var sendData = function(hex, callback){
		var buffer = new Buffer(hex, "hex");
		sp.write(buffer, function(err, results) {
			if (callback) callback(err, results)
			if (err) console.log('err ' + err);
			console.log('results ' + results);
		});
	}



	var esa = {}
	esa.seq = seq

	esa.sendData = function(hex){
		sendData(hex)
	}

	setInterval(function(){
		console.log()
	}, 1000);

	// Overwrite this method
	esa.reciveData = function(data){
		var buffer = new Buffer(data, "hex");
		var byte = buffer.toString("hex")
		console.log(byte)
	}

	return esa
}
