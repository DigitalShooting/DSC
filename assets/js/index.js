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
		this.modules = [ draw(session), aktuelleSerie(session), ringeGesamt(session), aktuellerSchuss(session), serien(session), anzahlShots(session), schnitt(session), time(session), nameS(session), verein(session), disziplin(session) ]
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
	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		context.clearRect(0, 0, a_canvas.width, a_canvas.height);

		if (session.serie.length != 0) {
			var scheibe = session.disziplin.scheibe
			var ringInt = session.serie[session.serie.length-1].ringInt
			var ring = scheibe.ringe[scheibe.ringe.length - ringInt]
			if (ring){
				currentRing = ring
				zoom = ring.zoom
			}
			else {
				zoom = session.disziplin.scheibe.defaultZoom
			}
		}
		else {
			zoom = session.disziplin.scheibe.defaultZoom
		}

		drawScheibe(session.disziplin.scheibe)
		drawMode(session, session.disziplin.scheibe)
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
			context.lineWidth = 2;
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
		if (session.type == "probe"){
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

	function drawMode(session, scheibe){
		for (i in session.serie){
			drawShot(session.serie[i], scheibe, i==session.serie.length-1)
		}
	}

	return moduleObject
}
var serien = function(session){

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		$(".serien table").html("")

		for(i in session.serieHistory){
			var ringeSerie = 0
			for(ii in session.serieHistory[i]){
				ringeSerie += session.serieHistory[i][ii].ringInt
			}
			$(".serien table").append("<tr><td>"+ringeSerie+"</li></td></tr>")
		}
		var ringeSerieAktuell = 0
		for(i in session.serie){
			ringeSerieAktuell += session.serie[i].ringInt
		}
		$(".serien table").append("<tr><td><b>"+ringeSerieAktuell+"</b></td></tr>")
	}

	return moduleObject
}
var aktuelleSerie = function(session){

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		$(".aktuelleSerie table").html("")

		for (var i = 0; i < session.serie.length; i++){
			var shot = session.serie[i]
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

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		var gesamt = 0
		for(i in session.serie){
			gesamt += session.serie[i].ringInt
		}
		var gesamtSerie = gesamt
		for(i in session.serieHistory){
			for(ii in session.serieHistory[i]){
				gesamt += session.serieHistory[i][ii].ringInt
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

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		if (session.serie.length > 0){
			drawShot(session.serie[session.serie.length-1])
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

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		var anzahl = session.serie.length

		for(i in session.serieHistory){
			anzahl += session.serieHistory[i].length
		}

		if (session.disziplin.anzahlShots == 0){
			$(".anzahlShots .value").text(anzahl)
		}
		else {
			$(".anzahlShots .value").text(anzahl + "/ "+session.disziplin.anzahlShots)
		}
		$(".anzahlShots .value2").text(session.serie.length)
	}

	return moduleObject
}
var schnitt = function(session){

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){
		update(session)
	}

	function update(session){
		var gesamt = 0
		var anzahl = session.serie.length
		for(i in session.serie){
			gesamt += session.serie[i].ringInt
		}
		for(i in session.serieHistory){
			anzahl += session.serieHistory[i].length
			for(ii in session.serieHistory[i]){
				gesamt += session.serieHistory[i][ii].ringInt
			}
		}
		if (anzahl > 0){
			var schnitt = (Math.round(gesamt/ anzahl * 10)/ 10).toFixed(1)
			$(".schnitt .value").text(schnitt)
			if (session.disziplin.anzahlShots > 0){
				var textRingeM = "Ringe"
				var textRinge = "Ring"
				var hochrechnung = schnitt * session.disziplin.anzahlShots
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



var time = function(session){

	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){

	}


	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}

	function update(session){
		var refresh = function(){
			var date = new Date()
			$(".time .value").text(n(date.getHours())+":"+n(date.getMinutes())+":"+n(date.getSeconds())+" Uhr")
			$(".time .value2").text(n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear()))
		}
		setInterval(refresh, 1000)
		refresh()
	}


	return moduleObject
}
var nameS = function(session){
	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){}

	function update(session){
		$(".name .value").text(session.user.lastName + " " + session.user.firstName)
	}

	return moduleObject
}
var verein = function(session){
	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){}

	function update(session){
		$(".verein .value").text(session.user.verein)
		$(".verein .value2").text(session.user.manschaft)
	}

	return moduleObject
}
var disziplin = function(session){
	update(session)

	var moduleObject = {}
	moduleObject.newShot = function(shot, scheibe){}

	function update(session){
		$(".disziplin .value").text(session.disziplin.title)
		$(".disziplin .value2").text(session.disziplin.scheibe.title)
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
	console.log(session.disziplin.scheibe)
	// newShot(shot, session.disziplin.scheibe)
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
