var socket = io();



var a_canvas = document.getElementById("grafik");
console.log(a_canvas)
var context = a_canvas.getContext("2d");

// var zoom.scale = 43.5
// var offset = {
// 	x: 10,
// 	y: 10
// }

// var zoom.scale = 70
// var offset = {
// 	x: -600,
// 	y: -600
// }

// var zoom.scale = 100
// var offset = {
// 	x: -1270,
// 	y: -1270
// }





Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};


// --------------------------------------------------------
// Grafik Modul

var moduleAPI = {
	modules: [],

	init: function(){
		this.modules = [ draw(session), aktuelleSerie(session), ringeGesamt(session), aktuellerSchuss(session), serien(session), ringeAktuelleSerie(session), anzahlShots(session), anzahlShotsSerie(session), schnitt(session), teiler(session) ]
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

		//session.mode.shots.push(shot)

		this.modules.forEach(function(moduleObject){
			moduleObject.newShot(shot, disziplin.scheibe)
		})
	},
}

var draw = function(session){

	var zoom = {}
	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		context.clearRect(0, 0, a_canvas.width, a_canvas.height);

		if (mode.serie.length != 0) {
			var scheibe = mode.disziplin.scheibe
			var ringInt = mode.serie[mode.serie.length-1].ringInt
			var ring = scheibe.ringe[scheibe.ringe.length - ringInt]
			if (ring){
				zoom = ring.zoom
			}
			else {
				zoom = mode.disziplin.scheibe.defaultZoom
			}
		}
		else {
			zoom = mode.disziplin.scheibe.defaultZoom
		}

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
			context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
			context.closePath();

			context.fill();
			context.strokeStyle = ring.textColor
			context.lineWidth = 1;
			context.stroke();
			context.fillStyle = "black";

			if (ring.text == true){
				// context.font = (10*zoom.zoom.scale)+" px";
				context.font = "bold "+(1*zoom.scale)+"px verdana, sans-serif";
				context.fillStyle = ring.textColor
				context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + 0.95)*zoom.scale+zoom.offset.x, (lastRing.width/2+0.3)*zoom.scale+zoom.offset.y);
				context.fillText(ring.value, (lastRing.width/2 + ring.width/2 - 1.7)*zoom.scale+zoom.offset.x, (lastRing.width/2+0.3)*zoom.scale+zoom.offset.y);
				context.fillText(ring.value, (lastRing.width/2-0.3)*zoom.scale+zoom.offset.x, (lastRing.width/2 + ring.width/2 - 0.8)*zoom.scale+zoom.offset.y);
				context.fillText(ring.value, (lastRing.width/2-0.3)*zoom.scale+zoom.offset.x, (lastRing.width/2 - ring.width/2 + 1.8)*zoom.scale+zoom.offset.y);
			}
		}
	}

	function drawShot(shot, scheibe, last){
		var lastRing = scheibe.ringe[scheibe.ringe.length-1]

		if (last){
			context.fillStyle = "#ff0000";
			context.globalAlpha = 1.0
		}
		else {
			context.fillStyle = "#cccccc";
			context.globalAlpha = 0.5
		}
		context.beginPath();
		context.arc((lastRing.width/2 + shot.x/1000)*zoom.scale+zoom.offset.x, (lastRing.width/2 - shot.y/1000)*zoom.scale+zoom.offset.y, scheibe.kugelDurchmesser/2*zoom.scale, 0, 2*Math.PI);
		context.closePath();
		context.fill();
	}

	function drawMode(mode, scheibe){
		for (i in mode.serie){
			drawShot(mode.serie[i], scheibe, i==mode.serie.length-1)
		}
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
			$("#modules .serien ul").append("<li class='list-group-item'>"+ringeSerie+"</li>")
		}
		var ringeSerieAktuell = 0
		for(i in mode.serie){
			ringeSerieAktuell += mode.serie[i].ringInt
		}
		$("#modules .serien ul").append("<li class='list-group-item'><b>"+ringeSerieAktuell+"</b></li>")
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
			$("#modules .aktuelleSerie ul").append("<li class='list-group-item'>"+shot.ring+"</li>")
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
			gesamt += mode.serie[i].ringInt
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
		else {
			$("#modules .aktuellerSchuss p").text("")
		}
	}
	function drawShot(shot){
		$("#modules .aktuellerSchuss p").text(shot.ring)
	}

	return moduleObject
}
var anzahlShots = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		var anzahl = mode.serie.length

		for(i in mode.serieHistory){
			anzahl += mode.serieHistory[i].length
		}

		$("#modules .anzahlShots p").text(anzahl)
	}

	return moduleObject
}
var anzahlShotsSerie = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		var anzahl = mode.serie.length

		$("#modules .anzahlShotsSerie p").text(anzahl)
	}

	return moduleObject
}
var schnitt = function(session){

	update(session.mode)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session.mode)
	}

	function update(mode){
		var gesamt = 0
		var anzahl = mode.serie.length
		for(i in mode.serie){
			gesamt += mode.serie[i].ringInt
		}
		for(i in mode.serieHistory){
			anzahl += mode.serieHistory[i].length
			for(ii in mode.serieHistory[i]){
				gesamt += mode.serieHistory[i][ii].ringInt
			}
		}
		if (anzahl > 0){
			$("#modules .schnitt p").text(Math.round(gesamt/ anzahl * 10)/ 10)
		}
		else {
			$("#modules .schnitt p").text("")
		}
	}

	return moduleObject
}
var teiler = function(session){

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
		$("#modules .teiler p").text(Math.round(shot.teiler*100)/100)
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








function resize() {
	var width = $("#grafik").outerWidth(true)

	var ratio = a_canvas.width/a_canvas.height;
	var height = width * ratio;

	a_canvas.style.width = width+'px';
	a_canvas.style.height = height+'px';
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
