var express = require("express")
var http = require("http")
var fs = require('fs')
// var pdf = require('html-pdf')
var jade = require('jade')
var lessMiddleware = require('less-middleware')
var config = require("./config/index.js")
var app = express()

app.set('view engine', 'jade');
app.use("/js/", express.static("./assets/js"))
app.use("/libs/", express.static("./assets/libs"))
app.get("/", function(req, res){
	res.locals = {config: {stand: config.stand, version: config.version,}}
	res.render("index")
})
app.get("/print", function(req, res){
	res.locals = {sessions: [activeSession], config: {stand: config.stand, version: config.version,}}
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



// HELPER
function lastObject(array){
	return array[array.length-1]
}







var activeDisziplin
setDisziplin(config.disziplinen.all.demoLP)





var activeUser = {
	firstName: "Gast",
	lastName: "",
	verein: "",
	manschaft: "",
	stand: config.stand,
	version: config.version,
}





var activeData = {}
function setNewActiveData() {
	saveActiveData()

	activeData = {
		date: new Date().getTime(),
		sessionParts: [],
	}
}
setNewActiveData()


var getNewSession = function(partId){
	saveActiveSession()

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

	activeData.sessionParts.push(session)
	saveActiveData(activeData)

	return session
}


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
	io.emit('setSession', activeSession);

	saveActiveSession()
}


function saveActiveSession(){
	if (activeSession != undefined){
		activeData.sessionParts[activeData.sessionParts.length-1] = activeSession
		saveActiveData(activeData)
	}
}
function saveActiveData(activeData){
	if (database != undefined){
		collection = database.collection(config.database.collection)
		collection.save(activeData, function(err, results){

			console.log(err, results)

			if (results){
				if (results.ops){
					if (results.ops.length > 0){
						activeData._id = results.ops[0]._id
					}
				}
			}
		})
	}
	// collection.find().toArray(function(err, results) {
	// 	console.log(results)
	// })
}






io.on('connection', function(socket){
	console.log("user connect")

	io.emit('setSession', activeSession);
	io.emit('setConfig', {
		disziplinen: config.disziplinen,
		stand: config.stand,
		version: config.version,
	})

	socket.on('newTarget', function(socket){
		activeSession = getNewSession()

		io.emit('setSession', activeSession);
	})

	socket.on('setDisziplin', function(key){
		setDisziplin(config.disziplinen.all[key])

		activeSession = getNewSession()
		io.emit('setSession', activeSession);
	})

	socket.on('setSelectedSerie', function(selectedSerie){
		activeSession.selection.serie = parseInt(selectedSerie)
		activeSession.selection.shot = activeSession.serieHistory[activeSession.selection.serie].length-1
		io.emit('setSession', activeSession);
	})
	socket.on('setSelectedShot', function(selectedShot){
		activeSession.selection.shot = parseInt(selectedShot)
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
		if (partId != activeSession.type){

			var exitType = activeSession.disziplin.parts[activeSession.type].exitType
			if (exitType == "beforeFirst"){
				if (activeSession.serieHistory.length != 0) {
					return
				}
			}
			else if (exitType == "none"){
				return
			}

			var time = activeSession.time
			activeSession = getNewSession(partId)
			if (activeDisziplin.time.enabled == true){
				activeSession.time = time
			}

			io.emit('setSession', activeSession)
		}
	})



	socket.on('print', function(partId){
		// var fn = jade.compileFile('./views/print.jade', options);
		// var html = fn({sessions: [activeSession], config: {stand: config.stand, version: config.version,}});
		//
		// var options = {
		// 	format: 'A4',
		// 	border: {
		// 		top: "10mm",
		// 		right: "10mm",
		// 		bottom: "10mm",
		// 		left: "10mm",
		// 	},
		// };
		//
		// pdf.create(html, options).toFile('./print.pdf', function(err, res) {
		// 	if (err) return console.log(err);
		// 	console.log(res);
		// });
	})


})







var interf
function setDisziplin(disziplin){

	setNewActiveData()


	activeDisziplin = disziplin

	if (interf) {
		interf.stop()
	}

	interf = config.interface[disziplin.interface]
	interf = require(interf.path)(interf, disziplin)


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
