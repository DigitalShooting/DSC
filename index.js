var express = require("express")
var http = require("http")
var expressLess = require('express-less')

var config = require("./config/index.js")
// var esa = require("./lib/esa.js")()
var esa = require("./lib/esaTesting.js")()

var app = express()

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















// session: enthält alle daten
var session = {
	// user object
	user: {
		firstName: "Max",
		lastName: "Mustermann",
		verein: "SV Diana Dettingen",
		manschaft: "Manschaft 1",
	},

	// type: art des modus (probe/ match) DEPRICATED
	type: "probe",

	// disziplin: art des modes
	disziplin: config.disziplinen.lgTraining,

	// shots: schüsse
	shots: [

	],

	serie: [],
	serieHistory: [],
}
// var sessions = {
// 	{type: "probe", session: session},
// 	{type: "match", session: session},
// }



function newShot(shot){
	session.shots.push(shot)

	var disziplin = session.disziplin
	if (disziplin.serienLength == session.serie.length){
		session.serieHistory.push(session.serie)
		session.serie = [shot]
	}
	else {
		session.serie.push(shot)
	}

	console.log(shot)
	io.emit('shot.new', shot);
}






io.on('connection', function(socket){
	console.log('a user connected');

	io.emit('init', session);
});


esa.onNewShot = function(shot){
	// io.emit('shot.new', data);
	newShot(shot)
}
esa.onNewData = function(data){
	//io.emit('some event', { hello: 'world' });
	console.log(data)
}
