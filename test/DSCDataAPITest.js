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

  // describe('#setDisziplin()', function() {
  //   it("Check if each disziplin works", function() {
  //     for (var id in config.disziplinen.all) {
  //       dscDataAPI.setDisziplin(config.disziplinen.all[id]);
  //       assert.equal(dscDataAPI.getActiveData().disziplin, config.disziplinen.all[id]);
  //     }
  //   });
  // });

  describe('#setPart()', function() {
    it("check if set part is working", function() {
      dscDataAPI.setDisziplin(demoDisziplin);
      dscDataAPI.getActiveInterface().randomShot(demoDisziplin);

      assert.equal(dscDataAPI.getActiveData().sessionParts[0].type, "probe");
      dscDataAPI.setPart("match");
      assert.equal(dscDataAPI.getActiveData().sessionParts[1].type, "match");

      var shot1 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      assert.equal(dscDataAPI.getActiveData().sessionParts[1].serien[0].shots[0], shot1);
    });

    it("check if permissions are working", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      assert.equal(dscDataAPI.getActiveSession().type, "probe");
      dscDataAPI.setPart("match");
      assert.equal(dscDataAPI.getActiveSession().type, "match");

      // Go back before first should work
      dscDataAPI.setPart("probe");
      assert.equal(dscDataAPI.getActiveSession().type, "probe");

      dscDataAPI.setPart("match");
      var shot1 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      assert.equal(dscDataAPI.getActiveData().sessionParts[1].serien[0].shots[0], shot1);

      // After one shot not
      dscDataAPI.setPart("probe");
      assert.equal(dscDataAPI.getActiveSession().type, "match");

      // only with force
      dscDataAPI.setPart("probe", true);
      assert.equal(dscDataAPI.getActiveSession().type, "probe");
    });
  });



  describe('#setSessionIndex()', function() {
    it("Check if setSessionIndex works", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);
      dscDataAPI.setPart("match");
      assert.equal(dscDataAPI.getActiveSession().type, "match");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 1);

      dscDataAPI.setSessionIndex(0);
      assert.equal(dscDataAPI.getActiveSession().type, "probe");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);
    });

    it("Check if setSessionIndex works with new target", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);
      dscDataAPI.newTarget();

      // Without any shot nothing happens
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);

      var shot1 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      dscDataAPI.newTarget();

      assert.equal(dscDataAPI.getActiveSession().type, "probe");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 1);

      dscDataAPI.setSessionIndex(0);
      assert.equal(dscDataAPI.getActiveSession().type, "probe");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);
      assert.equal(dscDataAPI.getActiveSession().serien[0].shots[0], shot1);
    });

    it("check if force works correctly", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      dscDataAPI.setPart("match");
      assert.equal(dscDataAPI.getActiveSession().type, "match");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 1);

      var shot1 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);

      // Without force, it should not be allowed
      dscDataAPI.setSessionIndex(0);
      assert.equal(dscDataAPI.getActiveSession().type, "match");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 1);

      dscDataAPI.setSessionIndex(0, true);
      assert.equal(dscDataAPI.getActiveSession().type, "probe");
      assert.equal(dscDataAPI.getActiveData().sessionIndex, 0);

      dscDataAPI.setSessionIndex(1);
      assert.equal(dscDataAPI.getActiveSession().serien[0].shots[0], shot1);
    });
  });



  describe('#setUser()', function() {
    it("Check if user object is set", function() {
      dscDataAPI.setDisziplin(demoDisziplin);
      dscDataAPI.setUser(demoUser);

      var activeData = dscDataAPI.getActiveData();
      assert.equal(activeData.user, demoUser);
    });

    it("Check if user object is set correctly after setDisziplin", function(done) {
      dscDataAPI.setDisziplin(demoDisziplin);
      dscDataAPI.setUser(demoUser);

      assert.equal(dscDataAPI.getActiveData().user, demoUser);

      dscDataAPI.setDisziplin(demoDisziplin);
      assert.equal(dscDataAPI.getActiveData().user, demoUser);

      done();
    });
  });





  describe('#newShot()', function() {
    it("", function() {
      // TODO
    });
  });




  describe('#newTarget()', function() {
    it("Check if new target is working", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      var shot1 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      assert.equal(dscDataAPI.getActiveData().sessionParts.length, 1);

      dscDataAPI.newTarget();

      dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      var shot2 = dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      assert.equal(dscDataAPI.getActiveData().sessionParts.length, 2);

      assert.equal(dscDataAPI.getActiveData().sessionParts[0].serien[0].shots[0], shot1);
      assert.equal(dscDataAPI.getActiveData().sessionParts[1].serien[0].shots[1], shot2);
    });
  });



  describe('#setSelectedSerie()', function() {
    it("Check if selecting works", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      for (var i = 0; i < 25; i++) {
        dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      }
      assert.equal(dscDataAPI.getActiveSession().anzahl, 25);
      assert.equal(dscDataAPI.getActiveSession().selection.serie, 2);

      dscDataAPI.setSelectedSerie(0);
      assert.equal(dscDataAPI.getActiveSession().selection.serie, 0);

      dscDataAPI.setSelectedSerie(1);
      assert.equal(dscDataAPI.getActiveSession().selection.serie, 1);

      dscDataAPI.setSelectedSerie(2);
      assert.equal(dscDataAPI.getActiveSession().selection.serie, 2);

      // TODO out of bounds
    });
  });

  describe('#setSelectedShot()', function() {
    it("", function() {
      dscDataAPI.setDisziplin(demoDisziplin);

      for (var i = 0; i < 5; i++) {
        dscDataAPI.getActiveInterface().randomShot(demoDisziplin);
      }
      assert.equal(dscDataAPI.getActiveSession().anzahl, 5);
      assert.equal(dscDataAPI.getActiveSession().selection.shot, 4);

      dscDataAPI.setSelectedShot(0);
      assert.equal(dscDataAPI.getActiveSession().selection.shot, 0);

      dscDataAPI.setSelectedShot(1);
      assert.equal(dscDataAPI.getActiveSession().selection.shot, 1);

      dscDataAPI.setSelectedShot(2);
      assert.equal(dscDataAPI.getActiveSession().selection.shot, 2);

      // TODO out of bounds
    });
  });

  describe('#setData()', function() {
    it("", function() {
      // TODO
    });
  });

});
