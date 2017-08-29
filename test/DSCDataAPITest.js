"use strict";

const assert = require('assert');

const DSCDataAPI = require("../lib/DSCDataAPI.js");
const config = require("../config/");

var demoUser = {
  firstName: "firstName4323",
  lastName: "lastName9743",
  verein: "verein9158",
  manschaft: "manschaft1190",
};


describe("DSCDataAPI", function() {
  var dscDataAPI;
  var demoDisziplin;

  before(function() {
    demoDisziplin = config.disziplinen.all.lg_demo;
    demoDisziplin.interface.limit = 0;
  });

  beforeEach(function(done) {
    dscDataAPI = DSCDataAPI();
    dscDataAPI.init(function(){
      done();
    });
  });

  describe('#setUser()', function() {
    it("Check if user object is set", function(done) {
      // dscDataAPI.on = function(event){
      //   if (event.type == "dataChanged") {
      //     dscDataAPI.on = function(){};
      //     done();
      //   }
      // };
      dscDataAPI.setDisziplin(demoDisziplin);
      dscDataAPI.setUser(demoUser);

      var activeData = dscDataAPI.getActiveData();
      assert.equal(activeData.user, demoUser);

      done();
    });
  });

  describe('#newTarget()', function() {
    it("Check if new target is working", function(done) {
      demoDisziplin.interface.time = 0;
      demoDisziplin.interface.limit = 1;
      dscDataAPI.setDisziplin(demoDisziplin);

      setTimeout(function(){
        assert.equal(dscDataAPI.getActiveData().sessionParts.length, 1);
        dscDataAPI.newTarget();
        setTimeout(function(){
          assert.equal(dscDataAPI.getActiveData().sessionParts.length, 2);
          done();
        }, 10);
      }, 10);
    });
  });

});






/*

// dsc api init
var dscDataAPI = DSCDataAPI();
dscDataAPI.init(function(){

  // listen to dsc api events
  dscDataAPI.on = function(event){
    switch (event.type) {
    case "dataChanged":

      break;
    case "switchData":

      break;
    case "statusChanged":

      break;
    case "alertTimeOverShot":

      break;
    case "alertShotLimit":

      break;
    case "exitTypeWarning_beforeFirst":

      break;
    case "exitTypeWarning_none":

      break;

    default:
      console.error("Unnown event was called from dataAPI", event);
    }
  };
});
*/
