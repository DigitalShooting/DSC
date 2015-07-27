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




// HELPER
function lastObject(array){
	return array[array.length-1]
}







var activeDisziplin = config.disziplinen.lgTraining
var activeUser = {
	firstName: "Max",
	lastName: "Mustermann",
	verein: "SV Diana Dettingen",
	manschaft: "Manschaft 1",
}

var getNewSession = function(){
	return {
		user: activeUser,
		type: "probe",
		disziplin: activeDisziplin,
		serieHistory: [],
		selection: {
			serie: 0,
			shot: 0,
		}
	}
}

// var sessions = [
// 	session,
// ]

var activeSession = getNewSession()



function newShot(session, shot){
	var disziplin = session.disziplin

	if (lastObject(session.serieHistory) == undefined) {
		session.serieHistory.push([])
	}

	if (disziplin.serienLength == lastObject(session.serieHistory).length){
		session.serieHistory.push([shot])
	}
	else {
		lastObject(session.serieHistory).push(shot)
	}

	session.selection.serie = session.serieHistory.length-1
	session.selection.shot = session.serieHistory[session.selection.serie].length-1













	//console.log(shot)

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

	socket.on('setDisziplin', function(key){
		activeDisziplin = config.disziplinen[key]

		activeSession = getNewSession()
		io.emit('setSession', activeSession);
	});

	socket.on('setSelectedSerie', function(selectedSerie){
		activeSession.selection.serie = selectedSerie
		activeSession.selection.shot = activeSession.serieHistory[activeSession.selection.serie].length-1
		io.emit('setSession', activeSession);
	});
	socket.on('setSelectedShot', function(selectedShot){
		activeSession.selection.shot = selectedShot
		io.emit('setSession', activeSession);
	});

	socket.on('setUserGast', function(){
		activeUser = {
			firstName: "Gast",
			lastName: "",
			verein: "",
			manschaft: "",
		}

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
