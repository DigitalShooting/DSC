var socket = io()

Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};

function lastObject(array){
	return array[array.length-1]
}




var activeSerie = 0



// --------------------------------------------------------
// Grafik Modul

var moduleAPI = {
	activeModules: [
		modules.draw(),
		modules.serien(),
		modules.aktuelleSerie(),
		modules.ringeGesamt(),
		modules.aktuellerSchuss(),
		modules.anzahlShots(),
		modules.schnitt(),
		modules.time(),
		modules.name(),
		modules.verein(),
		modules.disziplin(),
		// modules.menu(),,
		modules.restTime(),
		modules.switchToMatch(),
		modules.newTarget(),
	],

	setSession: function(session){
		this.activeModules.forEach(function(moduleObject){
			if (moduleObject.setSession) {
				moduleObject.setSession(session)
			}
		})
	},

	newShot: function(shot){
		var disziplin = session.disziplin

		if (lastObject(session.serieHistory) == undefined) {
			session.serieHistory.push([])
		}

		if (disziplin.serienLength == lastObject(session.serieHistory).length){
			session.serieHistory.push([shot])
		}
		else {
			lastObject(session.serieHistory).push(shot)
		}

		session.selection.serie = session.serieHistory.length-1
		session.selection.shot = session.serieHistory[session.selection.serie].length-1

		this.activeModules.forEach(function(moduleObject){
			if (moduleObject.newShot) {
				moduleObject.newShot(shot, disziplin.scheibe)
			}
		})
	},


	setConfig: function(config){
		this.activeModules.forEach(function(moduleObject){
			if (moduleObject.setConfig) {
				moduleObject.setConfig(config)
			}
		})
	},

}





// UP
shortcut.add("F1",function() {
	if (session.selection.shot > 0){
		socket.emit('setSelectedShot', --session.selection.shot)
	}
	else if (session.selection.serie > 0){
		socket.emit('setSelectedSerie', --session.selection.serie)
	}
})

// DOWN
shortcut.add("F2",function(){
	if (session.selection.shot < session.serieHistory[session.selection.serie].length-1){
		socket.emit('setSelectedShot', ++session.selection.shot)
	}
	else if (session.selection.serie < session.serieHistory.length-1){
		socket.emit('setSelectedSerie', ++session.selection.serie)
		socket.emit('setSelectedShot', 0)
	}
})

// Enter/ Menu
shortcut.add("F3",function() {
	$('#disziplinMenu').modal('show')
})

// Shutdown
// shortcut.add("F4",function() {
// 	alert("Shutdown");
// })

// Neue Scheibe
shortcut.add("F5",function() {
	if (session.type == "probe"){
		socket.emit("newTarget", {})
	}
})

// OK
// shortcut.add("F6",function() {
// 	alert("OK");
// })

// Drucken
// shortcut.add("F7",function() {
// 	alert("Drucken");
// })

// Abbrechen/ Probe/ Match
shortcut.add("F8",function() {
	if (session.type == "probe"){
		socket.emit("switchToMatch", {})
	}
})












// Socket.io

socket.on('setSession', function(newSession){
	session = newSession
	moduleAPI.setSession(session)
});

socket.on('setConfig', function(config){
	moduleAPI.setConfig(config)
});

socket.on('newShot', function(shot){
	moduleAPI.newShot(shot)
});
