angular.module('dsc.controllers.session', [])


.controller('aktuelleSerie', ['$scope', '$sce', "socket", "dscAPI", function ($scope, $sce, socket, dscAPI) {
	socket.on("setSession", function (session) {
		var aktuelleSerie

		var serie = session.serien[session.selection.serie]
		if (serie){
			aktuelleSerie = []
			for (var i = 0; i < serie.shots.length; i++){
				var shot = {
					ring: serie.shots[i].ring.display,
					teiler: serie.shots[i].teiler,
					winkel: serie.shots[i].winkel,
					number: serie.shots[i].number,
				}

				var pfeil
				var winkel
				if (shot.teiler > session.disziplin.scheibe.innenZehner) {
					pfeil = "&#8594;"
					winkel = - parseInt(shot.winkel)
				}
				else {
					pfeil = "&#9099;"
					winkel = - parseInt(shot.winkel) - 225
				}

				aktuelleSerie.push({
					index: i,
					number: shot.number,
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
			dscAPI.setSelectedShot(index)
		}
	});
}])



.controller('aktuellerSchuss', ['$scope', '$sce', "socket", function ($scope, $sce, socket) {
	socket.on("setSession", function (session) {
		var currentShot

		var serie = session.serien[session.selection.serie]
		if (serie){
			currentShot = {
				teiler: serie.shots[session.selection.shot].teiler,
				ring: serie.shots[session.selection.shot].ring.display,
				winkel: serie.shots[session.selection.shot].winkel,
			}
			if (currentShot){
				if (currentShot.teiler > session.disziplin.scheibe.innenZehner) {
					currentShot.pfeil = $sce.trustAsHtml("&#8594;")
					currentShot.winkel = - parseInt(currentShot.winkel)
				}
				else {
					currentShot.pfeil = $sce.trustAsHtml("&#9099;")

					currentShot.winkel = - parseInt(currentShot.winkel) - 225
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
}])



.controller('serien', function ($scope, socket, dscAPI) {
	socket.on("setSession", function (session) {
		var serien = []
		for(i in session.serien){
			serien.push({
				index: i,
				value: session.serien[i].gesamt,
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
		dscAPI.setSelectedSerie(index)
	}
})



.controller('ringeGesamt', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.gesamt = session.gesamt
		if (session.selection.serie < session.serien.length){
			$scope.gesamtSerie = session.serien[session.selection.serie].gesamt
		}

		if (
			session.serien.length == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('schnitt', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.schnitt = session.schnitt
		$scope.schnittCalc = session.schnittCalc

		var part = session.disziplin.parts[session.type]
		if (part.average.enabled == true){
			$scope.schnittCalc = session.schnittCalc + " " + ((session.schnittCalc==1) ? "Ring" : "Ringe")
		}
		else {
			$scope.schnittCalc = ""
		}

		if (
			session.anzahl == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('anzahlShots', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.gesamt = session.anzahl

		if (session.serien[session.selection.serie] != undefined){
			$scope.serie = session.serien[session.selection.serie].shots.length
		}

		if (
			$scope.gesamt == 0
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('restTime', ['$scope', "socket", 'timeFunctions', function ($scope, socket, timeFunctions) {
	var refreshIntervalId

	function secondsToString(seconds){

		var numhours = Math.floor(seconds / 3600)
		var numminutes = Math.floor((seconds % 3600) / 60)
		var numseconds = (seconds % 3600) % 60

		Number.prototype.toFixedDown = function(digits) {
			var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
				m = this.toString().match(re);
				return m ? parseFloat(m[1]) : this.valueOf();
		};

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
}])



.controller('grafik', function ($scope, socket) {
	// $scope.session = undefined

	$scope.scheibe = undefined
	$scope.zoomlevel = undefined
	$scope.serie = undefined
	$scope.selectedshotindex = undefined

	socket.on("setSession", function (session) {
		var serieTmp = session.serien[session.selection.serie]
		var serie
		if (serieTmp == undefined) {
			serie = []
		}
		else {
			serie = serieTmp.shots
		}

		var scheibe = session.disziplin.scheibe
		var zoom

		if (serie != undefined && serie.length != 0) {
			var ringInt = serie[session.selection.shot].ring.value
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

		$scope.serie = serie
		$scope.scheibe = scheibe
		$scope.zoomlevel = zoom
		$scope.selectedshotindex = session.selection.shot
		$scope.probeecke = session.disziplin.parts[session.type].probeEcke
	});
})



.controller('connection', function ($scope, socket) {
	socket.on('disconnect', function(){
		$scope.color = "black"
	});
	socket.on('connect', function(){
		$scope.color = "transparent"
	});
	socket.on('setStatus', function(connected){
		$scope.color = connected == true ? "transparent" : "red"
	});
})




.controller('session', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.session = session
	})
})
