var SerialPort = require("serialport").SerialPort

var api = {
	nop: function() {
		return "55010054aa"
	},
	uploadAnfrage: function() {
		return "5501130059aa"
	},
	settings: function() {
		return "55011405fa1403090d084f010101011edc0190b8aa"
	},
	serviceMode: function() {
		return telegram("1500")
	},
	move: function() {
		return "5501171053aa" // 5501179adbaa
	}
}



var sendData = function(hex, callback){
	//console.log(hex)
	var buffer = new Buffer(hex, "hex");
	sp.write(buffer, function(err, results) {
		if (callback) callback(err, results)
		if (err) console.log('err ' + err);
		console.log('results ' + results + "("+buffer.toString("hex")+")");
	});
}
var reciveData = function(data){
	var buffer = new Buffer(data, "hex");
	var byte = buffer.toString("hex")
	console.log(byte)
}


var sp = new SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	//parser: parsers.raw,
	databits : 8,
	stopbits: 1, // 2
	//parity: 'none', // 'none' 'even' 'mark' 'odd' 'space'
	bufferSize: 255 // 255
});

sp.on("open", function () {
	console.log('open');

	setTimeout(function() {
	// sendData("5500200000000673aa", function(){
		sendData("5500200000000673aaffffffffffffff")
		sendData("55011405fa1403090d084f000000001edc0190b8aaffffff")
		sendData("5501130059aaffff")
		sendData("5501171053aaffff")
	// })
}, 1000)
	// setTimeout(function() {
	// 	sendData("5500200000000673aa")
	// },100);
	// setTimeout(function() {
	// 	sendData(api.settings())
	// },0);
	// setTimeout(function() {
	// 	sendData(api.uploadAnfrage())
	// },500);
	// setTimeout(function() {
	// 	sendData(api.nop())
	// },750);
	// setTimeout(function() {
	// 	sendData(api.nop())
	// },250);
	// setTimeout(function() {
	// 	sendData(api.move())
	// 	sendData(api.move())
	// },850);

});
sp.on('data', function(data) {
	reciveData(data)
});
