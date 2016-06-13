var restify = require('restify');
var fs = require('fs');

var mongodb = require("./mongodb.js");
var config = require("../config/");




if (config.database.enabled) {
	mongodb(function(collection){

		// data
		server.get('/data', function(req, res, next){
			var limit = 10;
			if (req.query.limit !== undefined) {
				limit = parseInt(req.query.limit);
			}

			var page = 0;
			if (req.query.page !== undefined) {
				page = parseInt(req.query.page);
			}

			var query;
			if (req.query.sinceDate !== undefined) {
				query = {"date": {"$gte": Number(req.query.sinceDate)}};
			}

			var data = collection.find(query).sort({date:-1}).limit(limit).skip(page*limit).toArray(function (err, data) {
				if (err){
					console.log(err);
				}
				return res.send(201, data);
			});
		});

		server.get('/data/count', function(req, res, next){
			var data = collection.find().sort({date:-1}).count(function (err, count) {
				return res.send(201, count);
			});
		});
	});
}

var server = restify.createServer({
	name: 'DSC-API',
});
server.listen(config.network.api.port, config.network.api.address);
server.on("listening", function() {
	console.log("[INFO] DSC API started (%s:%s)", server.address().address, server.address().port);
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
