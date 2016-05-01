var restify = require('restify');
var fs = require('fs');

var mongodb = require("./mongodb.js");
var config = require("../config/");




if (config.database.enabled) {
	mongodb(function(collection){

		// data
		server.get('/data', function(req, res, next){
			var data = collection.find().toArray(function (err, data) {
				return res.send(201, data);
			});
		});
	});
}

var server = restify.createServer({
	name: 'DSC-API',
});
server.listen(config.network.api.port, config.network.api.address);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
