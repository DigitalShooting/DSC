"use strict";

const EventManager = require("../EventManager.js");

/**
 */
class DeviceInterface extends EventManager {
  constructor(interf, disziplin) {
		super();
	}

  stop() {}

  setSession(session) {
    this.session = session;
  }
}

module.exports = DeviceInterface;
