var SerialPort = require("serialport").SerialPort
var config = require("../config.js")
var xor = require('bitwise-xor')


function telegram(data){
	var bytes = "55" + "01" + data
	var currenCksum = "54" // 54 fpr add 01
	data.match(/.{2}/g).forEach(function(byte){
		currenCksum = xor(new Buffer(currenCksum, 'hex'), new Buffer(byte, 'hex')).toString("hex")
		console.log(currenCksum + " " + byte)
	})
	console.log(bytes + currenCksum + "AA")
	return "" + bytes + currenCksum + "AA" + ""
}

var api = {
	nop: function() {
		return "55010054aa"
		// return telegram("00")
	},
	uploadAnfrage: function() {
		return "5501130059aa"
	},
	settings: function() {
		return "55011405fa1403090d084f000000001edc0190b8aa"
		// var gain = "05"
		// var lotime = "FA"
		// var threshold = "14"
		// var motor = "03"
		// var ddh = "09"
		// var ddl = "0D"
		// var dsh = "08"
		// var dsl = "4F"
		// var xclah = "00"
		// var xclal = "00"
		// var ycalh = "00"
		// var ycall = "00"
		// var tkh = "1E"
		// var tkl = "DC"
		// var tfixh = "01"
		// var tfixl = "90"
		// return telegram("14"+gain+lotime+threshold+motor+ddh+ddl+dsh+dsl+xclah+xclal+ycalh+ycall+tkh+tkl+tfixh+tfixl)
	},
	serviceMode: function() {
		return telegram("1500")
	},
	move: function() {
		return "5501179adbaa"
		// return telegram("170A")
	}
}





// echo $'\xff\x55\x01\x17\x02\x41\xaa\xff\xff' > /dev/ttyUSB0

module.exports = function(){
	var sp = new SerialPort(config.esa.com, {
		baudrate: 9600,
		//parser: parsers.raw,
		databits : 8,
		stopbits: 1, // 2
		parity: 'none', // 'none' 'even' 'mark' 'odd' 'space'
		bufferSize: 1 // 255
	});

	sp.on("open", function () {
		console.log('open');

		setTimeout(function() {
			sendData("5500200000000673aa")
		},100);
		setTimeout(function() {
			sendData(api.settings())
		},0);
		setTimeout(function() {
			sendData(api.uploadAnfrage())
		},500);
		// setTimeout(function() {
		// 	sendData(api.nop())
		// },750);
		// setTimeout(function() {
		// 	sendData(api.nop())
		// },250);

		setTimeout(function() {
			sendData(api.move())
			sendData(api.move())
		},850);

	});
	sp.on('data', function(data) {
		esa.reciveData(data)
	});

	var sendData = function(hex, callback){
		// var buffer = new Buffer(hex)
		var buffer = new Buffer(hex, "hex");
		sp.write(buffer, function(err, results) {
			if (callback) callback(err, results)
			if (err) console.log('err ' + err);
			console.log('results ' + results);
		});
	}

	var esa = {}
	esa.sendData = function(hex){
		sendData(hex)
	}

	// setInterval(function(){
	// 	console.log()
	// }, 1000);

	// Overwrite this method
	esa.reciveData = function(data){
		var buffer = new Buffer(data, "hex");
		var byte = buffer.toString("hex")
		console.log(byte)
	}

	return esa
}
