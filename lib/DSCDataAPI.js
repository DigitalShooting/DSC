var config = require("../config/index.js")

// HELPER

// Returns the last object of given array
function lastObject(array){
	if (array == undefined) return
	return array[array.length-1]
}


module.exports = function(){

	// Store the active disziplin object
	var activeDisziplin

	// The active interface object
	var activeInterface

	// main data storage
	var activeData

	// index of active session
	var activeSessionIndex

	// init user object
	var activeUser = {
		firstName: "",
		lastName: "",
		verein: "",
		manschaft: "",
	}


	// save acitve data into db
	function saveActiveData(){
		// if (database != undefined){
		// 	collection = database.collection(config.database.collection)
		// 	collection.save(activeData, function(err, results){
		//
		// 		if (results){
		// 			if (results.ops){
		// 				if (results.ops.length > 0){
		// 					activeData._id = results.ops[0]._id
		// 				}
		// 			}
		// 		}
		// 	})
		// }
	}


	// generate new session object
	//  - partId | (optional) when given, this part will be used for the new session
	var getNewSession = function(partId){
		saveActiveData()

		if (partId == undefined){
			partId = Object.keys(activeDisziplin.parts)[0]
		}

		var session = {
			user: activeUser,
			type: partId,
			disziplin: activeDisziplin,
			serieHistory: [],

			serien: [],
			anzahl: 0,
			gesamt: 0,
			schnitt: 0,

			selection: {
				serie: 0,
				shot: 0,
			},
			time: {
				enabled: false,
				type: "",
			},
		}

		setTimers(session)

		activeData.sessionParts.push(session)
		activeSessionIndex = activeData.sessionParts.length-1

		saveActiveData()
	}


	// update timers for given session
	var setTimers = function(session){
		if (session != undefined){
			if (session.time.enabled == false){

				var time = {
					enabled: false,
				}
				if (activeDisziplin.time.enabled == true){
					if (activeDisziplin.time.instantStart == true || (activeDisziplin.time.instantStart == false && session.serieHistory.length != 0)){
						time.enabled = true
						time.end = (new Date()).getTime() + activeDisziplin.time.duration * 60 * 1000
						time.duration = activeDisziplin.time.duration
						time.type = "full"
					}
				}
				else {
					var part = activeDisziplin.parts[session.type]
					if (part.time.instantStart == true || (part.time.instantStart == false && session.serieHistory.length != 0) ){
						if (part.time.enabled == true){
							time.enabled = true
							time.end = (new Date()).getTime() + part.time.duration * 60 * 1000
							time.duration = part.time.duration
							time.type = "part"
						}
					}
				}

				session.time = time
			}
		}
	}






	var api = {
		// init new disziplin
		setDisziplin: function(disziplin){

			// stop old interface
			if (activeInterface) {
				activeInterface.stop()
			}

			// Save old Data
			saveActiveData()

			// set new data object
			activeData = {
				date: new Date().getTime(),
				sessionParts: [],
			}

			// set new disziplin
			activeDisziplin = disziplin

			getNewSession()

			// set up new interface
			activeInterface = config.interface[disziplin.interface]
			activeInterface = require("../"+activeInterface.path)(activeInterface, disziplin)
			activeInterface.onNewShot = function(shot){
				api.newShot(shot)
			}
			activeInterface.onNewData = function(data){
				// console.log(data)
			}
			activeInterface.onNewStatus = function(connected){
				api.onStatusChanged(connected)
			}

			api.onDataChanged()

			// save changes
			saveActiveData()
		},



		// Setter

		// change part of disziplin
		setPart: function(partId){
			var activeSession = api.getActiveSession()

			if (partId != activeSession.type){
				var exitType = activeSession.disziplin.parts[activeSession.type].exitType
				if (exitType == "beforeFirst"){
					if (activeSession.serieHistory.length != 0) {
						return
					}
				}
				else if (exitType == "none"){
					return
				}


				activeInterface.band()

				var time = activeSession.time

				activeSessionIndex = undefined
				for (var i = activeData.sessionParts.length-1; i >= 0; i--){
					var session = activeData.sessionParts[i]
					if (session.type == partId){
						activeSessionIndex = i
						break
					}
				}
				if (activeSessionIndex == undefined){
					getNewSession(partId)
				}

				var activeSession = api.getActiveSession()

				if (activeDisziplin.time.enabled == true){
					activeSession.time = time
				}
				else if (activeSession.time.type != "full"){
					activeSession.time = {
						enabled: false,
					}
				}

				setTimers(activeSession)

				api.onDataChanged()

				// save changes
				saveActiveData()
			}

		},

		// change user of data
		setUser: function(user){
			activeUser = user
			var activeSession = api.getActiveSession()
			if (activeSession != undefined){
				activeSession.user = activeUser
			}

			api.onDataChanged()

			// save changes
			saveActiveData()
		},

		// add shot to active session
		newShot: function(shot){
			var session = api.getActiveSession()

			var disziplin = session.disziplin
			var part = session.disziplin.parts[session.type]

			// Check if time is left
			var date = (session.time.end - (new Date().getTime()))/1000
			if (date < 0){
				console.log("WARNING [Time over]")
				io.emit('info', {
					type: "warning",
					title: "Zeit abgelaufen",
					text: "Der Schuss wird nicht gewertet.",
				});
				return
			}

			// Check if shot limit
			var anzahl = 0
			for(i in session.serieHistory){
				anzahl += session.serieHistory[i].length
			}
			if (part.anzahlShots <= anzahl && part.anzahlShots != 0){
				console.log("WARNING [Max shot limit]")
				io.emit('info', {
					type: "warning",
					title: "Schusslimit erreicht",
					text: "Es wurden bereits alle Schüsse abgegeben.",
				});
				return
			}

			// ------ serieHistory ------

			// add first serie
			if (lastObject(session.serieHistory) == undefined) {
				session.serieHistory.push([])
			}

			// Count shots
			var anzahlShots = 0
			for (var i in session.serieHistory){
				anzahlShots += session.serieHistory[i].length
			}
			shot.number = anzahlShots+1


			if (part.serienLength == lastObject(session.serieHistory).length){
				session.serieHistory.push([shot])
			}
			else {
				lastObject(session.serieHistory).push(shot)
			}

			// ---------------------------


			// ---- new -----

			// add first serie
			var serie = lastObject(session.serien)

			var serieTemplate = {
				shots: [],
				anzahl: 0,
				gesamt: 0,
				duration: 0,
			}
			if (serie == undefined) {
				session.serien.push(serieTemplate)
				serie = serieTemplate
			}
			else if (part.serienLength == serie.anzahl) {
				session.serien.push(serieTemplate)
				serie = serieTemplate
			}

			shot.number = session.anzahl+1

			serie.shots.push(shot)
			serie.anzahl++
			serie.gesamt += shot.ringInt
			serie.schnitt = (Math.round(serie.gesamt/ serie.anzahl * 10)/ 10).toFixed(1)
			serie.duration = lastObject(serie.shots).time.getTime()/1000 - serie.shots[0].time.getTime()/1000

			session.anzahl++
			session.gesamt += shot.ringInt
			session.schnitt = (Math.round(session.gesamt/ session.anzahl * 10)/ 10).toFixed(1)
			session.duration = lastObject(lastObject(session.serien).shots).time.getTime()/1000 - session.serien[0].shots[0].time.getTime()/1000

			// Hochrechnung
			session.schnittCalc = undefined
			var part = session.disziplin.parts[session.type]
			if (part.average.enabled == true){
				var hochrechnung = session.gesamt/ session.anzahl * part.average.anzahl
				session.schnittCalc = Math.round(hochrechnung)
			}


			// --------------




			session.selection.serie = session.serieHistory.length-1
			session.selection.shot = session.serieHistory[session.selection.serie].length-1

			setTimers(session)

			// save changes
			saveActiveData()

			// trigger on changed
			api.onDataChanged()
		},

		// new target
		newTarget: function(){
			var session = api.getActiveSession()
			if (session.serieHistory.length == 0){
				return
			}
			getNewSession(session.type)

			api.onDataChanged()

			// save changes
			saveActiveData()
		},

		// set selection
		setSelectedSerie: function(index){
			var session = api.getActiveSession()
			var oldSelectedSerie = parseInt(session.selection.serie)

			session.selection.serie = parseInt(index)
			if (oldSelectedSerie > session.selection.serie && session.serieHistory[session.selection.serie] != undefined){
				session.selection.shot = session.serieHistory[session.selection.serie].length-1
			}
			else {
				session.selection.shot = 0
			}

			api.onDataChanged()
		},
		setSelectedShot: function(index){
			var session = api.getActiveSession()

			session.selection.shot = parseInt(index)

			api.onDataChanged()
		},


		// Getter

		// get active disziplin
		getActiveDisziplin: function(){
			return activeDisziplin
		},

		// get active disziplin
		getActiveSession: function(){
			if (activeData == undefined) return
			return activeData.sessionParts[activeSessionIndex]
		},

		// get data
		getActiveData: function(){
			return activeData
		},


		// Events

		// will be triggered on every change
		onDataChanged: function(){ },

		// will be triggered on status change
		onStatusChanged: function(connected){ },

	}
	return api
}
