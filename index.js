var express = require("express")
var http = require("http")
var config = require("./config.js")
var esa = require("./lib/esa.js")()

var app = express()

console.log("test")

app.set('view engine', 'jade');


app.get("/band", function(req, res){
	esa.sendData(esa.seq.move)
	console.log(esa.seq.move)
	res.render("band")
})

app.get("/", function(req, res){
	res.render("index")
})


var server = http.Server(app)
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})
