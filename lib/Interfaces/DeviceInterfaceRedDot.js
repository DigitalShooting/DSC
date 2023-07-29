"use strict";

var child_process = require('child_process');

const Shot_Data_Red_Dot = require("./Shot_Data_Red_Dot.js");
const DeviceInterface = require("./DeviceInterface.js");

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

    this.initChild(interf, disziplin);

    // Call set after init time
    setTimeout(() => this.setMode(disziplin.scheibe.interface.reddot.targetMode), 500);
    setTimeout(() => this.ack(), 700);

    // Start shot pooling
    var intervalId;
    setTimeout(() => this.intervalId = setInterval(this.nop.bind(this), 200), 1500);
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
      }
      else if(shotData[0] == "15") {
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

  nop(){
    console.log("nop");
    this.child.stdin.write("nop\n");
  }

  ack(){
    console.log("ack");
    this.child.stdin.write("ack\n");
  }

  setMode(mode){
    console.log("set "+mode);
    this.child.stdin.write("set "+mode+"\n");
  }

	/**
   Update with the current session.
   @param session  Current session object
   */
  setSession(session) {
    super.setSession(session);
    this.setMode(session.disziplin.scheibe.interface.reddot.targetMode);
  }

	/**
   Stop nop pooling and kill HaeringAPI
   */
  stop(){
    clearInterval(this.intervalId);
    this.child.kill("SIGTERM");
  }
}

module.exports = DeviceInterfaceESA;
