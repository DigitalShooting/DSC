var express = require("express")
var http = require("http")
var fs = require('fs')
var jade = require('jade')
var child_process = require('child_process')
var lessMiddleware = require('less-middleware')
var config = require("./config/index.js")
var DSCDataAPI = require("./lib/DSCDataAPI.js")
var app = express()

app.set('view engine', 'jade');
app.use("/js/", express.static("./assets/js"))
app.use("/libs/", express.static("./assets/libs"))
app.get("/", function(req, res){
	res.locals = {config: {line: config.line, version: config.version,}}
	res.render("index")
})
app.get("/print", function(req, res){
	res.locals = {sessions: [dscDataAPI.getActiveSession()], config: {line: config.line, version: config.version,}}
	res.render("print")
})
app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

var server = http.Server(app)
var io = require('socket.io')(server);
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})

var database
var mongodb = require("./lib/mongodb")(function(db){
	database = db
})






var dscDataAPI = DSCDataAPI()

dscDataAPI.setUser({
	firstName: "Gast",
	lastName: "",
	verein: "",
	manschaft: "",
})

dscDataAPI.setDisziplin(config.disziplinen.all.lgTraining)

dscDataAPI.onDataChanged = function(){
	io.emit('setSession', dscDataAPI.getActiveSession());
	io.emit('setData', dscDataAPI.getActiveData())
}
dscDataAPI.onStatusChanged = function(connected){
	io.emit('setStatus', connected)
}




// perform callback if auth object ist valid
function checkAuth(auth, callback){
	if (config.auth.key == auth.key || config.auth.tempKey == auth.key){
		if (callback != undefined) callback()
	}
	else {
		console.log("[INFO] Wrong auth key")
	}
}



// socket stuff
io.on('connection', function(socket){

	// get/ set session
	socket.on('getSession', function(key){
		socket.emit('setSession', dscDataAPI.getActiveSession());
	})
	socket.emit('setSession', dscDataAPI.getActiveSession());


	// get/ set data
	socket.on('getData', function(key){
		socket.emit('setData', dscDataAPI.getActiveData())
	})
	socket.emit('setData', dscDataAPI.getActiveData())


	// get/ set config
	socket.on('getConfig', function(key){
		socket.emit('setConfig', {
			disziplinen: config.disziplinen,
			line: config.line,
			version: config.version,
		})
	})
	socket.emit('setConfig', {
		disziplinen: config.disziplinen,
		line: config.line,
		version: config.version,
	})


	// set new target
	socket.on('newTarget', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.newTarget()
		})
	})


	// set disziplin
	socket.on('setDisziplin', function(object){
		checkAuth(object.auth, function(){
			var key = object.disziplin
			dscDataAPI.setDisziplin(config.disziplinen.all[key])
		})
	})


	// selection
	socket.on('setSelectedSerie', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setSelectedSerie(object.index)
		})
	})
	socket.on('setSelectedShot', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setSelectedShot(object.index)
		})
	})


	// set user
	socket.on('setUser', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setUser(object.user)
		})
	});



	socket.on('setPart', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setPart(object.partId)
		})
	})



	socket.on('print', function(partId){
		checkAuth(object.auth, function(){
			child_process.exec(["xvfb-run -a -s '-screen 0 640x480x16' wkhtmltopdf http://127.0.0.1:3000/print --javascript-delay 10000 tmp.pdf"], function(err, out, code) {
				child_process.exec(["lp -d Printer1 tmp.pdf"], function(err, out, code) {
				});
			});
		})
	})



	// Returns the current temp token to manipulate the session
	socket.on('getTempToken', function(object){
		checkAuth(object.auth, function(){
			socket.emit("setTempToken", config.auth.tempKey)
		})
	})
})
