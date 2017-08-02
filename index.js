var express = require("express");
var http = require("http");
var https = require("https");
var fs = require('fs');
var child_process = require('child_process');
var lessMiddleware = require('less-middleware');
var proxy = require("express-http-proxy");

var config = require("./config/index.js");
var DSCDataAPI = require("./lib/DSCDataAPI.js");
var Print = require("./lib/print/");
var mongodb = require("./lib/mongodb.js");
var version = require("./lib/version.js");

// Start API Processes
var restAPIProcess = child_process.fork("./lib/api.js");

// Start Main Server Processes
var controllerProcess = child_process.fork("./controller.js");

controllerProcess.on("message", function(event){
	if (event.type === "newTarget") {
		dscDataAPI.newTarget();
	}
	if (event.type === "setDisziplin") {
		dscDataAPI.setDisziplin(event.data);
	}
	if (event.type === "setSelectedSerie") {
		dscDataAPI.setSelectedSerie(event.data);
	}
	if (event.type === "setSelectedShot") {
		dscDataAPI.setSelectedShot(event.data);
	}
	if (event.type === "setUser") {
		dscDataAPI.setUser(event.data);
	}
	if (event.type === "setPart") {
		dscDataAPI.setPart(event.data.partId, event.data.force);
	}
	if (event.type === "setSessionIndex") {
		dscDataAPI.setSessionIndex(event.data);
	}
	if (event.type === "print") {
		controllerProcess.send({type: "print_didStart"});
		Print(dscDataAPI.getActiveData(), event.data, function(err){
			if (err){
				controllerProcess.send({type: "print_error"});
			}
			else {
				controllerProcess.send({type: "print_didFinish"});
			}
		});
	}
	if (event.type === "loadData") {
		dscDataAPI.setData(event.data);
	}
	if (event.type === "showMessage") {
		controllerProcess.send({type: "showMessage", data: event.data});
	}
	if (event.type === "hideMessage") {
		controllerProcess.send({type: "hideMessage"});
	}
	if (event.type === "shutdown") {
		child_process.execFile("sudo", ["shutdown", "-h", "now"], function(err, out, code) { });
	}
	if (event.type === "sendSessions") {
		dscDataAPI.setData(event.data.sessions, event.data.group, event.data.user);
	}
});



// Kill all child processes
var killWorkers = function() {
	restAPIProcess.kill();
	controllerProcess.kill();
};
process.on("uncaughtException", function(err){
	console.error(err);
	killWorkers();
	process.exit();
});
process.on('SIGINT', killWorkers); // catch ctrl-c
process.on('SIGTERM', killWorkers); // catch kill



// dsc api init
var dscDataAPI = DSCDataAPI();
dscDataAPI.init(function(){

	// set default disziplin
	var initDefalutSession = function(){
		dscDataAPI.setDisziplin(config.disziplinen.defaultDisziplin);

		// set default user
		dscDataAPI.setUser({
			firstName: "Gast",
			lastName: "",
			verein: "",//config.line.hostVerein.name,
			manschaft: "",
		});
	};

	if (config.database.enabled) {
		mongodb(function(collection){
			var data = collection.find().sort({date:-1}).limit(1).toArray(function (err, data) {
				if (data.length == 0 || err) {
					initDefalutSession();
				}
				else {
					// TODO search for last shot date
					var timeDelta = ((new Date ()).getTime()) - data[0].date;
					if (timeDelta < config.database.reloadLimit *1000) {
						dscDataAPI.setData(data[0]);
					}
					else {
						initDefalutSession();
					}
				}
			});
		});
	}
	else {
		initDefalutSession();
	}


	// listen to dsc api events
	dscDataAPI.on = function(event){
		if (event.type === "dataChanged"){
	    controllerProcess.send({
				type: "dataChanged",
				data: dscDataAPI.getActiveData(),
			});
	  }
	  else if (event.type === "switchData"){
			controllerProcess.send({
				type: "switchData",
				data: dscDataAPI.getActiveData(),
			});
	  }
	  else if (event.type === "statusChanged"){
			controllerProcess.send({
				type: "statusChanged",
				data: event.connected,
			});
	  }
	  else if (event.type === "alertTimeOverShot"){
			controllerProcess.send({
				type: "alertTimeOverShot",
			});
	  }
	  else if (event.type === "alertShotLimit"){
			controllerProcess.send({
				type: "alertShotLimit",
			});
	  }
	  else if (event.type === "exitTypeWarning_beforeFirst"){
			controllerProcess.send({
				type: "exitTypeWarning_beforeFirst",
			});
	  }
	  else if (event.type === "exitTypeWarning_none"){
			controllerProcess.send({
				type: "exitTypeWarning_none",
			});
	  }

	};


	var activeMessage;
});
