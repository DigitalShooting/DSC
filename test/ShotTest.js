"use strict";

var assert = require('assert');

const Shot = require("../lib/Interfaces/Shot.js");

const disziplin_demo = require("../disziplinen/lg/disziplin_demo.js");

describe("Shot", function() {
  describe('#constructor()', function() {
    it("zehntel", function() {
      disziplin_demo.parts.probe.zehntel = true;
      var shot = new Shot(400, 300, disziplin_demo.scheibe, disziplin_demo.parts.probe);
      assert.equal(shot.x, 400);
      assert.equal(shot.y, 300);
      assert.equal(shot.teiler, 50); // Teiler is in 1/100mm, x,y in 1/1000mm
      assert.equal(shot.ring.display, "10.8");
      assert.equal(shot.ring.value, 10.8);
      assert.equal(shot.ring.int, 10);
    });

    it("keine zehntel", function() {
      disziplin_demo.parts.probe.zehntel = false;
      var shot = new Shot(400, 300, disziplin_demo.scheibe, disziplin_demo.parts.probe);
      assert.equal(shot.x, 400);
      assert.equal(shot.y, 300);
      assert.equal(shot.teiler, 50); // Teiler is in 1/100mm, x,y in 1/1000mm
      assert.equal(shot.ring.display, "10.8");
      assert.equal(shot.ring.value, 10);
      assert.equal(shot.ring.int, 10);
    });

    it("null teiler", function() {
      disziplin_demo.parts.probe.zehntel = true;
      var shot = new Shot(0, 0, disziplin_demo.scheibe, disziplin_demo.parts.probe);
      assert.equal(shot.x, 0);
      assert.equal(shot.y, 0);
      assert.equal(shot.teiler, 0); // Teiler is in 1/100mm, x,y in 1/1000mm
      assert.equal(shot.ring.display, "10.9");
      assert.equal(shot.ring.value, 10.9);
      assert.equal(shot.ring.int, 10);
    });
  });
});
