var express = require("express")
var http = require("http")

var config = require("./config.js")
var esa = require("./lib/esa.js")()

var app = express()

app.set('view engine', 'jade');


app.use("/js/", express.static("./assets/js"))




app.get("/", function(req, res){
	res.render("index")
})










var server = http.Server(app)
var io = require('socket.io')(server);
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})




io.on('connection', function(socket){
	console.log('a user connected');

	io.emit('some event', { for: 'everyone' });
});


esa.onNewData = function(data){
	//io.emit('some event', { hello: 'world' });

	io.emit('newData', data);
}
