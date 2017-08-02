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

var app = express();

// jade
app.set('view engine', 'jade');

// asset routes
app.use("/js/", express.static("./assets/js"));
app.use("/libs/", express.static("./assets/libs"));
app.use("/favicon.ico", express.static("./assets/img/favicon.ico"));
app.use("/logo.png", express.static(config.line.hostVerein.logoPath));

app.use("/css/", lessMiddleware(__dirname + "/stylesheets"));
app.use("/css/", express.static(__dirname + "/stylesheets"));

// main route
app.use("*", function(req, res, next){
  res.locals = {
    config: {
      line: config.line,
    }
  };
  next();
});

// map api to /api
app.use('/api/', proxy("127.0.0.1:" + config.network.api.port, {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

// default page
app.get("/", function(req, res, next){
  res.render("index");
});

// log page
app.get("/log", function(req, res){
  res.render("log");
});



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
  if (event.type === "dataChanged"){
    activeData = event.data;
    io.emit('setData', activeData);
  }
  else if (event.type === "switchData"){
    activeData = event.data;
    io.emit('switchData', activeData);
  }
  else if (event.type === "statusChanged"){
    io.emit('setStatus', event.data);
  }
  else if (event.type === "alertTimeOverShot"){
    io.emit('info', {
      title: "Zeit ist abgelaufen",
      text: "Der Schuss wurde nach Ablauf der Zeit abgegeben.",
    });
  }
  else if (event.type === "alertShotLimit"){
    io.emit('info', {
      title: "Alle Schüsse abgegeben",
      text: "Es wurden bereits alle Schüsse abgegeben.",
    });
  }
  else if (event.type === "exitTypeWarning_beforeFirst"){
    io.emit('info', {
      title: "Wechsel nicht möglich",
      text: "Ein Wechsel ist nur vor dem erstem Schuss erlaubt.",
    });
  }
  else if (event.type === "exitTypeWarning_none"){
    io.emit('info', {
      title: "Wechsel nicht möglich",
      text: "Ein Wechsel ist nicht erlaubt.",
    });
  }


  else if (event.type === "showMessage"){
    activeMessage = object;
    io.emit('showMessage', {
      type: event.data.type,
      title: event.data.title,
    });
  }
  else if (event.type === "showMessage"){
    activeMessage = undefined;
    io.emit('hideMessage', {});
  }

  else if (event.type === "print_didStart"){
    io.emit('info', {
      title: "Druckauftrag wird bearbeitet...",
      text: "Der Ausdruck wird erstellt.",
    });
  }
  else if (event.type === "print_error"){
    io.emit('info', {
      title: "Drucken fehlgeschlagen.",
      text: "Beim erstellen des Ausdruck ist ein Fehler aufgetreten. ("+event.data+")",
    });
  }
  else if (event.type === "print_didFinish"){
    io.emit('info', {
      title: "Drucken erfolgreich",
      text: "Der Ausdruck wurde erstellt.",
    });
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

      process.send({type: "loadData", data: {
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
