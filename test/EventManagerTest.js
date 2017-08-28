"use strict";

const EventManager = require("../lib/EventManager.js");

describe("EventManager", function() {
  describe('#call()', function() {
    it("Try calling an event with listener", function(done) {
      var manager = new EventManager();
      var parameter = {a: "MyParameterA", b: "MyParameterB"};

      manager.on("event1", function(p) {
        if (p !== parameter) done("Parameter was wrong");
        else done();
      });
      manager.on("event2", function() {
        done("Wrong event was called");
      });

      manager.call("event1", parameter);
    });

    it("Try calling an event with no listener", function(done) {
      var manager = new EventManager();
      manager.call("event1");
      done();
    });

    it("Test multiple listeners for one call", function(done) {
      var manager = new EventManager();
      var parameter = {a: "MyParameterA", b: "MyParameterB"};

      var i = 0;

      manager.on("event1", function(p) {
        if (p === parameter) i = i+1;
      });
      manager.on("event1", function(p) {
        if (p === parameter) i = i+1;
      });

      manager.call("event1", parameter);

      if (i != 2) {
        done("Listener not called twice");
      }
      else {
        done();
      }
    });
  });

});
