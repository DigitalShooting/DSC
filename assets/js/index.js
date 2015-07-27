var socket = io()

Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};


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
		modules.menu(),
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
		if (disziplin.serienLength == session.serie.length){
			session.serieHistory.push(session.serie)
			session.serie = [shot]
		}
		else {
			session.serie.push(shot)
		}

		this.activeModules.forEach(function(moduleObject){
			if (moduleObject.newShot) {
				moduleObject.newShot(shot, disziplin.scheibe)
			}
		})
	},
}





// Socket.io

socket.on('setSession', function(newSession){
	session = newSession
	moduleAPI.setSession(session)
});

socket.on('newShot', function(shot){
	moduleAPI.newShot(shot)
});
