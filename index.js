var express = require("express");
var http = require("http");
var https = require("https");
var fs = require('fs');
var jade = require('jade');
var child_process = require('child_process');
var lessMiddleware = require('less-middleware');
var config = require("./config/index.js");
var DSCDataAPI = require("./lib/DSCDataAPI.js");
var Print = require("./lib/print/");
var proxy = require("express-http-proxy");
var app = express();

// jade
app.set('view engine', 'jade');

// asset routes
app.use("/js/", express.static("./assets/js"));
app.use("/libs/", express.static("./assets/libs"));
app.use("/favicon.ico", express.static("./assets/img/favicon.ico"));
app.use("/logo.png", express.static(config.line.hostVerein.logoPath));

app.use("/css/", lessMiddleware(__dirname + "/stylesheets"));
app.use("/css/", express.static(__dirname + "/stylesheets"));

// main route
app.use("*", function(req, res, next){
	res.locals = {
		config: {
			line: config.line,
		}
	};
	next();
});

// start api and map to /api
var api = require("./lib/api.js");
app.use('/api/', proxy("127.0.0.1:" + config.network.api.port, {
	forwardPath: function(req, res) {
		return require('url').parse(req.url).path;
	}
}));

// default page
app.get("/", function(req, res, next){
	res.render("index");
});

// log page
app.get("/log", function(req, res){
	res.render("log");
});



// Init server on port and socket.io
var server = http.Server(app);
var io = require("socket.io")(server);
server.listen(config.network.dsc.port, config.network.dsc.address);
server.on("listening", function() {
	console.log("[INFO] DSC started (%s:%s)", server.address().address, server.address().port);
});



// dsc api init
var dscDataAPI = DSCDataAPI();

// set default user
dscDataAPI.setUser({
	firstName: "Gast",
	lastName: "",
	verein: "",//config.line.hostVerein.name,
	manschaft: "",
});

// set default disziplin
dscDataAPI.setDisziplin(config.disziplinen.defaultDisziplin);

// listen to dsc api events
dscDataAPI.on = function(event){
	if (event.type == "dataChanged"){
		io.emit('setSession', dscDataAPI.getActiveSession());
		io.emit('setData', dscDataAPI.getActiveData());
	}
	else if (event.type == "statusChanged"){
		io.emit('setStatus', event.connected);
	}
	else if (event.type == "alertTimeOverShot"){
		io.emit('info', {
			title: "Zeit ist abgelaufen",
			text: "Der Schuss wurde nach Ablauf der Zeit abgegeben.",
		});
	}
	else if (event.type == "alertShotLimit"){
		io.emit('info', {
			title: "Alle Schüsse abgegeben",
			text: "Es wurden bereits alle Schüsse abgegeben.",
		});
	}
	else if (event.type == "exitTypeWarning_beforeFirst"){
		io.emit('info', {
			title: "Wechsel nicht möglich",
			text: "Ein Wechsel ist nur vor dem erstem Schuss erlaubt.",
		});
	}
	else if (event.type == "exitTypeWarning_none"){
		io.emit('info', {
			title: "Wechsel nicht möglich",
			text: "Ein Wechsel ist nicht erlaubt.",
		});
	}
};

// helper to perform callback if auth object ist valid
function checkAuth(auth, callback){
	if (config.auth.key == auth.key || config.auth.tempKey == auth.key){
		if (callback != undefined) callback();
	}
	else {
		console.log("[INFO] Wrong auth key");
	}
}


var activeMessage;


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
	});
	socket.emit('setSession', dscDataAPI.getActiveSession());


	// get/ set data
	socket.on('getData', function(key){
		socket.emit('setData', dscDataAPI.getActiveData());
	});
	socket.emit('setData', dscDataAPI.getActiveData());


	// get/ set config
	socket.on('getConfig', function(key){
		socket.emit('setConfig', {
			disziplinen: config.disziplinen,
			line: config.line,
		});
	});
	socket.emit('setConfig', {
		disziplinen: config.disziplinen,
		line: config.line,
	});


	// set new target
	socket.on('newTarget', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.newTarget();
		});
	});


	// set disziplin
	socket.on('setDisziplin', function(object){
		checkAuth(object.auth, function(){
			var key = object.disziplin;
			dscDataAPI.setDisziplin(config.disziplinen.all[key]);
		});
	});


	// selection
	socket.on('setSelectedSerie', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setSelectedSerie(object.index);
		});
	});
	socket.on('setSelectedShot', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setSelectedShot(object.index);
		});
	});


	// set user
	socket.on('setUser', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setUser(object.user);
		});
	});



	socket.on('setPart', function(object){
		checkAuth(object.auth, function(){
			dscDataAPI.setPart(object.partId);
		});
	});



	socket.on('print', function(object){
		checkAuth(object.auth, function(){
			io.emit('info', {
				title: "Druckauftrag wird bearbeitet...",
				text: "Der Ausdruck wird erstellt.",
			});

			Print(dscDataAPI.getActiveData(), function(err){
				if (err){
					io.emit('info', {
						title: "Drucken fehlgeschlagen.",
						text: "Beim erstellen des Ausdruck ist ein Fehler aufgetreten. ("+err+")",
					});
				}
				else {
					io.emit('info', {
						title: "Drucken erfolgreich",
						text: "Der Ausdruck wurde erstellt.",
					});
				}
			});
		});
	});



	// Returns the current temp token to manipulate the session
	socket.on('getTempToken', function(object){
		checkAuth(object.auth, function(){
			socket.emit("setTempToken", config.auth.tempKey);
		});
	});




	socket.on("showMessage", function(object){
		checkAuth(object.auth, function(){
			activeMessage = object;
			io.emit('showMessage', {
				type: object.type,
				title: object.title,
			});
		});
	});
	socket.on("hideMessage", function(object){
		checkAuth(object.auth, function(){
			activeMessage = undefined;
			io.emit('hideMessage', {});
		});
	});




	socket.on("shutdown", function(object){
		checkAuth(object.auth, function(){
			child_process.exec(["'sudo shutdown -h now'"], function(err, out, code) { });
		});
	});


});
