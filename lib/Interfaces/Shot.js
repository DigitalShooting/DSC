"use strict";

Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

/**
 Shot object, contains all important values
 */
class Shot {
  /**
   @param x           x coordinate
   @param y           y coordinate
   @param scheibe     scheibe
   @param coordinate  coordinate
   */
  constructor(x, y, scheibe, part) {
    this.ring = {
      display: 0,
      value: 0,
      int: 0,
    };
    this.overtime = false;
    this.time = new Date().getTime();
    this.x = x;
    this.y = y;

    this.teiler = (Math.pow((x*x + y*y), 0.5) / 10).toFixedDown(1).toFixed(1);

    var winkel = Math.atan2(y, x) * (180 / Math.PI);
    if (x >= 0 && y >= 0) this.winkel = winkel;
    else if (x >= 0 && y < 0) this.winkel = 360 + winkel;
    else if (x < 0 && y >= 0) this.winkel = winkel;
    else if (x < 0 && y < 0) this.winkel = 360 + winkel;
    this.winkel = this.winkel.toFixedDown(1).toFixed(1);


    var ring = this.getRingFromTeiler(this.teiler, scheibe);
    this.ring.display = parseFloat(ring).toFixed(1);
    this.ring.int = parseFloat(ring).toFixedDown(0);

    if (part.zehntel === true) {
      this.ring.value = parseFloat(ring).toFixedDown(1);
    }
    else {
      this.ring.value = parseFloat(ring).toFixedDown(0);
    }
  }

  log() {
    return "Ring: "+this.ring.display+" Teiler: "+this.teiler+" Winkel "+this.winkel+" ("+this.x+", "+this.y+")";
  }

  getRingFromTeiler(teiler, scheibe){
    var ringGroß = scheibe.ringe[0];
    var ringKlein = scheibe.ringe[scheibe.ringe.length-1];
    var k = scheibe.kugelDurchmesser*100/2;

    var ring;
    if (teiler == 0){
      ring = 10.9;
    }
    else if (teiler > ringKlein.width*100/2 + k){
      ring = 0;
    }
    else {
      var m = (ringGroß.value - ringKlein.value) / (ringGroß.width*100/2 - ringKlein.width*100/2);
      var t =  ringGroß.value - m * (ringGroß.width*100/2 + k);

      ring = (m * teiler + t).toFixedDown(1).toFixed(1);
    }
    return ring;
  }

}

module.exports = Shot;
