"use strict";

var esaHelper = require("./helper.js");


Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};



const DeviceInterface = require("./DeviceInterface.js");

class DemoDeviceInterface extends DeviceInterface {
  constructor(interf, disziplin) {
    super();
		this.intervalId = setInterval(function(){
			if (this.session == null) {
				return;
			}

      var scheibe = disziplin.scheibe;

      var x = Math.random()*10000 - 5000;
      var y = Math.random()*10000 - 5000;

      var shot = esaHelper.getShotFromXY(x, y, scheibe, disziplin.parts[this.session.type]);

      this.call("onNewShot", shot);
      this.call("onNewStatus", true);
    }.bind(this), disziplin.interface.time);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

module.exports = DemoDeviceInterface;
