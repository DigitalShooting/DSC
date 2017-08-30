"use strict";

const Shot = require("./Shot.js");

/**
 Init new shot based on HaeringAPI output
 @param data       byte array (hex) from HaeringAPI
 @param disziplin  disziplin
 @param session    session
 */
module.exports = function(data, disziplin, session){
  var scheibe = disziplin.scheibe;
  var part = disziplin.parts[session.type];

  if (data[2] == "1d") {
    // var time = parseInt(data[3] + data[4] + data[5] + data[6], 16)

    var xData = data[7] + data[8] + data[9] + data[10];
    var x = parseInt(xData, 16);
    if (x > 2290649224) x = x - 4294967295;

    var yData = data[11]+ data[12]+ data[13] + data[14];
    var y = parseInt(yData, 16);
    if (y > 2290649224) y = y - 4294967295;

    super(x, y, scheibe, part);
  }
  else {
    return null;
  }
};
