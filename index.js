var child_process = require('child_process');

var config = require("./config/index.js");
var DSCDataAPI = require("./lib/DSCDataAPI.js");
var Print = require("./lib/print/");
var MongoDBHelper = require("./lib/MongoDBHelper.js");

// Start Main Server Processes
var controllerProcess = child_process.fork("./lib/Webserver");


if (config.database.enabled) {
  child_process.execSync("sleep 10");
}


controllerProcess.on("message", event => {
  switch (event.type) {
  case "newTarget":
    dscDataAPI.newTarget();
    break;
  case "setDisziplin":
    dscDataAPI.setDisziplin(event.data);
    break;
  case "setSelectedSerie":
    dscDataAPI.setSelectedSerie(event.data);
    break;
  case "setSelectedShot":
    dscDataAPI.setSelectedShot(event.data);
    break;
  case "setUser":
    dscDataAPI.setUser(event.data);
    break;
  case "setPart":
    dscDataAPI.setPart(event.data.partId, event.data.force);
    break;
  case "setSessionIndex":
    dscDataAPI.setSessionIndex(event.data);
    break;
  case "print":
    controllerProcess.send({type: "print_didStart"});
    Print(dscDataAPI.getActiveData(), event.data, err => {
      if (err){
        controllerProcess.send({type: "print_error"});
      }
      else {
        controllerProcess.send({type: "print_didFinish"});
      }
    });
    break;
  case "loadData":
    dscDataAPI.setData(event.data);
    break;
  case "showMessage":
    controllerProcess.send({type: "showMessage", data: event.data});
    break;
  case "hideMessage":
    controllerProcess.send({type: "hideMessage"});
    break;
  case "shutdown":
    child_process.execFile("sudo", ["shutdown", "-h", "now"], (err, out, code) => { });
    break;
  case "sendSessions":
    dscDataAPI.setData(event.data.sessions, event.data.group, event.data.user);
    break;

  default:
    console.error("Unnown event was called from controllerProcess", event);
  }
});

controllerProcess.on("exit", () => {
  console.error("[Main Process] Webserver Worker did exit, stopping DSC...");
  process.exit();
});



// dsc api init
var dscDataAPI = DSCDataAPI();
dscDataAPI.init(() => {

  // set default disziplin
  var initDefalutSession = () => {
    dscDataAPI.setDisziplin(config.disziplinen.defaultDisziplin);

    // set default user
    dscDataAPI.setUser({
      firstName: "Gast",
      lastName: "",
      verein: "",//config.line.hostVerein.name,
      manschaft: "",
    });
  };


  // listen to dsc api events
  dscDataAPI.on = event => {
    switch (event.type) {
    case "dataChanged":
      controllerProcess.send({
        type: "dataChanged",
        data: dscDataAPI.getActiveData(),
      });
      break;
    case "switchData":
      controllerProcess.send({
        type: "switchData",
        data: dscDataAPI.getActiveData(),
      });
      break;
    case "statusChanged":
      controllerProcess.send({
        type: "statusChanged",
        data: event.connected,
      });
      break;
    case "alertTimeOverShot":
      controllerProcess.send({
        type: "alertTimeOverShot",
      });
      break;
    case "alertShotLimit":
      controllerProcess.send({
        type: "alertShotLimit",
      });
      break;
    case "exitTypeWarning_beforeFirst":
      controllerProcess.send({
        type: "exitTypeWarning_beforeFirst",
      });
      break;
    case "exitTypeWarning_none":
      controllerProcess.send({
        type: "exitTypeWarning_none",
      });
      break;
    case "message":
      console.log(event.text)
      break;

    default:
      console.error("Unnown event was called from dataAPI", event);
    }
  };

  if (config.database.enabled) {
    MongoDBHelper(collection => {
      var data = collection.find().sort({date:-1}).limit(1).toArray((err, data) => {
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

  var activeMessage;
});
