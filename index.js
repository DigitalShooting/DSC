var express = require("express")
var http = require("http")
var lessMiddleware = require('less-middleware')
var config = require("./config/index.js")
var app = express()

app.set('view engine', 'jade');
app.use("/js/", express.static("./assets/js"))
app.get("/", function(req, res){
	res.render("index")
})
app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

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







var activeDisziplin
setDisziplin(config.disziplinen.demo)

var activeUser = {
	firstName: "Gast",
	lastName: "",
	verein: "",
	manschaft: "",
}

var getNewSession = function(partId){

	if (partId == undefined){
		partId = activeDisziplin.partsOrder[0]
	}


	var time = {
		enabled: false,
	}
	if (activeDisziplin.time.enabled == true){
		time.enabled = activeDisziplin.time.enabled
		time.end = (new Date()).getTime() + activeDisziplin.time.duration * 60 * 1000
		time.duration = activeDisziplin.time.duration
	}
	else {
		var part = activeDisziplin.parts[partId]
		if (part.time.enabled == true){
			time.enabled = part.time.enabled
			time.end = (new Date()).getTime() + part.time.duration * 60 * 1000
			time.duration = part.time.duration
		}
	}

	var session = {
		user: activeUser,
		type: partId,
		disziplin: activeDisziplin,
		serieHistory: [],
		selection: {
			serie: 0,
			shot: 0,
		},
		time: time,
	}


	return session
}

// var sessions = [
// 	session,
// ]

var activeSession = getNewSession()




function newShot(session, shot){
	var disziplin = session.disziplin
	var part = session.disziplin.parts[session.type]


	var date = (session.time.end - (new Date().getTime()))/1000
	if (date < 0){
		console.log("WARNING [Time over]")
		io.emit('info', {
			type: "warning",
			title: "Zeit abgelaufen",
			text: "Der Schuss wird nicht gewertet.",
		});
		return
	}


	var anzahl = 0
	for(i in session.serieHistory){
		anzahl += session.serieHistory[i].length
	}
	if (part.anzahlShots <= anzahl && part.anzahlShots != 0){
		console.log("WARNING [Max shot limit]")
		io.emit('info', {
			type: "warning",
			title: "Schusslimit erreicht",
			text: "Es wurden bereits alle Schüsse abgegeben.",
		});
		return
	}




	if (lastObject(session.serieHistory) == undefined) {
		session.serieHistory.push([])
	}

	if (part.serienLength == lastObject(session.serieHistory).length){
		session.serieHistory.push([shot])
	}
	else {
		lastObject(session.serieHistory).push(shot)
	}

	session.selection.serie = session.serieHistory.length-1
	session.selection.shot = session.serieHistory[session.selection.serie].length-1

	io.emit('newShot', shot);
}






io.on('connection', function(socket){
	io.emit('setSession', activeSession);
	io.emit('setConfig', {
		disziplinen: config.disziplinen,
		stand: config.stand
	})

	socket.on('newTarget', function(socket){
		activeSession = getNewSession()

		io.emit('setSession', activeSession);
	})

	socket.on('setDisziplin', function(key){
		setDisziplin(config.disziplinen[key])

		activeSession = getNewSession()
		io.emit('setSession', activeSession);
	})

	socket.on('setSelectedSerie', function(selectedSerie){
		activeSession.selection.serie = selectedSerie
		activeSession.selection.shot = activeSession.serieHistory[activeSession.selection.serie].length-1
		io.emit('setSession', activeSession);
	})
	socket.on('setSelectedShot', function(selectedShot){
		activeSession.selection.shot = selectedShot
		io.emit('setSession', activeSession);
	})

	socket.on('setUserGast', function(){
		activeUser = {
			firstName: "Gast",
			lastName: "",
			verein: "",
			manschaft: "",
		}

		activeSession = getNewSession()
		io.emit('setSession', activeSession)
	});
	socket.on('setUser', function(user){
		activeUser = {
			firstName: user.vorname,
			lastName: user.name,
			verein: user.verien,
			manschaft: user.manschaft,
		}

		activeSession.user = activeUser
		io.emit('setSession', activeSession)
	});



	socket.on('switchToPart', function(partId){
		var time = activeSession.time
		activeSession = getNewSession(partId)
		if (activeDisziplin.time.enabled == true){
			activeSession.time = time
		}

		io.emit('setSession', activeSession)
	})


})







var interf
function setDisziplin(disziplin){
	activeDisziplin = disziplin

	if (interf) {
		interf.stop()
	}

	interf = config.interface[disziplin.interface]
	interf = require(interf.path)(interf)


	interf.onNewShot = function(shot){
		newShot(activeSession, shot)
	}
	interf.onNewData = function(data){
		console.log(data)
	}
	interf.onNewStatus = function(connected){
		io.emit('setStatus', connected)
	}
}
