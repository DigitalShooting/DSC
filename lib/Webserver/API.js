"use strict";
//
// Webserver/API.js
//
// Provide a simple api to access DSC Sessions
//

var express = require('express');

var MongoDBHelper = require("../MongoDBHelper.js");
var config = require("../../config/");

var router = express.Router();



// Exit when the main process dies
process.once("disconnect", () => {
  console.error("[RESTAPI Worker] Master got disconnect event, trying to exit with 0");
  process.exit(0);
});

process.once("exit", code => {
  console.error("[RESTAPI Worker] exit with %s", code);
});


// Only active if we have a database
if (config.database.enabled) {
  MongoDBHelper(collection => {
    router.get('/data', (req, res, next) => {
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

      var data = collection.find(query).sort({date:-1}).limit(limit).skip(page*limit).toArray((err, data) => {
        if (err){
          console.log(err);
        }
        return res.send(data);
      });
    });

    router.get('/data/count', (req, res, next) => {
      var data = collection.find().sort({date:-1}).count((err, count) => {
        return res.send(count.toString());
      });
    });
  });
}

// Otherwise just response 404
else {
  router.get('/*', (req, res, next) => {
    return res.status(404).send("Database not enabled.");
  });
}

module.exports = router;
