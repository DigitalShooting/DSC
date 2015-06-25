var SerialPort = require("serialport")
var serialport = SerialPort.SerialPort
var sp = new serialport("/Users/firebug/Desktop/port23", {
	baudrate: 9600,
	parser: SerialPort.parsers.raw,
	bufferSize: 1
});


setInterval(function(){ console.log(''); }, 1000);


sp.on("open", function () {
	console.log('open');

	sp.on('data', function(data) {
		var buffer = new Buffer(data, "hex");
		var byte = buffer.toString("hex")
		console.log(byte)
	});

});
