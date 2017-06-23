Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

var User = require("./User.js");
var Session = require("./Session.js");
var ObjectId = require('mongodb').ObjectID;

module.exports = class DSCData {
	constructor(config, disziplin, api) {
		if (config == null || disziplin == null) { // Check if real disziplin typeof
			throw new Error("One or more paramerter is null");
		}

		// Generate id for the database
		this._id = new ObjectId();

		// Init Guest user and line
		this.user = User.Gast();
		this.line = {
			id: config.line.id,
			// TODO add title
		};

		this.disziplin = disziplin;
		this.creationDate = new Date().getTime();

		this.sessionParts = [
			new Session(this.disziplin)
		];
		this.selectedSessionIndex = 0;

		// TODO Keep user when changeing data
		// TODO init interface
		// TODO events
	}

	// change user of data
	setUser(user, api) {
		console.log("[INFO] setUser ("+JSON.stringify(user)+")");

		this.user = user;

		if (api != null) {
			api.on({ type: "dataChanged" });
			api.on({ type: "switchData" });
		}

		// updateData();
	}


	// change the active session
	// TODO add force
	setSessionIndex(sessionIndex, api) {
		console.log("[INFO] setSessionIndex ("+sessionIndex+")");

		if (this.canExitPart(false) == false) {
			return;
		}
		if (sessionIndex >= this.sessionParts.length) {
			return;
		}

		this.selectedSessionIndex = sessionIndex;

		if (api != null) {
			api.on({
				type: "dataChanged",
			});
		}
	}


	// new target
	newTarget(api) {
		// TODO check if can exit part
		var session = this.getSelectedSession();
		if (session.serien.length === 0){
			return;
		}

		console.log("[INFO] newTarget");

		this.sessionParts.push(new Session(this.disziplin, session.type));
		this.selectedSessionIndex = this.sessionParts.length-1;

		if (api != null) {
			api.on({
				type: "dataChanged",
			});
		}

		// updateData();
	}

	// change part of disziplin
	setPart(partId, force, api) {
		console.log("[INFO] setPart ("+partId+")");

		var activeSession = this.getSelectedSession();

		if (partId != activeSession.type || force === true){
			if (this.canExitPart(force) === false) {
				return;
			}

			// TODO
			// activeInterface.band();

			var time = activeSession.time;

			this.selectedSessionIndex = null;
			for (var i = this.sessionParts.length-1; i >= 0; i--){
				var session = this.sessionParts[i];
				if (session.type == partId){
					this.selectedSessionIndex = i;
					break;
				}
			}
			if (this.selectedSessionIndex === null){
				this.sessionParts.push(new Session(this.disziplin, partId));
			}

			// TODO times
			// if (this.disziplin.time.enabled === true){
			// 	this.getSelectedSession().time = time;
			// }
			// else if (activeData.disziplin.time.type != "full"){
			// 	activeSession.time = {
			// 		enabled: false,
			// 	};
			// }
			//
			// setTimers(activeSession);

			if (api != null) {
				api.on({
					type: "dataChanged",
				});
			}

			// TODO
			// activeInterface.session = api.getSelectedSession();
			//
			// updateData();
		}
	}


	// TODO
	canExitPart(force) {
		var activeSession = api.getSelectedSession();
		var exitType = this.disziplin.parts[activeSession.type].exitType;
		var anzahlShots;

		if (force === undefined) {
			force = false;
		}

		if (exitType == "beforeFirst" && force === false){
			anzahlShots = this.disziplin.parts[activeSession.type].anzahlShots;
			if (activeSession.anzahl !== 0 && anzahlShots !== 0 && activeSession.anzahl < anzahlShots){
				if (api != null) {
					api.on({
						type: "exitTypeWarning_beforeFirst",
					});
				}
				return false;
			}
		}
		else if (exitType == "none" && force === false){
			anzahlShots = activeSession.serien.length < this.disziplin.parts[activeSession.type].anzahlShots;
			if (anzahlShots !== 0 && anzahlShots !== 0 && activeSession.anzahl < anzahlShots){
				if (api != null) {
					api.on({
						type: "exitTypeWarning_none",
					});
				}
				return false;
			}
		}

		return true;
	}


	// set new active data object
	setData(data) {
		// TODO
		// console.log("[INFO] setData");
		//
		// // stop old interface
		// if (activeInterface) {
		// 	activeInterface.stop();
		// }
		//
		// activeData = data;
		// activeData._id = new ObjectId();
		// activeData.date = new Date().getTime();
		//
		// // set up new interface
		// activeInterface = config.interface[activeData.disziplin.interface.name];
		// activeInterface = require("../"+activeInterface.path)(activeInterface, activeData.disziplin);
		// activeInterface.onNewShot = function(shot){
		// 	api.newShot(shot);
		// };
		// activeInterface.onNewData = function(data){
		// 	// console.log(data)
		// };
		// activeInterface.onNewStatus = function(connected){
		// 	api.on({
		// 		type: "StatusChanged",
		// 		connected: connected,
		// 	});
		// };
		//
		// activeInterface.session = api.getSelectedSession();
		//
		// // trigger on changed
		// api.on({ type: "dataChanged" });
		// api.on({ type: "switchData" });
		//
		// updateData();
	}





	// get active session
	getSelectedSession() {
		return this.sessionParts[this.selectedSessionIndex];
	}

};
