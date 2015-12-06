var config = require("../config/index.js")
var mysql = require("./mysql.js")

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
					if (activeDisziplin.time.instantStart == true || (activeDisziplin.time.instantStart == false && session.serien.length != 0)){
						time.enabled = true
						time.end = (new Date()).getTime() + activeDisziplin.time.duration * 60 * 1000
						time.duration = activeDisziplin.time.duration
						time.type = "full"
					}
				}
				else {
					var part = activeDisziplin.parts[session.type]
					if (part.time.instantStart == true || (part.time.instantStart == false && session.serien.length != 0) ){
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



	var sqlVars = {
		sessionID: "",
		disziplinID: "",
	}


	function sqlMakeNewDisziplin(disziplin, session){
		if (config.database.enabled){
			mysql.query("INSERT INTO disziplin (disziplin, line, date) VALUES(?, ?, ?);",
				[disziplin._id, config.line.id, new Date()],
				function(err, result) {
					if (err){
						// console.log(err)
					}
					else {
						sqlVars.disziplinID = result.insertId
						sqlMakeNewSession(session)
					}
				}
			)
		}
	}
	function sqlMakeNewSession(session){
		if (config.database.enabled){
			mysql.query("INSERT INTO session (disziplinID, part, date) VALUES(?, ?, ?);",
				[sqlVars.disziplinID, session.type, new Date()],
				function(err, result) {
					if (err){
						// console.log(err)
					}
					else {
						sqlVars.sessionID = result.insertId
					}
				}
			)
		}
	}
	function sqlMakeNewShot(shot){
		if (config.database.enabled){
			mysql.query("INSERT INTO shot (ring, teiler, x, y, winkel, date, number, sessionID) VALUES(?, ?, ?, ?, ?, ?, ?, ?);",
				[shot.ring.display, shot.teiler, shot.x, shot.y, shot.winkel, shot.time, shot.number, sqlVars.sessionID],
				function(err, rows, fields) {
					if (err){
						// console.log(err)
					}
				}
			)
		}
	}


	var api = {
		// init new disziplin
		setDisziplin: function(disziplin){
			console.log("[INFO] setDisziplin ("+disziplin.title+")")

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
			activeInterface = config.interface[disziplin.interface.name]
			activeInterface = require("../"+activeInterface.path)(activeInterface, disziplin)
			activeInterface.onNewShot = function(shot){
				api.newShot(shot)
			}
			activeInterface.onNewData = function(data){
				// console.log(data)
			}
			activeInterface.onNewStatus = function(connected){
				api.on({
					type: "StatusChanged",
					connected: connected,
				})
			}

			api.on({
				type: "dataChanged",
			})

			// save changes
			saveActiveData()

			activeInterface.session = api.getActiveSession()

			sqlMakeNewDisziplin(disziplin, activeInterface.session)
		},



		// Setter

		// change part of disziplin
		setPart: function(partId){
			console.log("[INFO] setPart ("+partId+")")

			var activeSession = api.getActiveSession()

			if (partId != activeSession.type){
				var exitType = activeSession.disziplin.parts[activeSession.type].exitType
				if (exitType == "beforeFirst"){
					var anzahlShots = activeSession.disziplin.parts[activeSession.type].anzahlShots

					if (activeSession.anzahl != 0 && anzahlShots != 0 && activeSession.anzahl < anzahlShots){
						api.on({
							type: "exitTypeWarning_beforeFirst",
						})
						return
					}
				}
				else if (exitType == "none"){
					var anzahlShots = activeSession.serien.length < activeSession.disziplin.parts[activeSession.type].anzahlShots
					if (anzahlShots != 0 && anzahlShots != 0 && activeSession.anzahl < anzahlShots){
						api.on({
							type: "exitTypeWarning_none",
						})
						return
					}
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

				api.on({
					type: "dataChanged",
				})

				// save changes
				saveActiveData()

				activeInterface.session = api.getActiveSession()

				this.setUser(activeUser)

				sqlMakeNewSession(activeInterface.session)
			}

		},

		// change user of data
		setUser: function(user){
			console.log("[INFO] setUser ("+JSON.stringify(user)+")")

			activeUser = user
			var activeSession = api.getActiveSession()
			if (activeSession != undefined){
				activeSession.user = activeUser
			}

			api.on({
				type: "dataChanged",
			})

			// save changes
			saveActiveData()
		},

		// add shot to active session
		newShot: function(shot){
			console.log("[INFO] newShot ("+shot.log()+")")

			var session = api.getActiveSession()

			var disziplin = session.disziplin
			var part = session.disziplin.parts[session.type]

			// Check if time is left
			var date = (session.time.end - (new Date().getTime()))/1000
			if (date < 0){
				api.on({
					type: "alertTimeOverShot",
				})
			}

			// Check if shot limit
			if (part.anzahlShots <= session.anzahl && part.anzahlShots != 0){
				api.on({
					type: "alertShotLimit",
				})
			}

			// add first serie
			var serie = lastObject(session.serien)

			var serieTemplate = {
				shots: [],
				anzahl: 0,
				gesamt: 0,
				duration: 0,
			}
			if (serie == undefined || part.serienLength == serie.anzahl) {
				session.serien.push(serieTemplate)
				serie = serieTemplate
			}

			shot.number = session.anzahl+1

			serie.shots.push(shot)
			serie.anzahl++
			serie.gesamt += shot.ring.value
			serie.schnitt = (Math.round(serie.gesamt/ serie.anzahl * 10)/ 10).toFixed(1)
			serie.duration = lastObject(serie.shots).time.getTime()/1000 - serie.shots[0].time.getTime()/1000

			session.anzahl++
			session.gesamt += shot.ring.value
			session.schnitt = (Math.round(session.gesamt/ session.anzahl * 10)/ 10).toFixed(1)
			session.duration = lastObject(lastObject(session.serien).shots).time.getTime()/1000 - session.serien[0].shots[0].time.getTime()/1000

			serie.gesamt = serie.gesamt.toFixedDown(1)
			session.gesamt = session.gesamt.toFixedDown(1)

			// Hochrechnung
			session.schnittCalc = undefined
			var part = session.disziplin.parts[session.type]
			if (part.average.enabled == true){
				var hochrechnung = session.gesamt/ session.anzahl * part.average.anzahl

				if (part.zehntel){
					session.schnittCalc = Math.round(hochrechnung*10)/10
				}
				else {
					session.schnittCalc = Math.round(hochrechnung)
				}
			}


			session.selection.serie = session.serien.length-1
			session.selection.shot = session.serien[session.selection.serie].anzahl-1

			setTimers(session)

			// save changes
			saveActiveData()

			// trigger on changed
			api.on({
				type: "dataChanged",
			})

			sqlMakeNewShot(shot)
		},

		// new target
		newTarget: function(){
			var session = api.getActiveSession()
			if (session.serien.length == 0){
				return
			}

			console.log("[INFO] newTarget")

			getNewSession(session.type)

			api.on({
				type: "dataChanged",
			})

			// save changes
			saveActiveData()

			sqlMakeNewSession(session)
		},

		// set selection
		setSelectedSerie: function(index){
			var session = api.getActiveSession()
			var oldSelectedSerie = parseInt(session.selection.serie)

			session.selection.serie = parseInt(index)
			if (oldSelectedSerie > session.selection.serie && session.serien[session.selection.serie] != undefined){
				session.selection.shot = session.serien[session.selection.serie].anzahl-1
			}
			else {
				session.selection.shot = 0
			}

			api.on({
				type: "dataChanged",
			})
		},
		setSelectedShot: function(index){
			var session = api.getActiveSession()

			session.selection.shot = parseInt(index)

			api.on({
				type: "dataChanged",
			})
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



		// Event will be triggered on every change, with "event.type" as type
		on: function(event){ },
	}
	return api
}
