var ObjectId = require('mongodb').ObjectID;

var config = require("../config/index.js");
var MongoDBHelper = require("./MongoDBHelper.js");


var collection;

// HELPER

// Returns the last object of given array
function lastObject(array){
	if (array == null) return;
	return array[array.length-1];
}


module.exports = function(){

	// The active interface object
	var activeInterface;

	// main data storage
	var activeData;



	// generate new session object
	//  - partId | (optional) when given, this part will be used for the new session
	var getNewSession = function(partId){
		if (partId == null){
			partId = Object.keys(activeData.disziplin.parts)[0];
		}

		var session = {
			type: partId,

			serien: [],
			anzahl: 0,
			gesamt: 0,
			schnitt: 0,
			counts: {
				innenZehner: 0,
				neunNeun: 0,
				zehnNull: 0,
			},
			bestTeiler: null,

			selection: {
				serie: 0,
				shot: 0,
			},
			time: {
				enabled: false,
				type: "",
			},
		};

		setTimers(session);

		activeData.sessionParts.push(session);
		activeData.sessionIndex = activeData.sessionParts.length-1;
	};


	// update timers for given session
	var setTimers = function(session){
		if (session != null){
			if (session.time.enabled === false){

				var time = {
					enabled: false,
				};
				if (activeData.disziplin.time.enabled === true){
					if (activeData.disziplin.time.instantStart === true || (activeData.disziplin.time.instantStart === false && session.serien.length != 0)){
						time.enabled = true;
						time.end = (new Date()).getTime() + activeData.disziplin.time.duration * 60 * 1000;
						time.duration = activeData.disziplin.time.duration;
						time.type = "full";
					}
				}
				else {
					var part = activeData.disziplin.parts[session.type];
					if (part.time.instantStart === true || (part.time.instantStart === false && session.serien.length != 0) ){
						if (part.time.enabled === true){
							time.enabled = true;
							time.end = (new Date()).getTime() + part.time.duration * 60 * 1000;
							time.duration = part.time.duration;
							time.type = "part";
						}
					}
				}

				session.time = time;
			}
		}
	};



	function updateData(){
		if (activeData != null && collection != null){
			collection.update(
				{"_id" : activeData._id},
				activeData,
				{upsert: true, unique: true},
				function(err, results) { }
			);
		}
	}

	function canExitPart(force){
		var activeSession = api.getActiveSession();
		var exitType = activeData.disziplin.parts[activeSession.type].exitType;
		var anzahlShots;

		if (force == null) {
			force = false;
		}

		if (exitType == "beforeFirst" && force === false){
			anzahlShots = activeData.disziplin.parts[activeSession.type].anzahlShots;
			if (activeSession.anzahl != 0 && anzahlShots != 0 && activeSession.anzahl < anzahlShots){
				api.on({
					type: "exitTypeWarning_beforeFirst",
				});
				return false;
			}
		}
		else if (exitType == "none" && force === false){
			anzahlShots = activeSession.serien.length < activeData.disziplin.parts[activeSession.type].anzahlShots;
			if (anzahlShots != 0 && anzahlShots != 0 && activeSession.anzahl < anzahlShots){
				api.on({
					type: "exitTypeWarning_none",
				});
				return false;
			}
		}

		return true;
	}

	function initInterface(disziplin) {
		activeInterface = config.interface[disziplin.interface.name];
		var newInterfaceClass = require("../"+activeInterface.path);
		activeInterface = new newInterfaceClass(activeInterface, disziplin);
		activeInterface.on("onNewShot", function(shot){
			api.newShot(shot);
		});
		activeInterface.on("onNewData", function(data){
			// console.log(data)
		});
		activeInterface.on("onNewStatus", function(connected){
			api.on({
				type: "statusChanged",
				connected: connected,
			});
		});

		activeInterface.setSession(api.getActiveSession());
	}


	var api = {
		// wait for database driver
		init: function(callback){
			if (config.database.enabled) {
				MongoDBHelper(function(dbCollection){
					collection = dbCollection;
					callback();
				});
			}
			else {
				callback();
			}
		},


		// init new disziplin
		setDisziplin: function(disziplin){
			console.log("[INFO] setDisziplin ("+disziplin.title+")");

			// stop old interface
			if (activeInterface) {
				activeInterface.stop();
			}

			var user = {
				firstName: "",
				lastName: "",
				verein: "",
				manschaft: "",
			};
			if (activeData != null) {
				user = activeData.user;
			}

			// set new data object
			activeData = {
				_id: new ObjectId(),
				line: config.line.id,
				date: new Date().getTime(),
				sessionParts: [],
				user: user,
				disziplin: disziplin,
				sessionIndex: undefined,
			};

			getNewSession();

			// set up new interface
			initInterface(disziplin);

			api.on({ type: "dataChanged" });
			api.on({ type: "switchData" });

			updateData();
		},



		// Setter

		// change part of disziplin
		setPart: function(partId, force){
			console.log("[INFO] setPart ("+partId+")");

			var activeSession = api.getActiveSession();

			if (partId != activeSession.type || force === true){
				if (canExitPart(force) === false) {
					return;
				}

				// activeInterface.band();

				var time = activeSession.time;

				activeData.sessionIndex = undefined;
				for (var i = activeData.sessionParts.length-1; i >= 0; i--){
					var session = activeData.sessionParts[i];
					if (session.type == partId){
						activeData.sessionIndex = i;
						break;
					}
				}
				if (activeData.sessionIndex == null){
					getNewSession(partId);
				}

				activeSession = api.getActiveSession();

				if (activeData.disziplin.time.enabled === true){
					activeSession.time = time;
				}
				else if (activeData.disziplin.time.type != "full"){
					activeSession.time = {
						enabled: false,
					};
				}

				setTimers(activeSession);

				api.on({
					type: "dataChanged",
				});

				activeInterface.setSession(api.getActiveSession());

				updateData();
			}

		},

		// change the active session
		setSessionIndex: function(sessionIndex){
			console.log("[INFO] setSessionIndex ("+sessionIndex+")");

			if (canExitPart(false) === false) {
				return;
			}
			if (sessionIndex >= activeData.sessionParts.length) {
				return;
			}

			activeData.sessionIndex = sessionIndex;

			api.on({
				type: "dataChanged",
			});
		},

		// change user of data
		setUser: function(user){
			console.log("[INFO] setUser ("+JSON.stringify(user)+")");

			activeData.user = user;

			api.on({ type: "dataChanged" });
			api.on({ type: "switchData" });

			updateData();
		},

		// add shot to active session
		newShot: function(shot, sessionID, number){
			console.log("[INFO] newShot ("+shot.log()+")");

			var session = api.getActiveSession();

			var part = activeData.disziplin.parts[session.type];

			// Check if time is left
			var date = (session.time.end - (new Date().getTime()))/1000;
			if (date < 0){
				api.on({
					type: "alertTimeOverShot",
				});
			}

			// Check if shot limit
			if (part.anzahlShots <= session.anzahl && part.anzahlShots != 0){
				api.on({
					type: "alertShotLimit",
				});
			}

			// add first serie
			var serie = lastObject(session.serien);

			var serieTemplate = {
				shots: [],
				anzahl: 0,
				gesamt: 0,
				duration: 0,
			};
			if (serie == null || part.serienLength == serie.anzahl) {
				session.serien.push(serieTemplate);
				serie = serieTemplate;
			}

			shot.number = number == null ? session.anzahl+1 : number;

			serie.shots.push(shot);
			serie.anzahl++;
			serie.gesamt += shot.ring.value;
			serie.schnitt = (Math.round(serie.gesamt/ serie.anzahl * 10)/ 10).toFixed(1);
			serie.duration = lastObject(serie.shots).time/1000 - serie.shots[0].time/1000;

			session.anzahl++;
			session.gesamt += shot.ring.value;
			session.schnitt = (Math.round(session.gesamt/ session.anzahl * 10)/ 10).toFixed(1);
			session.duration = lastObject(lastObject(session.serien).shots).time/1000 - session.serien[0].shots[0].time/1000;

			// innenZehner
			shot.innenZehner = shot.teiler <= activeData.disziplin.scheibe.innenZehner;

			// Counts
			if (shot.innenZehner){
				session.counts.innenZehner++;
			}
			if (shot.ring.display == 9.9){
				session.counts.neunNeun++;
			}
			if (shot.ring.display == 10.0){
				session.counts.zehnNull++;
			}

			// Best Teiler
			if (session.bestTeiler == null || parseFloat(session.bestTeiler) > parseFloat(shot.teiler)){
				session.bestTeiler = shot.teiler;
			}

			serie.gesamt = (Math.round(serie.gesamt*10)/10);
			session.gesamt = (Math.round(session.gesamt*10)/10);

			// Hochrechnung
			session.schnittCalc = undefined;
			var part = activeData.disziplin.parts[session.type];
			if (part.average.enabled === true){
				var hochrechnung = session.gesamt/ session.anzahl * part.average.anzahl;

				if (part.zehntel){
					session.schnittCalc = Math.round(hochrechnung*10)/10;
				}
				else {
					session.schnittCalc = Math.round(hochrechnung);
				}
			}


			session.selection.serie = session.serien.length-1;
			session.selection.shot = session.serien[session.selection.serie].anzahl-1;

			setTimers(session);

			// trigger on changed
			api.on({
				type: "dataChanged",
			});

			updateData();
		},

		// new target
		newTarget: function(){
			var session = api.getActiveSession();
			if (session.serien.length == 0){
				return;
			}

			console.log("[INFO] newTarget");

			getNewSession(session.type);

			api.on({
				type: "dataChanged",
			});

			updateData();
		},

		// set selection
		setSelectedSerie: function(index){
			var session = api.getActiveSession();
			var oldSelectedSerie = parseInt(session.selection.serie);

			session.selection.serie = parseInt(index);
			if (oldSelectedSerie > session.selection.serie && session.serien[session.selection.serie] != null){
				session.selection.shot = session.serien[session.selection.serie].anzahl-1;
			}
			else {
				session.selection.shot = 0;
			}

			api.on({
				type: "dataChanged",
			});
		},
		setSelectedShot: function(index){
			var session = api.getActiveSession();

			session.selection.shot = parseInt(index);

			api.on({
				type: "dataChanged",
			});
		},


		// set new active data object
		setData: function(data){
			console.log("[INFO] setData");

			// stop old interface
			if (activeInterface) {
				activeInterface.stop();
			}

			activeData = data;
			activeData._id = new ObjectId();
			activeData.date = new Date().getTime();

			// set up new interface
			initInterface(activeData.disziplin);

			// trigger on changed
			api.on({ type: "dataChanged" });
			api.on({ type: "switchData" });

			updateData();
		},


		// Getter

		// get active disziplin
		getActiveDisziplin: function(){
			return activeData.disziplin;
		},

		// get active disziplin
		getActiveSession: function(){
			if (activeData === undefined) return;
			return activeData.sessionParts[activeData.sessionIndex];
		},

		// get data
		getActiveData: function(){
			return activeData;
		},



		// Event will be triggered on every change, with "event.type" as type
		on: function(event){ },
	};

	function setDataHelper(session){
		api.setPart(session.part, true, function(sessionID){
			for (var ii in session.shots){
				var shot = session.shots[ii];
				api.newShot({
					ring: {
						display: shot.ring,
						value: shot.ringValue,
						int: parseInt(shot.ring),
					},
					time: new Date(shot.unixtime*1000),
					x: shot.x,
					y: shot.y,
					teiler: shot.teiler,
					winkel: shot.winkel,
					log: function(){
						return "Ring: "+this.ring.display+" Teiler: "+this.teiler+" Winkel "+this.winkel+" ("+this.x+", "+this.y+")";
					},
				}, sessionID, shot.number);
			}
		});
	}

	return api;
};
