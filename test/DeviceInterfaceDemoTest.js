"use strict";

const DeviceInterfaceDemo = require("../lib/Interfaces/DeviceInterfaceDemo.js");
const Shot = require("../lib/Interfaces/Shot.js");

const config = require("../config/index.js");
const disziplin_demo = require("../disziplinen/lg/disziplin_demo.js");

describe("DeviceInterfaceDemo", function() {

  before(function() {
    // Set timeout time smaller to speed up test
    disziplin_demo.interface.time = 10;
    disziplin_demo.interface.limit = 10;
  });

  describe('#onNewStatus()', function() {
    it("Check if status is true", function(done) {
      var interfaceConfig = config.interface[disziplin_demo.interface.name];
      var newInterfaceClass = require("../"+interfaceConfig.path);
      var activeInterface = new newInterfaceClass(interfaceConfig, disziplin_demo);
      activeInterface.setSession({type: "probe"}); // Set fake session
      activeInterface.on("onNewStatus", function(connected){
        if (connected) done();
        else done("Status is not true");

        activeInterface.stop();
      });
    });
  });

  describe('#onNewShot()', function() {
    it("Check if valid shot is returned", function(done) {
      var interfaceConfig = config.interface[disziplin_demo.interface.name];
      var newInterfaceClass = require("../"+interfaceConfig.path);
      var activeInterface = new newInterfaceClass(interfaceConfig, disziplin_demo);
      activeInterface.setSession({type: "probe"}); // Set fake session
      activeInterface.on("onNewShot", function(shot){
        if (shot instanceof Shot) done();
        else done("Invalid shot");
        activeInterface.stop();
      });
    });
  });
});
