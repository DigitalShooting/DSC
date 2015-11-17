var express = require("express")
var http = require("http")
var https = require("https")
var fs = require('fs')
var jade = require('jade')
var child_process = require('child_process')
var lessMiddleware = require('less-middleware')
var config = require("./config/index.js")
var DSCDataAPI = require("./lib/DSCDataAPI.js")
var Print = require("./print/print.js")
var app = express()

// jade
app.set('view engine', 'jade');

// asset routes
app.use("/js/", express.static("./assets/js"))
app.use("/libs/", express.static("./assets/libs"))
app.use("/favicon.ico", express.static("./assets/img/favicon.ico"))
app.use("/logo.png", express.static(config.line.hostVerein.logoPath))

app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

// main route
app.get("/", function(req, res){
	res.locals = {
		config: {
			line: config.line,
		}
	}
	res.render("index")
})

// print page
app.get("/print", function(req, res){
	res.locals = {
		config: {
			line: config.line
		}
	}
	res.render("print")
})



// Init HTTP/ HTTPs
var server
if (config.network.https.enabled){
	var options = {
		key: fs.readFileSync(config.network.https.keyPath),
		cert: fs.readFileSync(config.network.https.crtPath),
	}
	server = https.createServer(options, app);
}
else {
	server = http.Server(app)
}



// Init server on port and socket.io
var io = require('socket.io')(server);
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('[INFO] Express server started on at %s:%s', server.address().address, server.address().port)
})



// dsc api init
var dscDataAPI = DSCDataAPI()

// set default user
dscDataAPI.setUser({
	firstName: "Gast",
	lastName: "",
	verein: "",
	manschaft: "",
})

// set default disziplin
dscDataAPI.setDisziplin(config.disziplinen.defaultDisziplin)

// listen to dsc api events
dscDataAPI.on = function(event){
	if (event.type == "dataChanged"){
		io.emit('setSession', dscDataAPI.getActiveSession());
		io.emit('setData', dscDataAPI.getActiveData())
	}
	else if (event.type == "statusChanged"){
		io.emit('setStatus', event.connected)
	}
	else if (event.type == "alertTimeOverShot"){
		io.emit('info', {
			title: "Zeit ist abgelaufen",
			text: "Der Schuss wurde nach Ablauf der Zeit abgegeben.",
		})
	}
	else if (event.type == "alertShotLimit"){
		io.emit('info', {
			title: "Alle Schüsse abgegeben",
			text: "Es wurden bereits alle Schüsse abgegeben.",
		})
	}
	else if (event.type == "exitTypeWarning_beforeFirst"){
		io.emit('info', {
			title: "Wechsel nicht möglich",
			text: "Ein Wechsel ist nur vor dem erstem Schuss erlaubt.",
		})
	}
	else if (event.type == "exitTypeWarning_none"){
		io.emit('info', {
			title: "Wechsel nicht möglich",
			text: "Ein Wechsel ist nicht erlaubt.",
		})
	}
}

// helper to perform callback if auth object ist valid
function checkAuth(auth, callback){
	if (config.auth.key == auth.key || config.auth.tempKey == auth.key){
		if (callback != undefined) callback()
	}
	else {
		console.log("[INFO] Wrong auth key")
	}
}

// Store the activeMessage object to push it to new clients
var activeMessage = undefined



// socket stuff
io.on('connection', function(socket){

	// set about
	socket.emit('setAbout', config.about);

	if (activeMessage != undefined){
		socket.emit('showMessage', {
			type: activeMessage.type,
			title: activeMessage.title,
		});
	}


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
		})
	})
	socket.emit('setConfig', {
		disziplinen: config.disziplinen,
		line: config.line,
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



	socket.on('print', function(object){
		checkAuth(object.auth, function(){
			io.emit('info', {
				title: "Druckauftrag wird bearbeitet...",
				text: "Der Ausdruck wird erstellt.",
			})

			console.log(dscDataAPI.getActiveData())
			Print(dscDataAPI.getActiveData())

			io.emit('info', {
				title: "Drucken erfolgreich",
				text: "Der Ausdruck wurde erstellt.",
			})


			// child_process.exec(["xvfb-run -a -s '-screen 0 640x480x16' wkhtmltopdf http://127.0.0.1:3000/print --javascript-delay 10000 tmp.pdf"], function(err, out, code) {
			// 	child_process.exec(["lp -d Printer1 tmp.pdf"], function(err, out, code) {
			// 		if (err){
			// 			io.emit('info', {
			// 				title: "Drucken fehlgeschlagen.",
			// 				text: "Beim erstellen des Ausdruck ist ein Fehler aufgetreten. ("+err+")",
			// 			})
			// 		}
			// 		else {
			// 			io.emit('info', {
			// 				title: "Drucken erfolgreich",
			// 				text: "Der Ausdruck wurde erstellt.",
			// 			})
			// 		}
			// 	});
			// });
		})
	})



	// Returns the current temp token to manipulate the session
	socket.on('getTempToken', function(object){
		checkAuth(object.auth, function(){
			socket.emit("setTempToken", config.auth.tempKey)
		})
	})




	socket.on("showMessage", function(object){
		checkAuth(object.auth, function(){
			activeMessage = object
			io.emit('showMessage', {
				type: object.type,
				title: object.title,
			});
		})
	})
	socket.on("hideMessage", function(object){
		checkAuth(object.auth, function(){
			activeMessage = undefined
			io.emit('hideMessage', {})
		})
	})


})
