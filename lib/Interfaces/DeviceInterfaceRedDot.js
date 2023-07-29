"use strict";

var child_process = require('child_process');

const Shot_Data_Red_Dot = require("./Shot_Data_Red_Dot.js");
const DeviceInterface = require("./DeviceInterface.js");
const BandACKServer = require("./BandACKServer.js");

// TODO doku, clean up
function cleanOutput(out){
  var cleanOutput = [];
  if (out){
    var outBytes = out.toString().match(/.{1,2}/g);
    console.log(outBytes);
    var length = 0;
    for (var i in outBytes){
      var byte = outBytes[i];
      cleanOutput.push(byte);

      // if (cleanOutput.length == 2) {
      //   if (byte == "08") length = 5;
      //   else if (byte == "1a") length = 29;
      //   else if (byte == "1b") length = 26;
      //   else if (byte == "1d") length = 17;
      // }
      // if (cleanOutput.length == length) {
      //   break;
      // }
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

    this.waitForAck = false;

    this.onShotBandMove = disziplin.interface.band.onShot;
    this.onChangePartBandMove = disziplin.interface.band.onChangePart;

    this.initChild(interf, disziplin);
    this.startUDPServer(interf);

    // Call set after init time
    setTimeout(() => this.set(), 500);
    setTimeout(() => this.ack(), 700);

    // Start shot pooling
    var intervalId;
    setTimeout(() => this.intervalId = setInterval(this.nop.bind(this), 200), 1500);
  }

  startUDPServer(interf){
    if (interf.bandACK.enabled == false) {
      console.log("[HaeringAPI Band ACK UDP Server] disabled");
      return;
    }
    console.log("[HaeringAPI Band ACK UDP Server] enabled");

    var onData = (msg, rinfo) => {
      if (msg == "BAND ACK") {
        this.bandACK();
      }
      console.log("[HaeringAPI Band ACK UDP Server] got: "+msg+" from "+rinfo.address+":"+rinfo.port);
    };

    var onError = (error) => {
      this.call("errorMessage", "RedDotAPI " + error);
      this.call("onNewStatus", false);
    };

    this.bandACKServer = new BandACKServer(interf.bandACK.port, onData, onError);
  }

  initChild(interf, disziplin){
    this.child = child_process.spawn(__dirname+"/../RedDot/bin/RedDotAPI", [interf.com]);
    this.child.stdin.setEncoding('utf-8');

    this.child.stdout.on('data', data => {
      // .00000000.00000000.LG.01.1.0.01.00.0.3667.9.-3664.-0171..<$
      var shotData = cleanOutput(data);
      this.call("onNewData", shotData);

      var shot = Shot_Data_Red_Dot(shotData, disziplin, this.session);
      if (shotData[0] == "02" && this.waitForAck == true) {
          this.ack();
      }
      else if (shot) {
	this.waitForAck = true;
	this.ack();
        this.call("onNewShot", shot);
        this.call("onNewStatus", true);
        // this.waitForBandACK(0);
      }
      else if(shotData[0] == "15") {
	console.log("nop ok");
        this.call("onNewStatus", true);
        this.waitForAck = false;
      }
      else {
        this.call("onNewStatus", false);
      }
    });

    this.child.stderr.on('data', data => {
      this.call("errorMessage", "HaeringAPI " + data.toString());
      this.call("onNewStatus", false);
    });

    this.child.on('close', code => {
      this.call("errorMessage", "HaeringAPI closing code: " + code);
      this.call("onNewStatus", false);
    });
  }

  band(){
    // this.child.stdin.write("band " + this.onChangePartBandMove + "\n");
    // this.waitForBandACK(0);
  }

  nop(){
    console.log("nop");
    this.child.stdin.write("nop\n");
  }

  ack(){
    console.log("ack");
    this.child.stdin.write("ack\n");
  }

  set(){
    console.log("set");
    this.child.stdin.write("lp\n");
    // this.child.stdin.write("set " + this.onShotBandMove + "\n");
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
    this.bandACKIntervalId = setTimeout(() => {
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
    }, 5000);
  }

  /**
   Call when we get an ack for the band
   */
  bandACK(){
    clearTimeout(this.bandACKIntervalId);
  }
}

module.exports = DeviceInterfaceESA;
