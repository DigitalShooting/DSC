var MongoClient = require('mongodb').MongoClient;

var config = require("../config/");



module.exports = function(callback){
	MongoClient.connect(config.database.mongodb.url, function(err, db) {
		if (err){
			console.log("[ERROR] MongoDB not connected ("+err+")");
		}
		console.log("[INFO] MongoDB connected");

		collection = db.collection(config.database.mongodb.collection);
		callback(collection);

		// collection.find({"disziplin._id": "lg_demo"}).each(function(err, doc) {
		// 	console.dir(doc);
		// });
		// collection.find().each(function(err, doc) {
		// 	console.dir(doc);
		// });
	});
};



// // INSERT
// collection.insertOne({
// 	a : 2,
// }, function(err, result) {
// 	console.log("Inserted document into the document collection");
// });
//
//
//
//
// // GET
// var select = collection.find( { "a": 2 } );
// select.each(function(err, doc) {
// 	if (doc !== null) {
// 		console.log(doc);
// 	}
// });


// collection.find({"disziplin._id": "lg_demo"}).each(function(err, doc) {
// 	console.dir(doc);
// });
