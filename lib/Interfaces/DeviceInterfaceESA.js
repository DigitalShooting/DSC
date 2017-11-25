"use strict";

var child_process = require('child_process');

const Shot_Data = require("./Shot_Data.js");
const DeviceInterface = require("./DeviceInterface.js");
const BandACKServer = require("./BandACKServer.js");

// TODO doku, clean up
function cleanOutput(out){
  var cleanOutput = [];
  if (out){
    var outBytes = out.toString().match(/.{1,2}/g);
    var length = 0;
    for (var i in outBytes){
      var byte = outBytes[i];
      if (cleanOutput.length === 0) {
        if (byte == "55") {
          cleanOutput.push(byte);
        }
      }
      else {
        cleanOutput.push(byte);

        if (cleanOutput.length == 2) {
          if (byte == "08") length = 5;
          else if (byte == "1a") length = 29;
          else if (byte == "1b") length = 26;
          else if (byte == "1d") length = 17;
        }
        if (cleanOutput.length == length) {
          break;
        }
      }
    }
  }
  return cleanOutput;
}


/**
 Main Device to get shots from the HaeringAPI programm
 */
class DeviceInterfaceESA extends DeviceInterface {

	/**
   Creates child process with HaeringAPI and init it with given disziplin.
   Writes commands into its stdin.

   @param interface  Config object form /config/interface.js
   @param disziplin  Disziplin to use
   */
  constructor(interf, disziplin) {
    super();

    this.interf = interf;

    this.onShotBandMove = disziplin.interface.band.onShot;
    this.onChangePartBandMove = disziplin.interface.band.onChangePart;

    this.initChild(interf, disziplin);
    this.startUDPServer(interf);

    // Call set after init time
    setTimeout(function(){
      this.set();
    }.bind(this), 500);

    // Start shot pooling
    var intervalId;
    setTimeout(function(){
      this.intervalId = setInterval(this.nop.bind(this), 250);
    }.bind(this), 1500);
  }
  
  startUDPServer(interf){
    if (interf.bandACK.enabled == false) {
      console.log("[HaeringAPI Band ACK UDP Server] disabled");
      return;
    }
    console.log("[HaeringAPI Band ACK UDP Server] enabled");
    
    var onData = function(msg, rinfo){
      if (msg == "BAND ACK") {
        this.bandACK();
      }
      console.log("[HaeringAPI Band ACK UDP Server] got: "+msg+" from "+rinfo.address+":"+rinfo.port);
    }.bind(this);
    
    var onError = function(error){
      this.call("errorMessage", "HaeringAPI " + error);
      this.call("onNewStatus", false);
    }.bind(this);
    
    this.bandACKServer = new BandACKServer(interf.bandACK.port, onData, onError);
  }

  initChild(interf, disziplin){
    this.child = child_process.spawn(__dirname+"/../Haering/bin/HaeringAPI", [interf.com]);
    this.child.stdin.setEncoding('utf-8');

    this.child.stdout.on('data', function(data) {
      var shotData = cleanOutput(data);
      this.call("onNewData", shotData);

      var shot = Shot_Data(shotData, disziplin, this.session);
      if (shot) {
        this.call("onNewShot", shot);
        this.call("onNewStatus", true);
        this.waitForBandACK(0);
      }
      else if(shotData[0] == "55" && shotData[1] == "01" && shotData[2] == "08" && shotData[3] == "5c" && shotData[4] == "aa") {
        this.call("onNewStatus", true);
      }
      else {
        this.call("onNewStatus", false);
      }
    }.bind(this));

    this.child.stderr.on('data', function(data) {
      this.call("errorMessage", "HaeringAPI " + data.toString());
      this.call("onNewStatus", false);
    }.bind(this));

    this.child.on('close', function(code) {
      this.call("errorMessage", "HaeringAPI closing code: " + code);
      this.call("onNewStatus", false);
    }.bind(this));
  }

  band(){
    this.child.stdin.write("band " + this.onChangePartBandMove + "\n");
    this.waitForBandACK(0);
  }

  nop(){
    this.child.stdin.write("nop\n");
  }

  set(){
    this.child.stdin.write("set " + this.onShotBandMove + "\n");
    // TODO readSettings
  }

	/**
   Update with the current session, and move band.
   @param session  Current session object
   */
  setSession(session) {
    super.setSession(session);
    this.band();
  }

	/**
   Stop nop pooling and kill HaeringAPI
   */
  stop(){
    clearInterval(this.intervalId);
    this.child.kill("SIGTERM");
    
    if (this.interf.bandACK.enabled == true) {
      this.bandACKServer.stop();
    }
  }
  
  /**
   Set up Timer which will be fiered after we got no ack form band
   
   @param failures  Number of failures in a row
   */
  waitForBandACK(failures){
    if (this.interf.bandACK.enabled == false) return;
    if (failures == null) failures = 0;
    clearTimeout(this.bandACKIntervalId);
    this.bandACKIntervalId = setTimeout(function(){
      if (failures < 3) {
        console.log("INFO: Try to recover from missing band ack ("+failures+")");
        this.child.stdin.write("band 1\n");
        this.child.stdin.write("band 1\n");
        this.child.stdin.write("band 1\n");
        this.waitForBandACK(failures+1);
      }
      else {
        console.log("WARNING: Band ACK MISSING!!!");
        this.call("errorMessage", "Achtung: Band hat nicht transportiert");
      }
    }.bind(this), 5000);
  }
  
  /**
   Call when we get an ack for the band
   */
  bandACK(){
    clearTimeout(this.bandACKIntervalId);
  }
}

module.exports = DeviceInterfaceESA;
