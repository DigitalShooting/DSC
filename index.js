var express = require("express")
var http = require("http")
var expressLess = require('express-less')
var config = require("./config/index.js")
var app = express()

// var esa = require("./lib/esa.js")()
var esa = require("./lib/esaTesting.js")()

app.set('view engine', 'jade');
app.use("/js/", express.static("./assets/js"))
app.get("/", function(req, res){
	res.render("index")
})
app.use("/css/", expressLess(__dirname + "/stylesheets"))

var server = http.Server(app)
var io = require('socket.io')(server);
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})








var getNewSession = function(){
	return {
		user: {
			firstName: "Max",
			lastName: "Mustermann",
			verein: "SV Diana Dettingen",
			manschaft: "Manschaft 1",
		},

		type: "probe",

		disziplin: config.disziplinen.lgWettkampf,

		serie: [],
		serieHistory: [],
	}
}

// var sessions = [
// 	session,
// ]

var activeSession = getNewSession()



function newShot(session, shot){
	var disziplin = activeSession.disziplin
	if (disziplin.serienLength == session.serie.length){
		session.serieHistory.push(session.serie)
		session.serie = [shot]
	}
	else {
		session.serie.push(shot)
	}

	console.log(shot)

	io.emit('newShot', shot);
}




io.on('connection', function(socket){
	io.emit('setSession', activeSession);
	io.emit('setConfig', {
		disziplinen: config.disziplinen,
		stand: config.stand
	});

	socket.on('newTarget', function(socket){
		activeSession = getNewSession()

		io.emit('setSession', activeSession);
	});
	socket.on('switchToMatch', function(socket){
		activeSession = getNewSession()
		activeSession.type = "match"

		io.emit('setSession', activeSession);
	});

});



esa.onNewShot = function(shot){
	newShot(activeSession, shot)
}
esa.onNewData = function(data){
	console.log(data)
}
