var SerialPort = require("serialport").SerialPort
var config = require("../config.js")

// var seq = {
// 	init : "5501130047aa",
// 	move : "5501170241aa",
// 	refresh : "5501130047aa",
// 	start : "FF5500200000000673AAFFFFFF55011405FA1403090D084F000000001EDC0190B8AAFFFFFF5501130047AAFFFF"
// }
var seq = {
	init : "FF55010054AAFFFF", // FF55010054AAFFFF
	move : "FF5501170340AAFFFFFF5501170340AAFFFF", // FF5501170241AAFFFF   /   FF5501170340AAFFFF
	refresh : "FF5501130047AAFFFF",
	start : "FF5500200000000673AAFFFFFF55011405FA1403090D084F000000001EDC0190B8AAFFFFFF5501130047AAFFFF",
}

// echo $'\xff\x55\x01\x17\x02\x41\xaa\xff\xff' > /dev/ttyUSB0

module.exports = function(){
	var sp = new SerialPort(config.esa.com, {
		baudrate: 9600,
		//parser: parsers.raw,
		databits : 8,
		stopbits: 1, // 2
		parity: 'even', // 'none' 'even' 'mark' 'odd' 'space'
		bufferSize: 255 // 255
	});

	sp.on("open", function () {
		console.log('open');

		sendData(seq.start)
		setInterval(function(){
			sendData(seq.init)
		}, 1000);
		setInterval(function(){
			sendData(seq.start)
		}, 10000);
		setInterval(function(){
			sendData(seq.move)
		}, 5000);

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
