var socket = io();




var a_canvas = document.getElementById("grafik");
console.log(a_canvas)
var context = a_canvas.getContext("2d");


// var scale = 60
// var offset = {
// 	x: -760,
// 	y: -760
// }

// var scale = 80
// var offset = {
// 	x: -1220,
// 	y: -1220
// }

var scale = 12
var offset = {
	x: 1,
	y: 1
}






// --------------------------------------------------------
// Grafik Modul

var moduleAPI = {
	modules: [],

	init: function(){
		this.modules = [ draw(session), aktuelleSerie(session), ringeGesamt(session), aktuellerSchuss(session), serien(session), ringeAktuelleSerie(session) ]
	},

	newShot: function(shot){
		var disziplin = session.mode.disziplin
		if (disziplin.serienLength == session.mode.serie.length){
			session.mode.serieHistory.push(session.mode.serie)
			session.mode.serie = [shot]
		}
		else {
			session.mode.serie.push(shot)
		}

		session.mode.shots.push(shot)

		this.modules.forEach(function(moduleObject){
			moduleObject.newShot(shot, disziplin.scheibe)
		})
	},
}

var draw = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		context.clearRect(0, 0, a_canvas.width, a_canvas.height);

		drawScheibe(session.mode.disziplin.scheibe)
		drawMode(session.mode, session.mode.disziplin.scheibe)
	}

	function drawScheibe(scheibe){
		var lastRing = scheibe.ringe[scheibe.ringe.length-1]
		for (var i = scheibe.ringe.length-1; i >= 0; i--){
			var ring = scheibe.ringe[i]

			context.globalAlpha = 1.0
			context.fillStyle = ring.color;
			context.beginPath();
			context.arc(lastRing.width/2*scale+offset.x, lastRing.width/2*scale+offset.y, ring.width/2*scale, 0, 2*Math.PI);
			context.closePath();

			context.fill();
			context.strokeStyle = ring.textColor
			context.lineWidth = 1;
			context.stroke();
			context.fillStyle = "black";

			if (ring.text == true){
				// context.font = (10*scale)+" px";
				context.font = "bold "+(1*scale)+"px verdana, sans-serif";
				context.fillStyle = ring.textColor
				context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + 0.95)*scale+offset.x, (lastRing.width/2+0.3)*scale+offset.y);
				context.fillText(ring.value, (lastRing.width/2 + ring.width/2 - 1.7)*scale+offset.x, (lastRing.width/2+0.3)*scale+offset.y);
				context.fillText(ring.value, (lastRing.width/2-0.3)*scale+offset.x, (lastRing.width/2 + ring.width/2 - 0.8)*scale+offset.y);
				context.fillText(ring.value, (lastRing.width/2-0.3)*scale+offset.x, (lastRing.width/2 - ring.width/2 + 1.8)*scale+offset.y);
			}
		}
	}

	function drawShot(shot, scheibe){
		var lastRing = scheibe.ringe[scheibe.ringe.length-1]

		context.fillStyle = "gray";
		context.globalAlpha = 0.7
		context.beginPath();
		context.arc((lastRing.width/2 + shot.x/1000)*scale+offset.x, (lastRing.width/2 - shot.y/1000)*scale+offset.y, scheibe.kugelDurchmesser/2*scale, 0, 2*Math.PI);
		context.closePath();
		context.fill();
	}

	function drawMode(mode, scheibe){
		mode.serie.forEach(function(shot){
			drawShot(shot, scheibe)
		})
	}

	return moduleObject
}
var serien = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		$("#modules .serien ul").html("")

		for(i in mode.serieHistory){
			var ringeSerie = 0
			for(ii in mode.serieHistory[i]){
				ringeSerie += mode.serieHistory[i][ii].ringInt
			}
			$("#modules .serien ul").append("<li>"+ringeSerie+"</li>")
		}
		var ringeSerieAktuell = 0
		for(i in mode.serie){
			ringeSerieAktuell += mode.serie[i].ringInt
		}
		$("#modules .serien ul").append("<li><b>"+ringeSerieAktuell+"</b></li>")
	}

	return moduleObject
}
var aktuelleSerie = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		$("#modules .aktuelleSerie ul").html("")
		mode.serie.forEach(function(shot){
			$("#modules .aktuelleSerie ul").append("<li>"+shot.ring+"</li>")
		})
	}

	return moduleObject
}
var ringeAktuelleSerie = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		var ringeSerieAktuell = 0
		for(i in mode.serie){
			ringeSerieAktuell += mode.serie[i].ringInt
		}
		$("#modules .ringeAktuelleSerie p").text(ringeSerieAktuell)
	}

	return moduleObject
}
var ringeGesamt = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		var gesamt = 0
		for(i in mode.serie){
			gesamt += mode.shots[i].ringInt
		}
		for(i in mode.serieHistory){
			for(ii in mode.serieHistory[i]){
				gesamt += mode.serieHistory[i][ii].ringInt
			}
		}
		$("#modules .ringeGesamt p").text(gesamt)
	}

	return moduleObject
}
var aktuellerSchuss = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		if (mode.serie.length > 0){
			drawShot(mode.serie[mode.serie.length-1])
		}
	}
	function drawShot(shot){
		$("#modules .aktuellerSchuss p").text(shot.ring)
	}

	return moduleObject
}






// Init
socket.on('init', function(newSession){
	console.log('changedMode: ' + newSession);
	session = newSession
	moduleAPI.init()
});




// Mode (LG Traning, LP Wettkampf, ...)
socket.on('mode.change', function(data){
	console.log('changedMode: ' + data);
});



// User
socket.on('user.switch', function(data){
	console.log('changedUser: ' + data);
});
socket.on('user.changeSettings', function(data){
	console.log('changedUser Settings: ' + data);
});



// Shot stuff
socket.on('shot.new', function(shot){
	console.log('newShot: ' + shot);
	console.log(session.mode.disziplin.scheibe)
	// newShot(shot, session.mode.disziplin.scheibe)
	moduleAPI.newShot(shot)
});
socket.on('shot.newTarget', function(data){
	console.log('newTarget: ' + data);
});
socket.on('shot.switchToMatch', function(data){
	console.log('switchToMatch: ' + data);
});
socket.on('shot.switchToProbe', function(data){
	console.log('switchToProbe: ' + data);
});



// Reset
socket.on('reset.exit', function(data){
	console.log('reset: ' + data);
});
