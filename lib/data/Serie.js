Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

var Ring = require("./Ring.js");

module.exports = class Serie {
	constructor() {
		this.shots = [];
		this.anzahl = 0;
		this.gesamt = 0;
		this.schnitt = 0;
		this.duration = 0;

		this.selectedShotIndex = null;
	}

	newShot(shot) {
		this.shots.push(shot);
		this.anzahl++;
		this.gesamt += shot.ring.value;
		this.gesamt = (Math.round(this.gesamt*10)/10);
		this.schnitt = (Math.round(this.gesamt/ this.anzahl * 10)/ 10).toFixed(1);
		this.duration = shot.time/1000 - this.shots[0].time/1000;

		this.selectedShotIndex = this.shots.length-1;
	}

	setSelectedShot(index){
		this.selectedShotIndex = parseInt(index);

		if (api != null) {
			api.on({
				type: "dataChanged",
			});
		}
	}

	getSelectedShot() {
		return this.shots[this.selectedShotIndex];
	}

};
