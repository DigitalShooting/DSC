"use strict";
//
// Webserver
//
// Controls the express webserver with the Rest and SocketIO api.
//

var express = require("express");
var http = require("http");
var lessMiddleware = require('less-middleware');

var config = require("../../config/");
var version = require("../Version.js");
var restAPI = require("./API.js");

var app = express();
var router = express.Router();

// jade
app.set('view engine', 'pug');

// asset routes
router.use("/js/", express.static(__dirname + "/../../assets/js"));
router.use("/libs/", express.static(__dirname + "/../../assets/libs"));
router.use("/favicon.ico", express.static(__dirname + "/../../assets/img/favicon.ico"));
router.use("/logo.png", express.static(config.line.hostVerein.logoPath));

router.use("/css/", lessMiddleware(__dirname + "/../../stylesheets"));
router.use("/css/", express.static(__dirname + "/../../stylesheets"));

// main route
router.use("*", function(req, res, next){
  res.locals = {
    config: {
      line: config.line,
    }
  };
  next();
});

// default page
router.get("/", function(req, res, next){
  res.render("index");
});

// log page
router.get("/log", function(req, res){
  res.render("log");
});


// Set up routes
app.use('/api/', restAPI);
app.use('/', router);



// Init server on port and socket.io
var server = http.Server(app);
var io = require("socket.io")(server);
server.listen(config.network.dsc.port, config.network.dsc.address);
server.on("listening", function() {
  console.log("[INFO] DSC started (%s:%s)", server.address().address, server.address().port);
});


var activeData;
var activeMessage;


// Exit when the main process dies
process.once("disconnect", function(){
  console.error("[Webserver Worker] Master got disconnect event, trying to exit with 0");
  process.exit(0);
});

process.once("exit", function(code){
  console.error("[Webserver Worker] exit with %s", code);
});



process.on("message", function(event){
  switch (event.type) {
  case "dataChanged":
    activeData = event.data;
    io.emit('setData', activeData);
    break;

  case "switchData":
    activeData = event.data;
    io.emit('switchData', activeData);
    break;

  case "statusChanged":
    io.emit('setStatus', event.data);
    break;

  case "alertTimeOverShot":
    io.emit('info', {
      title: "Zeit ist abgelaufen",
      text: "Der Schuss wurde nach Ablauf der Zeit abgegeben.",
    });
    break;

  case "alertShotLimit":
    io.emit('info', {
      title: "Alle Schüsse abgegeben",
      text: "Es wurden bereits alle Schüsse abgegeben.",
    });
    break;

  case "exitTypeWarning_beforeFirst":
    io.emit('info', {
      title: "Wechsel nicht möglich",
      text: "Ein Wechsel ist nur vor dem erstem Schuss erlaubt.",
    });
    break;

  case "exitTypeWarning_none":
    io.emit('info', {
      title: "Wechsel nicht möglich",
      text: "Ein Wechsel ist nicht erlaubt.",
    });
    break;

  case "showMessage":
    activeMessage = {
      type: event.data.type,
      title: event.data.title,
    };
    io.emit('showMessage', activeMessage);
    break;

  case "hideMessage":
    activeMessage = undefined;
    io.emit('hideMessage', {});
    break;

  case "print_didStart":
    io.emit('info', {
      title: "Druckauftrag wird bearbeitet...",
      text: "Der Ausdruck wird erstellt.",
    });
    break;

  case "print_error":
    io.emit('info', {
      title: "Drucken fehlgeschlagen.",
      text: "Beim erstellen des Ausdruck ist ein Fehler aufgetreten. ("+event.data+")",
    });
    break;

  case "print_didFinish":
    io.emit('info', {
      title: "Drucken erfolgreich",
      text: "Der Ausdruck wurde erstellt.",
    });
    break;

  default:
    console.error("Unnown event was called from main process", event);
  }
});


// helper to perform callback if auth object ist valid
function checkAuth(auth, callback){
  if (config.auth.key == auth.key || config.auth.tempKey == auth.key){
    if (callback != null) callback();
  }
  else {
    console.log("[INFO] Wrong auth key");
  }
}





// socket stuff
io.on('connection', function(socket){

  // set about
  socket.emit('setAbout', {
    version: version,
  });

  socket.emit('switchData', activeData);

  // Send shotMessage if we have any
  if (activeMessage !== undefined){
    socket.emit("showMessage", {
      type: activeMessage.type,
      title: activeMessage.title,
    });
  }


  // get/ set data
  socket.on('getData', function(key){
    socket.emit('setData', activeData);
  });
  socket.emit('setData', activeData);


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
      process.send({type: "newTarget"});
    });
  });


  // set disziplin
  socket.on('setDisziplin', function(object){
    checkAuth(object.auth, function(){
      var key = object.disziplin;
      process.send({type: "setDisziplin", data: config.disziplinen.all[key]});
    });
  });


  // selection
  socket.on('setSelectedSerie', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "setSelectedSerie", data: object.index});
    });
  });
  socket.on('setSelectedShot', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "setSelectedShot", data: object.index});
    });
  });


  // set user
  socket.on('setUser', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "setUser", data: object.user});
    });
  });



  socket.on('setPart', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "setPart", data: {
        partId: object.partId,
        force: object.force,
      }});
    });
  });



  socket.on('setSessionIndex', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "setSessionIndex", data: object.sessionIndex});
    });
  });



  socket.on('print', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "print", data: object.printTemplate});
    });
  });



  socket.on('loadData', function(object){
    checkAuth(object.auth, function(){
      process.send({type: "loadData", data: object.data});
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
      process.send({type: "showMessage", data: {
        type: object.type,
        title: object.title,
      }});
    });
  });
  socket.on("hideMessage", function(object){
    checkAuth(object.auth, function(){
      process.send({type: "hideMessage"});
    });
  });




  socket.on("shutdown", function(object){
    checkAuth(object.auth, function(){
      process.send({type: "shutdown"});
    });
  });



  socket.on("sendSessions", function(object){
    checkAuth(object.auth, function(){
      process.send({type: "sendSessions", data: {
        sessions: object.sessions,
        group: object.group,
        user: object.user,
      }});
    });
  });



});
