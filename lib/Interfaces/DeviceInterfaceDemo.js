"use strict";

const Shot = require("./Shot.js");
const DeviceInterface = require("./DeviceInterface.js");

// TODO place somewhere central
Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};


/**
 Demo Device which generates random shots for testing purpose only
 */
class DeviceInterfaceDemo extends DeviceInterface {
  /**
   Creates interval at given time

   @param interface  Config object form /config/interface.js
   @param disziplin  Disziplin to use
   */
  constructor(interf, disziplin) {
    super();

    // count shots to stop if limit is given
    this.shotCount = 0;

    this.intervalId = setInterval(function(){
      if (disziplin.interface.limit != null && disziplin.interface.limit != -1 && disziplin.interface.limit <= this.shotCount) {
        this.call("message", "Demo shot limit reached, stopping for now.");
        this.stop();
        return;
      }
      this.shotCount++;

      this.randomShot(disziplin);
    }.bind(this), disziplin.interface.time);
  }

  randomShot(disziplin) {
    if (this.session == null) {
      return;
    }

    var scheibe = disziplin.scheibe;

    var x = Math.random()*10000 - 5000;
    var y = Math.random()*10000 - 5000;

    var shot = new Shot(x, y, scheibe, disziplin.parts[this.session.type]);

    this.call("onNewShot", shot);
    this.call("onNewStatus", true);

    return shot;
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

module.exports = DeviceInterfaceDemo;
