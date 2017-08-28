"use strict";

const DeviceInterface = require("../lib/Interfaces/DeviceInterface.js");

describe("DeviceInterface", function() {
  describe('#setSession()', function() {
    it("Try setting session", function(done) {
      var deviceInterface = new DeviceInterface();

      deviceInterface.setSession("1234");
      if (deviceInterface.session == "1234") {
        done();
      }
      else {
        done("Could not get session");
      }
    });
  });
});
