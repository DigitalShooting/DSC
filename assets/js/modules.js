var modules = {
	draw: function(){
		var a_canvas = document.getElementById("grafik");
		var context = a_canvas.getContext("2d");

		function resize() {
			var width = $(".grafik").outerWidth(true)
			var height = $(".grafik").outerHeight(true)

			var ratio = a_canvas.width/a_canvas.height;
			var newHeight = width * a_canvas.width/a_canvas.height;

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

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	serien: function(){
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
			if (session.serie.length > 0) {
				$(".serien table").append("<tr><td><b>"+ringeSerieAktuell+"</b></td></tr>")
			}
		}

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	aktuelleSerie: function(){
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

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	ringeGesamt: function(){
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

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	aktuellerSchuss: function(){
		function update(session){
			if (session.serie.length > 0){
				drawShot(session.serie[session.serie.length-1])
			}
			else {
				$(".aktuellerSchuss .value").text("")
				$(".aktuellerSchuss .value2").text("")
			}
		}
		function drawShot(shot){
			$(".aktuellerSchuss .value").text(shot.ring)
			$(".aktuellerSchuss .value2").text(Math.round(shot.teiler*10)/10 + " Teiler")
		}

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	anzahlShots: function(){
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

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	schnitt: function(){
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

		var moduleObject = {}
		moduleObject.newShot = function(shot, scheibe){
			update(session)
		}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	time: function(){
		init()

		function n(n){
			return n > 9 ? "" + n: "0" + n;
		}

		function init(){
			var refresh = function(){
				var date = new Date()
				$(".time .value").text(n(date.getHours())+":"+n(date.getMinutes())+":"+n(date.getSeconds())+" Uhr")
				$(".time .value2").text(n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear()))
			}
			setInterval(refresh, 1000)
			refresh()
		}

		var moduleObject = {}
		return moduleObject
	},



	name: function(){
		function update(session){
			$(".name .value").text(session.user.lastName + " " + session.user.firstName)
		}

		var moduleObject = {}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	verein: function(){
		function update(session){
			$(".verein .value").text(session.user.verein)
			$(".verein .value2").text(session.user.manschaft)
		}

		var moduleObject = {}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	disziplin: function(){
		function update(session){
			$(".disziplin .value").text(session.disziplin.title)
			$(".disziplin .value2").text(session.disziplin.scheibe.title)
		}

		var moduleObject = {}
		moduleObject.setSession = function(session){
			update(session)
		}
		return moduleObject
	},



	menu: function(){
		$(".menu").click(function(){
			$('#mainMenu').modal('show')
		})
		$("#mainMenu .actionNewTarget").click(function(){
			socket.emit("newTarget", {})
			$('#mainMenu').modal('hide')
		})
		$("#mainMenu .actionMatch").click(function(){
			socket.emit("switchToMatch", {})
			$('#mainMenu').modal('hide')
		})


		var moduleObject = {}
		return moduleObject
	}
}
