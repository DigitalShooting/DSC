"use strict";

const dgram = require("dgram");



/**
 
 */
class BandACKServer {

  /**
   Init and start UDP Server

   @param port    Port to listen on
   @param onData  Callback for data receeved
   @param onError Callback for errors
   */
  constructor(port, onData, onError) {
    this.onData = onData;
    this.onError = onError;

    this.server = dgram.createSocket('udp4');
    this.start(port);
  }



  /**
   Start UDP server
   
   @param port    Port to listen on
   */
  start(port){
    this.server.on('error', function(err){
      console.log("[Band ACK UDP Server] Error:\n"+err.stack);
      this.onError(err);
      this.server.close();
    }.bind(this));

    this.server.on('message', this.onData.bind(this));

    this.server.on('listening', function(){
      const address = this.server.address();
      console.log("[Band ACK UDP Server] Started on "+address.address+":"+address.port);
    }.bind(this));

    this.server.bind(port);
  }



  /**
   Stop UDP Server
   */
  stop(){
    this.server.close();
    console.log("[Band ACK UDP Server] stopped");
  }
}

module.exports = BandACKServer;
