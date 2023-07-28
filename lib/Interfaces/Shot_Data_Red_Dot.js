"use strict";

const Shot = require("./Shot.js");

/**
 Init new shot based on HaeringAPI output
 @param data       byte array (hex) from HaeringAPI
 @param disziplin  disziplin
 @param session    session
 */
module.exports = (data, disziplin, session) => {
  var scheibe = disziplin.scheibe;
  var part = disziplin.parts[session.type];

  // 0                              9                                18    19      21   22                                           37                   44                50
  // .   00000000                    .     00000000                  .     LG     .     01    .  1  .  0  .  01    .  00    .  0  .  3667        .  9  .  -3664          .  -0171          .  .  <  $
  // 02  30 30 30 30 30 30 30 30    0d     30 30 30 30 30 30 30 30   0d    4c 47   0d   30 31 0d 31 2e 30 0d 30 31 0d 30 30 2e 30 0d 33 36 36 37 2e 39 0d 2d 33 36 36 34 0d 2d 30 31 37 31 0d 17 3c 24
  if (data[0] == "02") {
    // var time = parseInt(data[3] + data[4] + data[5] + data[6], 16)

    var xData = String.fromCharCode(parseInt(data[44])) + String.fromCharCode(parseInt(data[45])) + String.fromCharCode(parseInt(data[46])) + String.fromCharCode(parseInt(data[47])) + String.fromCharCode(parseInt(data[48])) + String.fromCharCode(parseInt(data[49]));
    var x = parseInt(xData);
    // if (x > 2290649224) x = x - 4294967295;

    var yData = String.fromCharCode(parseInt(data[50])) + String.fromCharCode(parseInt(data[51])) + String.fromCharCode(parseInt(data[52])) + String.fromCharCode(parseInt(data[53])) + String.fromCharCode(parseInt(data[54])) + String.fromCharCode(parseInt(data[55]));
    var y = parseInt(yData);
    // if (y > 2290649224) y = y - 4294967295;

    if (x == null || y == null) {
      console.log("ERROR parsing data", data, xData, yData, x, y);
      return null;
    }

    return new Shot(x, y, scheibe, part);
  }
  else {
    return null;
  }
};
