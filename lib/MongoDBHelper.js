"use strict";
//
// MongoDBHelper.js
//
// Connect to the database an call callback with collection
// Throws error if the connecton cannot be established
//

var MongoClient = require('mongodb').MongoClient;

var config = require("../config/");



module.exports = function(callback){
  if (config.database.enabled != true) {
    throw new Error("Database not enabled.");
  }

  const client = new MongoClient(config.database.mongodb.url)
  client.connect(function(err) {
    if (err){
      console.log("[ERROR] MongoDB not connected ("+err+")");
      process.exit(1);
    }
    else {
      // console.log("[INFO] MongoDB connected");
      const db = client.db(config.database.mongodb.collection);
      callback(db.collection(config.database.mongodb.collection));
    }
  });
};
