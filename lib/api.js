var mysql = require("./mysql.js");
var restify = require('restify');
var config = require("../config/");
var fs = require('fs');

var server = restify.createServer({
	name: 'DSC-API',
});
server.listen(config.network.api.port, config.network.api.address);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());



// sessionGroup
server.get('/sessionGroup', function(req, res, next){
	var query = {
		after: "",
	}

	if (req.query.after != undefined){
		query.after = "AND " + mysql.escape(parseInt(req.query.after )) + " <= UNIX_TIMESTAMP(date)"
	}

	mysql.query(
		"SELECT * " +
		"FROM sessionGroup " +
		"WHERE 1 = 1 " +
		query.after,
		function(err, rows) {
			return res.send(201, rows);
		}
	);
});



// session
server.get('/session', function(req, res, next){
	var query = {
		after: "",
	}

	if (req.query.after != undefined){
		query.after = "AND " + mysql.escape(parseInt(req.query.after )) + " <= UNIX_TIMESTAMP(date)"
	}

	mysql.query(
		"SELECT * " +
		"FROM session " +
		"WHERE 1 = 1 " +
		query.after,
		function(err, rows) {
			return res.send(201, rows);
		}
	);
});



// shot
server.get("/shot", function(req, res, next){
	console.log(req.query.after)
	var query = {
		after: "",
	}

	if (req.query.after != undefined){
		query.after = "AND " + mysql.escape(parseInt(req.query.after )) + " <= UNIX_TIMESTAMP(date)"
	}

	mysql.query(
		"SELECT * " +
		"FROM shot " +
		"WHERE 1 = 1 " +
		query.after,
		function(err, rows) {
			return res.send(201, rows);
		}
	);
});
