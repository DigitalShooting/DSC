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
	};

	if (req.query.after != undefined){
		var time = mysql.escape(parseInt(req.query.after));
		if (time != "NaN"){
			query.after = "AND " + time + " <= UNIX_TIMESTAMP(edited)";
		}
	}

	mysql.query(
		"SELECT *, UNIX_TIMESTAMP(date) as 'unixtime' " +
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
	};

	if (req.query.after != undefined){
		var time = mysql.escape(parseInt(req.query.after));
		if (time != "NaN"){
			query.after = "AND " + time + " <= UNIX_TIMESTAMP(date)";
		}
	}

	mysql.query(
		"SELECT *, UNIX_TIMESTAMP(date) as 'unixtime' " +
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
	var query = {
		after: "",
	};

	if (req.query.after != undefined){
		var time = mysql.escape(parseInt(req.query.after));
		if (time != "NaN"){
			query.after = "AND " + time + " <= UNIX_TIMESTAMP(date)";
		}
	}

	mysql.query(
		"SELECT *, UNIX_TIMESTAMP(date) as 'unixtime' " +
		"FROM shot " +
		"WHERE 1 = 1 " +
		query.after,
		function(err, rows) {
			return res.send(201, rows);
		}
	);
});
