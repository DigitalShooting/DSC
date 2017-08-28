"use strict";

/**
 Simple helper class to call callbacks on events
 */
class EventManager {
  constructor() {
    /**
     Object for the eventTitles, each with an array for the callbacks
     */
    this.events = {};
  }

  /**
   Set up listener for event
   @param eventTitle      event id to listen
   @param callback        callback to run on event
   */
  on(eventTitle, callback) {
    if (this.events[eventTitle] == null) {
      this.events[eventTitle] = [callback];
    }
    else {
      this.events[eventTitle].push(callback);
    }
  }

  /**
   Calls every subscriped callback for given event
   @param eventTitle      event id to call
   @param paramerter      paramerter, which will be passed thrue each callback
   */
  call(eventTitle, paramerter) {
    for (var i in this.events[eventTitle]) {
      this.events[eventTitle][i](paramerter);
    }
  }
}

module.exports = EventManager;
