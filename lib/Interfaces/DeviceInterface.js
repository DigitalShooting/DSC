"use strict";

const EventManager = require("../EventManager.js");

/**
 Basic class for each device we get shots from
 */
class DeviceInterface extends EventManager {
  /**
   Init with
   @param interface  Config object form /config/interface.js
   @param disziplin  Disziplin to use
   */
  constructor(interf, disziplin) {
		super();
	}

  /**
   Stop interaction
   */
  stop() {}

  /**
   Update with the current session
   @param session  Current session object
   */
  setSession(session) {
    this.session = session;
  }
}

module.exports = DeviceInterface;
