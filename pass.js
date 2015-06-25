var SerialPort = require("serialport")
var serialport = SerialPort.SerialPort
var sp = new serialport("/Users/firebug/Desktop/port", {
	baudrate: 9600,
	parser: SerialPort.parsers.raw,
	bufferSize: 10
});

var spD = new serialport("/dev/tty.usbserial", {
	baudrate: 9600,
	parser: SerialPort.parsers.raw,
	bufferSize: 10
});


setInterval(function(){ console.log(''); }, 1000);


sp.on("open", function () {
	console.log('open');

	spD.on("open", function () {
		console.log('open');

		sp.on('data', function(data) {
			var buffer = new Buffer(data, "hex");
			var byte = buffer.toString("hex")
			console.log(byte)

			spD.write(data, function(err, results) {
				console.log('err ' + err);
				console.log('results ' + results);
			});
		});

	});

});
