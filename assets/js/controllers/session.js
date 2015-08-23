angular.module('dsc.controllers.session', []).
controller('aktuelleSerie', ['$scope', '$sce', "socket", function ($scope, $sce, socket) {
	socket.on("setSession", function (session) {
		var aktuelleSerie

		var serie = session.serieHistory[session.selection.serie]
		if (serie){
			aktuelleSerie = []
			for (var i = 0; i < serie.length; i++){
				var shot = {
					ring: serie[i].ring,
					teiler: serie[i].teiler,
					winkel: serie[i].winkel
				}

				var pfeil
				var winkel
				if (shot.teiler > session.disziplin.scheibe.innenZehner) {
					pfeil = "&#8594;"
					winkel = - Math.round(shot.winkel)
				}
				else {
					pfeil = "&#9099;"
					winkel = - Math.round(shot.winkel+225)
				}


				aktuelleSerie.push({
					index: i+1,
					value: shot.ring,
					arrow: $sce.trustAsHtml(pfeil),
					winkel: winkel,
					selectedClass: i == session.selection.shot ? "bold" : "",
				})

			}
		}

		$scope.aktuelleSerie = aktuelleSerie;

		if (
			aktuelleSerie == undefined ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false

		$scope.selectShot = function(index){
			socket.emit('setSelectedShot', index)
		}
	});
}]).



controller('aktuellerSchuss', ['$scope', '$sce', "socket", function ($scope, $sce, socket) {
	socket.on("setSession", function (session) {
		var currentShot

		var serie = session.serieHistory[session.selection.serie]
		if (serie){
			currentShot = {
				teiler: serie[session.selection.shot].teiler,
				ring: serie[session.selection.shot].ring,
				winkel: serie[session.selection.shot].winkel,
			}
			if (currentShot){
				if (currentShot.teiler > session.disziplin.scheibe.innenZehner) {
					currentShot.pfeil = $sce.trustAsHtml("&#8594;")
					currentShot.winkel = - Math.round(currentShot.winkel)
				}
				else {
					currentShot.pfeil = $sce.trustAsHtml("&#9099;")
					currentShot.winkel = - Math.round(currentShot.winkel+225)
				}
			}
		}

		$scope.currentShot = currentShot;

		if (
			currentShot == undefined ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
}]).



controller('serien', function ($scope, socket) {
	socket.on("setSession", function (session) {
		var serien = []
		for(i in session.serieHistory){
			var ringeSerie = 0
			for(ii in session.serieHistory[i]){
				ringeSerie += session.serieHistory[i][ii].ringInt
			}
			serien.push({
				index: i,
				value: ringeSerie,
				selectedClass: i == session.selection.serie ? "bold" : "",
			})
		}

		$scope.serien = serien;

		if (
			serien.length == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});

	$scope.selectSerie = function(index){
		socket.emit('setSelectedSerie', index)
	}
}).



controller('ringeGesamt', function ($scope, socket) {
	socket.on("setSession", function (session) {
		var gesamt = 0
		var ringeSerie
		for(i in session.serieHistory){
			ringeSerie = 0
			for(ii in session.serieHistory[i]){
				ringeSerie += session.serieHistory[i][ii].ringInt
			}
			gesamt += ringeSerie
		}
		$scope.gesamt = gesamt
		$scope.gesamtSerie = ringeSerie

		if (
			session.serieHistory.length == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
}).



controller('schnitt', function ($scope, socket) {
	socket.on("setSession", function (session) {
		var gesamt = 0
		var count = 0
		for(i in session.serieHistory){
			count += session.serieHistory[i].length
			for(ii in session.serieHistory[i]){
				gesamt += session.serieHistory[i][ii].ringInt
			}
		}
		$scope.schnitt = (Math.round(gesamt/ count * 10)/ 10).toFixed(1)

		var part = session.disziplin.parts[session.type]
		if (part.average.enabled == true){
			var hochrechnung = gesamt/ count * part.average.anzahl
			$scope.schnittCalc = Math.round(hochrechnung) + " " + ((hochrechnung==1) ? "Ring" : "Ringe")
		}
		else {
			$scope.schnittCalc = 0
		}

		if (
			count == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
}).



controller('anzahlShots', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.gesamt = 0

		for(i in session.serieHistory){
			$scope.gesamt += session.serieHistory[i].length
			$scope.serie = session.serieHistory[i].length
		}

		if (
			$scope.gesamt == 0
		) $scope.hidden = true
		else $scope.hidden = false
	});
}).



controller('restTime', ['$scope', "socket", 'timeFunctions', function ($scope, socket, timeFunctions) {
	var refreshIntervalId

	function secondsToString(seconds){

		var numhours = Math.floor(seconds / 3600)
		var numminutes = Math.floor((seconds % 3600) / 60)
		var numseconds = (seconds % 3600) % 60

		var string = ""
		if(numhours > 0){ string += numhours.toFixedDown(0) + "h " }
		if(numminutes > 0){ string += numminutes.toFixedDown(0) + "m " }
		if(numseconds > 0){ string += numseconds.toFixedDown(0) + "s " }

		return string
	}

	socket.on("setSession", function (session) {
		function refresh($scope){
			if (session.time.enabled == true){
				var date = (session.time.end - (new Date().getTime()))/1000

				$scope.label = "Verbleibende Zeit"
				if (date > 0){
					$scope.rest = secondsToString(date)
				}
				else {
					$scope.rest = "Zeit abgelaufen"
				}
				$scope.gesamt = secondsToString(session.time.duration*60)
			}
		}

		timeFunctions.$clearInterval( refreshIntervalId );
		refreshIntervalId = timeFunctions.$setInterval(refresh, 1000, $scope);
		refresh($scope)

		if (
			session.time.enabled == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
}]).





controller('grafik', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.session = session
	});
}).







directive('target', ['$timeout', '$window', function($timeout, $window){

	return {
		template: '<canvas ng-hide="image" width="2000" height="2000" style="position: relative;"></canvas>',
		scope: {
			session: '=',
		},
		link: function postlink(scope, element, attrs){
			var canvas = element.find('canvas')[0];
			var canvas2D = !!$window.CanvasRenderingContext2D;


			var zoom = {}
			var currentRing = {}

			function drawScheibe(context, scheibe){
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
					context.lineWidth = 4;
					context.stroke();
					context.fillStyle = "black";

					if (ring.text == true){
						context.font = "bold "+(scheibe.text.size*zoom.scale)+"px verdana, sans-serif";
						context.fillStyle = ring.textColor
						context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + scheibe.text.left)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2 + ring.width/2 + scheibe.text.right)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 + ring.width/2 + scheibe.text.down)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 - ring.width/2 + scheibe.text.up)*zoom.scale+zoom.offset.y);
					}
				}

				for (var i = scheibe.ringeDrawOnly.length-1; i >= 0; i--){
					var ring = scheibe.ringeDrawOnly[i]

					context.globalAlpha = 1.0
					context.fillStyle = ring.color;
					context.beginPath();
					context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
					context.closePath();

					context.fill();
					context.strokeStyle = ring.textColor
					context.lineWidth = 4;
					context.stroke();
					context.fillStyle = "black";
				}

				// Probeecke
				var parts = session.disziplin.parts
				if (parts[session.type].probeEcke == true){
					context.beginPath()
					context.moveTo(1450,50)
					context.lineTo(1950,50)
					context.lineTo(1950,550)
					context.fillStyle = scheibe.probeEcke.color
					context.globalAlpha = scheibe.probeEcke.alpha
					context.fill();
				}
			}

			function drawShot(context, shot, scheibe, last){
				var lastRing = scheibe.ringe[scheibe.ringe.length-1]

				if (last){
					if (currentRing){
						context.fillStyle = currentRing.hitColor
					}
					else {
						context.fillStyle = scheibe.defaultHitColor
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

			function drawMode(context, session, scheibe){
				var serie = session.serieHistory[session.selection.serie]
				if (serie){
					for (i in serie){
						if (i != session.selection.shot){
							drawShot(context, serie[i], scheibe, false)
						}
					}
					if (serie.length > session.selection.shot){
						var selectedShot = serie[session.selection.shot]
						drawShot(context, selectedShot, scheibe, true)
					}
				}
			}

			function resize() {
				var width = element.parent().outerWidth(true)
				var height = element.parent().outerHeight(true)

				var newHeight = width

				if (newHeight > height) {
					width = height
				}
				else {
					height = newHeight
				}

				a_canvas.style.top = (element.parent().height() - height) / 2 + "px";
				a_canvas.style.width = width+'px';
				a_canvas.style.height = height+'px';
			}
			window.addEventListener('load', resize, false);
			window.addEventListener('resize', resize, false);

			var render = function(a_canvas){
				var context = a_canvas.getContext("2d");

				resize()

				if (scope.session != undefined){
					var session = scope.session
					var serie = session.serieHistory[session.selection.serie]

					context.clearRect(0, 0, a_canvas.width, a_canvas.height);

					var scheibe = session.disziplin.scheibe
					if (serie != undefined && serie.length != 0) {
						var ringInt = serie[session.selection.shot].ringInt
						var ring = scheibe.ringe[scheibe.ringe.length - ringInt]

						currentRing = undefined
						if (ring){
							currentRing = ring
							zoom = ring.zoom
						}
						else if (ringInt == 0){
							zoom = scheibe.minZoom
						}
						else {
							zoom = scheibe.defaultZoom
						}
					}
					else {
						zoom = scheibe.defaultZoom
					}

					drawScheibe(context, scheibe)
					drawMode(context, session, scheibe)
				}
			};

			$timeout(function(){
				scope.$watch('session', function(value, old){
					render(canvas)
				})
			});
		}
	};
}]);
