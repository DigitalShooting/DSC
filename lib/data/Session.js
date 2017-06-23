Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

var Serie = require("./Serie.js");

module.exports = class Session {
	constructor(disziplin, partID) {
		this.type = partID
		if (this.type == null){
			this.type = Object.keys(disziplin.parts)[0];
		}

		this.serien = [];

		this.anzahl = 0;
		this.gesamt = 0;
		this.schnitt = 0;
		this.counts = {
			innenZehner: 0,
			neunNeun: 0,
			zehnNull: 0,
		};
		this.bestTeiler = null;
		this.selectedSerieIndex = null;
		this.time = {
			enabled: false,
			type: "",
		};
		this.schnittCalc = null;

		// TODO
		// this.setTimers();
	}

	// update timers for given session
	// TODO
	setTimers(session) {
		// if (this.time.enabled === false){
		//
		// 	var time = {
		// 		enabled: false,
		// 	};
		// 	if (activeData.disziplin.time.enabled === true){
		// 		if (activeData.disziplin.time.instantStart === true || (activeData.disziplin.time.instantStart === false && session.serien.length !== 0)){
		// 			time.enabled = true;
		// 			time.end = (new Date()).getTime() + activeData.disziplin.time.duration * 60 * 1000;
		// 			time.duration = activeData.disziplin.time.duration;
		// 			time.type = "full";
		// 		}
		// 	}
		// 	else {
		// 		var part = activeData.disziplin.parts[session.type];
		// 		if (part.time.instantStart === true || (part.time.instantStart === false && session.serien.length !== 0) ){
		// 			if (part.time.enabled === true){
		// 				time.enabled = true;
		// 				time.end = (new Date()).getTime() + part.time.duration * 60 * 1000;
		// 				time.duration = part.time.duration;
		// 				time.type = "part";
		// 			}
		// 		}
		// 	}
		//
		// 	session.time = time;
		// }
	}


	// set selection
	setSelectedSerie(index, api) {
		if (i >= this.serien.length) {
			return;
		}
		this.selectedSerieIndex = i;

		if (api != null) {
			api.on({
				type: "dataChanged",
			});
		}
	}



	newShot(shot, disziplin, number, api){
		console.log("[INFO] newShot ("+shot.log()+")");

		var part = disziplin.parts[this.type];

		// Check if time is left
		// TODO
		// var date = (session.time.end - (new Date().getTime()))/1000;
		// if (date < 0){
		// 	api.on({
		// 		type: "alertTimeOverShot",
		// 	});
		// }

		// Check if shot limit
		if (part.anzahlShots <= this.anzahl && part.anzahlShots !== 0){
			api.on({
				type: "alertShotLimit",
			});
		}

		// add first serie
		var serie = this.serien[this.serien.length-1];
		if (serie === undefined || part.serienLength == serie.anzahl) {
			serie = new Serie();
			this.serien.push(serie);
		}

		// TODO needed?
		shot.number = number === undefined ? this.anzahl+1 : number;
		// innenZehner
		shot.innenZehner = shot.teiler <= disziplin.scheibe.innenZehner;

		serie.newShot(shot)

		this.anzahl++;
		this.gesamt += shot.ring.value;
		this.gesamt = (Math.round(this.gesamt*10)/10);
		this.schnitt = (Math.round(this.gesamt/ this.anzahl * 10)/ 10).toFixed(1);
		this.duration = shot.time/1000 - this.serien[0].shots[0].time/1000;


		// Counts
		if (shot.innenZehner){
			this.counts.innenZehner++;
		}
		if (shot.ring.display == 9.9){
			this.counts.neunNeun++;
		}
		if (shot.ring.display == 10.0){
			this.counts.zehnNull++;
		}

		// Best Teiler
		if (this.bestTeiler === null || parseFloat(this.bestTeiler) > parseFloat(shot.teiler)){
			this.bestTeiler = shot.teiler;
		}



		// Hochrechnung
		this.schnittCalc = null;
		var part = disziplin.parts[this.type];
		if (part.average.enabled === true){
			var hochrechnung = this.gesamt/ this.anzahl * part.average.anzahl;

			if (part.zehntel){
				this.schnittCalc = Math.round(hochrechnung*10)/10;
			}
			else {
				this.schnittCalc = Math.round(hochrechnung);
			}
		}

		this.selectedSerieIndex = this.serien.length-1;

		// TODO
		// setTimers(session);

		// trigger on changed
		if (api != null) {
			api.on({
				type: "dataChanged",
			});
		}

		// updateData();
	}

	getSelectedSerie() {
		return this.serien[this.selectedSerieIndex];
	}

};
