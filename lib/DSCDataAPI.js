var ObjectId = require('mongodb').ObjectID;

var config = require("../config/index.js");
var DSCDatabaseAPI = require("./DSCDatabaseAPI.js");
var DSCData = require("./data/Data.js");


var collection;



// HELPER

// Returns the last object of given array
function lastObject(array){
	if (array === undefined) return;
	return array[array.length-1];
}


module.exports = function(){

	// The active interface object
	var activeInterface;

	var data;





	function updateData(){
		if (data !== undefined && collection !== undefined){
			collection.update(
				{"_id" : data._id},
				data,
				{upsert: true, unique: true},
				function(err, results) { }
			);
		}
	}



	var api = {
		// wait for database driver
		init: function(callback){
			if (config.database.enabled) {
				new DSCDatabaseAPI(function(dbCollection){
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


			data = new DSCData(config, disziplin, api);


			// set up new interface
			activeInterface = config.interface[disziplin.interface.name];
			activeInterface = require("../"+activeInterface.path)(activeInterface, disziplin);
			activeInterface.onNewShot = function(shot){
				api.newShot(shot);
			};
			activeInterface.onNewData = function(data){
				// console.log(data)
			};
			activeInterface.onNewStatus = function(connected){
				api.on({
					type: "StatusChanged",
					connected: connected,
				});
			};

			api.on({ type: "dataChanged" });
			api.on({ type: "switchData" });

			activeInterface.session = data.getSelectedSession();

			updateData();
		},



		// Setter

		// change part of disziplin
		setPart: function(partId, force){
			console.log("[INFO] setPart ("+partId+")");

			data.setPart(partId, force, api);
		},

		// change the active session
		setSessionIndex: function(sessionIndex){
			data.setSessionIndex(sessionIndex, api);
		},

		// change user of data
		setUser: function(user){
			data.setUser(user, api);
		},

		// add shot to active session
		newShot: function(shot, sessionID, number){ // TODO Session id unused?
			// TODO maybe pipe to data, to auto switch session after x shots
			data.getSelectedSession().newShot(shot, data.disziplin, number, api);

			// updateData();
		},

		// new target
		newTarget: function(){
			data.newTarget(api);
		},

		// // set selection
		setSelectedSerie: function(index){
			data.getSelectedSession().setSelectedSerie(index, api);
		},
		setSelectedShot: function(index){
			data.getSelectedSession().getSelectedSerie().setSelectedShot(index, api);
		},


		// set new active data object
		setData: function(data){
			// TODO
		},


		// Getter

		// get active disziplin
		getActiveDisziplin: function(){
			return data.disziplin;
		},

		// // get active disziplin
		// getActiveSession: function(){
		// 	if (data === undefined) return;
		// 	return data.activeSession;
		// },

		// get data
		getActiveData: function(){
			return data;
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
