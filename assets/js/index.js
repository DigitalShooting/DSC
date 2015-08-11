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
		modules.restTime(),
		modules.switchPart(),
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

		var part = disziplin.parts[session.type]
		if (part.serienLength == lastObject(session.serieHistory).length){
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
	if (session.disziplin.parts[session.type].neueScheibe == true)
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
	var index = 0
	for (var i = 0; i < session.disziplin.partsOrder.length; i++){
		var key = session.disziplin.partsOrder[i]

		if (key == session.type){
			index = i
			break
		}
	}

	var nextIndex = i + 1

	if (nextIndex < session.disziplin.partsOrder.length){
		var key = session.disziplin.partsOrder[nextIndex]

		socket.emit("switchToPart", key)
	}
})












// Socket.io

socket.on('disconnect', function(){
	$(".status .socket").css("background-color", "black")
});
socket.on('connect', function(){
	$(".status .socket").css("background-color", "transparent")
});

socket.on('setStatus', function(connected){
	if (connected == true){
		$(".status .interface").css("background-color", "transparent")
	}
	else {
		$(".status .interface").css("background-color", "black")
	}
});




socket.on('setSession', function(newSession){
	session = newSession
	moduleAPI.setSession(session)
	$(".infoBox").hide()
});

socket.on('setConfig', function(config){
	moduleAPI.setConfig(config)
	$(".infoBox").hide()
});

socket.on('newShot', function(shot){
	moduleAPI.newShot(shot)
	$(".infoBox").hide()
});

socket.on('info', function(message){
	$(".infoBox .title").text(message.title)
	$(".infoBox .text").text(message.text)
	$(".infoBox").show()
});
