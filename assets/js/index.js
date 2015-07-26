var socket = io()

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
		this.modules = [ draw(session), aktuelleSerie(session), ringeGesamt(session), aktuellerSchuss(session), serien(session), anzahlShots(session), schnitt(session) ]
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

		this.modules.forEach(function(moduleObject){
			moduleObject.newShot(shot, disziplin.scheibe)
		})
	},
}

var draw = function(session){

	var a_canvas = document.getElementById("grafik");
	console.log(a_canvas)
	var context = a_canvas.getContext("2d");

	function resize() {
		var width = $(".grafik").outerWidth(true)
		var height = $(".grafik").outerHeight(true)

		console.log(width + " " + height)

		var ratio = a_canvas.width/a_canvas.height;
		var newHeight = width * a_canvas.width/a_canvas.height;

		console.log(newHeight)

		if (newHeight > height) {
			width = height * a_canvas.height/a_canvas.width;
		}
		else {
			height = newHeight
		}

		a_canvas.style.width = width+'px';
		a_canvas.style.height = height+'px';
	}
	resize()

	window.addEventListener('load', resize, false);
	window.addEventListener('resize', resize, false);

	var zoom = {}
	var currentRing = {}
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
				currentRing = ring
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

		// Probeecke
		if (session.mode.type == "probe"){
			context.beginPath()
			context.moveTo(1450,50)
			context.lineTo(1950,50)
			context.lineTo(1950,550)
			context.fillStyle = scheibe.probeEcke.color
			context.globalAlpha = scheibe.probeEcke.alpha
			context.fill();
		}

	}

	function drawShot(shot, scheibe, last){
		var lastRing = scheibe.ringe[scheibe.ringe.length-1]

		if (last){
			if (currentRing){
				context.fillStyle = currentRing.hitColor
				console.log(currentRing)
			}
			else {
				context.fillStyle = "#ff0000";
			}

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
		$(".serien table").html("")

		for(i in mode.serieHistory){
			var ringeSerie = 0
			for(ii in mode.serieHistory[i]){
				ringeSerie += mode.serieHistory[i][ii].ringInt
			}
			$(".serien table").append("<tr><td>"+ringeSerie+"</li></td></tr>")
		}
		var ringeSerieAktuell = 0
		for(i in mode.serie){
			ringeSerieAktuell += mode.serie[i].ringInt
		}
		$(".serien table").append("<tr><td><b>"+ringeSerieAktuell+"</b></td></tr>")
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
		$(".aktuelleSerie table").html("")

		for (var i = 0; i < mode.serie.length; i++){
			var shot = mode.serie[i]
			// TODO: Pfeile http://www.key-shortcut.com/schriftsysteme/mathematik-technik/pfeile.html


			var pfeil = "&#8635;"
			if (shot.ring < 10.3) {
				if (shot.winkel >= 22.5 && shot.winkel < 67.5) pfeil = " &#8599;"
				else if (shot.winkel >= 67.5 && shot.winkel < 112.5) pfeil = " &#8593;"
				else if (shot.winkel >= 112.5 && shot.winkel < 157.5) pfeil = " &#8598;"
				else if (shot.winkel >= 157.5 && shot.winkel < 202.5) pfeil = " &#8592;"
				else if (shot.winkel >= 202.5 && shot.winkel < 247.5) pfeil = " &#8601;"
				else if (shot.winkel >= 247.5 && shot.winkel < 292.5) pfeil = " &#8595;"
				else if (shot.winkel >= 292.5 && shot.winkel < 337.5) pfeil = " &#8600;"
				else pfeil = " &#8594;"
			}

			$(".aktuelleSerie table").append("<tr><td>"+(i+1)+".</td><td><b>"+shot.ring+"</b></td><td>"+pfeil+"</td></tr>")
		}
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
		var gesamtSerie = gesamt
		for(i in mode.serieHistory){
			for(ii in mode.serieHistory[i]){
				gesamt += mode.serieHistory[i][ii].ringInt
			}
		}
		var textRingeM = "Ringe"
		var textRinge = "Ring"
		$(".ringeGesamt .value").text(gesamt + " " + ((gesamt==1) ? textRinge : textRingeM))
		$(".ringeGesamt .value2").text(gesamtSerie + " " + ((gesamt==1) ? textRinge : textRingeM))
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
			$(".aktuellerSchuss .value").text("")
		}
	}
	function drawShot(shot){
		$(".aktuellerSchuss .value").text(shot.ring)
		$(".aktuellerSchuss .value2").text(Math.round(shot.teiler*10)/10 + " Teiler")
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

		if (session.mode.disziplin.anzahlShots == 0){
			$(".anzahlShots .value").text(anzahl)
		}
		else {
			$(".anzahlShots .value").text(anzahl + "/ "+session.mode.disziplin.anzahlShots)
		}
		$(".anzahlShots .value2").text(mode.serie.length)
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
			var schnitt = Math.round(gesamt/ anzahl * 10)/ 10
			$(".schnitt .value").text(schnitt)
			if (mode.disziplin.anzahlShots > 0){
				var textRingeM = "Ringe"
				var textRinge = "Ring"
				var hochrechnung = schnitt * mode.disziplin.anzahlShots
				$(".schnitt .value2").text(Math.round(hochrechnung) + " " + ((hochrechnung==1) ? textRinge : textRingeM))
			}
			else {
				$(".schnitt .value2").text("")
			}
		}
		else {
			$(".schnitt .value").text("")
			$(".schnitt .value2").text("")
		}
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
