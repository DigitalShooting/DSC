var xor = require('bitwise-xor')

function telegram(data){
	var bytes = "55" + "01" + data
	var currenCksum = "54"
	data.match(/.{2}/g).forEach(function(byte){
		currenCksum = xor(new Buffer(currenCksum, 'hex'), new Buffer(byte, 'hex')).toString("hex")
	})
	return bytes + currenCksum + "AA"
}

console.log( telegram("170A") )
