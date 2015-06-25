var SerialPort = require("serialport")
var serialport = SerialPort.SerialPort
var sp = new serialport("/Users/firebug/Desktop/port23", {
	baudrate: 9600,
	parser: SerialPort.parsers.raw,
	bufferSize: 10
});

setInterval(function(){ console.log(''); }, 1000);


sp.on("open", function () {
	console.log('open');

	setInterval(function(){
		var buffer = new Buffer("5501085CAA", "hex");
		sp.write(buffer, function(err, results) {
			console.log('err ' + err);
			console.log('results ' + results);
		})
	}, 500);


});


sp.on('data', function(data) {
	var buffer = new Buffer(data, "hex");
	var byte = buffer.toString("hex")
	console.log(byte)
});
