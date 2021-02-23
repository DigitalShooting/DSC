"use strict";
//
// Webserver
//
// Controls the express webserver with the Rest and SocketIO api.
//

var express = require("express");
var http = require("http");

var config = require("../../config/");
var version = require("../Version.js");
var restAPI = require("./API.js");

var app = express();
var router = express.Router();

// jade
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use("/", express.static(__dirname + "/../../frontend/"));

// main route
router.use("*", (req, res, next) => {
  res.locals = {
    config: {
      line: config.line,
    }
  };
  next();
});

// Set up routes
app.use('/api/', restAPI);
app.use('/', router);



// Init server on port and socket.io
var server = http.Server(app);
var io = require("socket.io")(server);
server.listen(config.network.dsc.port, config.network.dsc.address);
server.on("listening", () => {
  console.log("[INFO] DSC started (%s:%s)", server.address().address, server.address().port);
});


var activeData;
var activeMessage;


// Exit when the main process dies
process.once("disconnect", () => {
  console.error("[Webserver Worker] Master got disconnect event, trying to exit with 0");
  process.exit(0);
});

process.once("exit", code => {
  console.error("[Webserver Worker] exit with %s", code);
});



process.on("message", event => {
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
// function checkAuth(auth, callback){
//   if (config.auth.key == auth.key || config.auth.tempKey == auth.key){
//     if (callback != null) callback();
//   }
//   else {
//     console.log("[INFO] Wrong auth key");
//   }
// }

// helper to perform callback if auth object ist valid
function checkAuth(callback){
  return (object) => {
    if (object == null || object.auth == null) return;
    let key = object.auth.key;
    if (config.auth.key == key || config.auth.tempKey == key){
      if (callback != null) callback(object);
    }
    else {
      console.log("[INFO] Wrong auth key");
    }
  }
}





// socket stuff
io.on('connection', socket => {

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
  
  socket.on('getData', key => socket.emit('setData', activeData));
  
  socket.emit('setData', activeData);
  
  socket.on('getConfig', key => {
    socket.emit('setConfig', {
      disziplinen: config.disziplinen,
      line: config.line,
    });
  });
  
  socket.emit('setConfig', {
    disziplinen: config.disziplinen,
    line: config.line,
  });
  
  socket.on('newTarget', checkAuth(object => {
    process.send({type: "newTarget"});
  }));
  
  socket.on('setDisziplin', checkAuth(object => {
    var key = object.disziplin;
    process.send({type: "setDisziplin", data: config.disziplinen.all[key]});
  }));
  
  socket.on('setSelectedSerie', checkAuth(object => {
    process.send({type: "setSelectedSerie", data: object.index});
  }));
  
  socket.on('setSelectedShot', checkAuth(object => {
    process.send({type: "setSelectedShot", data: object.index});
  }));
  
  socket.on('setUser', checkAuth(object => {
    process.send({type: "setUser", data: object.user});
  }));
  
  socket.on('setPart', checkAuth(object => {
    process.send({type: "setPart", data: {
      partId: object.partId,
      force: object.force,
    }});
  }));
  
  socket.on('setSessionIndex', checkAuth(object => {
    process.send({type: "setSessionIndex", data: object.sessionIndex});
  }));
  
  socket.on('print', checkAuth(object => {
    process.send({type: "print", data: object.printTemplate});
  }));
  
  socket.on('loadData', checkAuth(object => {
    process.send({type: "loadData", data: object.data});
  }));
  
  socket.on('getTempToken', checkAuth(object => {
    socket.emit("setTempToken", config.auth.tempKey);
  }));

  socket.on("showMessage", checkAuth(object => {
    process.send({type: "showMessage", data: {
      type: object.type,
      title: object.title,
    }});
  }));
  
  socket.on("hideMessage", checkAuth(object => {
    process.send({type: "hideMessage"});
  }));

  socket.on("shutdown", checkAuth(object => {
    process.send({type: "shutdown"});
  }));

  socket.on("sendSessions", checkAuth(object => {
    process.send({type: "sendSessions", data: {
      sessions: object.sessions,
      group: object.group,
      user: object.user,
    }});
  }));
});
