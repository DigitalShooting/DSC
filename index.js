var express = require("express")
var http = require("http")
var fs = require('fs')
var jade = require('jade')
var child_process = require('child_process')
var lessMiddleware = require('less-middleware')
var config = require("./config/index.js")
var app = express()

app.set('view engine', 'jade');
app.use("/js/", express.static("./assets/js"))
app.use("/libs/", express.static("./assets/libs"))
app.get("/", function(req, res){
	res.locals = {config: {line: config.line, version: config.version,}}
	res.render("index")
})
app.get("/print", function(req, res){
	res.locals = {sessions: [activeSession], config: {line: config.line, version: config.version,}}
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
setDisziplin(config.disziplinen.all.lgTraining)





var activeUser = {
	firstName: "Gast",
	lastName: "",
	verein: "",
	manschaft: "",
	line: config.line,
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





var setTimers = function(session){
	if (session != undefined){
		if (session.time.enabled == false){

			var time = {
				enabled: false,
			}
			if (activeDisziplin.time.enabled == true){
				if (activeDisziplin.time.instantStart == true || (activeDisziplin.time.instantStart == false && session.serieHistory.length != 0)){
					time.enabled = true
					time.end = (new Date()).getTime() + activeDisziplin.time.duration * 60 * 1000
					time.duration = activeDisziplin.time.duration
					time.type = "full"
				}
			}
			else {
				var part = activeDisziplin.parts[session.type]
				if (part.time.instantStart == true || (part.time.instantStart == false && session.serieHistory.length != 0) ){
					if (part.time.enabled == true){
						time.enabled = true
						time.end = (new Date()).getTime() + part.time.duration * 60 * 1000
						time.duration = part.time.duration
						time.type = "part"
					}
				}
			}

			session.time = time

		}
	}
	return session
}

var getNewSession = function(partId){
	saveActiveSession()

	if (partId == undefined){
		partId = Object.keys(activeDisziplin.parts)[0]
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
		time: {
			enabled: false,
		},
	}

	session = setTimers(session)

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


	// add first serie
	if (lastObject(session.serieHistory) == undefined) {
		session.serieHistory.push([])
	}

	// Count shots
	var anzahlShots = 0
	for (var i in session.serieHistory){
		anzahlShots += session.serieHistory[i].length
	}
	shot.number = anzahlShots+1


	if (part.serienLength == lastObject(session.serieHistory).length){
		session.serieHistory.push([shot])
	}
	else {
		lastObject(session.serieHistory).push(shot)
	}

	session.selection.serie = session.serieHistory.length-1
	session.selection.shot = session.serieHistory[session.selection.serie].length-1

	session = setTimers(session)

	io.emit('newShot', shot);
	io.emit('setSession', activeSession);
	io.emit('setData', activeData)

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

			if (results){
				if (results.ops){
					if (results.ops.length > 0){
						activeData._id = results.ops[0]._id
					}
				}
			}
		})
	}
}






io.on('connection', function(socket){
	socket.on('getSession', function(key){
		socket.emit('setSession', activeSession);
	})
	socket.emit('setSession', activeSession);

	socket.on('getData', function(key){
		socket.emit('setData', activeData)
	})
	socket.emit('setData', activeData)

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



	socket.on('newTarget', function(socket){
		if (activeSession.serieHistory.length == 0){
			return
		}

		activeSession = getNewSession(activeSession.type)

		io.emit('setSession', activeSession);
		io.emit('setData', activeData)
	})

	socket.on('setDisziplin', function(key){
		setDisziplin(config.disziplinen.all[key])

		activeSession = getNewSession()
		io.emit('setSession', activeSession);
		io.emit('setData', activeData)
	})

	socket.on('setSelectedSerie', function(selectedSerie){
		activeSession.selection.serie = parseInt(selectedSerie)
		activeSession.selection.shot = activeSession.serieHistory[activeSession.selection.serie].length-1
		io.emit('setSession', activeSession);
		io.emit('setData', activeData)
	})
	socket.on('setSelectedShot', function(selectedShot){
		activeSession.selection.shot = parseInt(selectedShot)
		io.emit('setSession', activeSession);
		io.emit('setData', activeData)
	})

	socket.on('setUser', function(user){
		// activeUser = {
		// 	firstName: user.vorname,
		// 	lastName: user.name,
		// 	verein: user.verein,
		// 	manschaft: user.manschaft,
		// }

		activeSession.user = user
		io.emit('setSession', activeSession)
		io.emit('setData', activeData)
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


			interf.band()

			var time = activeSession.time

			activeSession = undefined
			for (var i = activeData.sessionParts.length-1; i >= 0; i--){
				var session = activeData.sessionParts[i]
				if (session.type == partId){
					activeSession = session
					break
				}
			}
			if (activeSession == undefined){
				activeSession = getNewSession(partId)
			}


			if (activeDisziplin.time.enabled == true){
				activeSession.time = time
			}
			else if (activeSession.time.type != "full"){
				activeSession.time = {
					enabled: false,
				}
			}

			activeSession = setTimers(activeSession)

			saveActiveSession()

			io.emit('setSession', activeSession)
			io.emit('setData', activeData)
		}
	})



	socket.on('print', function(partId){
		child_process.exec(["xvfb-run -a -s '-screen 0 640x480x16' wkhtmltopdf http://127.0.0.1:3000/print --javascript-delay 10000 tmp.pdf"], function(err, out, code) {
			child_process.exec(["lp -d Printer1 tmp.pdf"], function(err, out, code) {
				// console.log(err, out, code)
			});
		});
		// child_process.exec(["wkhtmltopdf http://127.0.0.1:3000/print --javascript-delay 10000 tmp.pdf"], function(err, out, code) {
		//
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






/*
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600, "node-integration": false});

	// and load the index.html of the app.
	mainWindow.loadUrl('http://127.0.0.1:3000');

	// Open the devtools.
	mainWindow.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
});
*/
