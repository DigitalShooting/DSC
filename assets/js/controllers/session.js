angular.module('dsc.controllers.session', [])


.controller('aktuelleSerie', ['$scope', '$sce', "socket", "dscAPI", function ($scope, $sce, socket, dscAPI) {
	socket.on("setSession", function (session) {
		var aktuelleSerie

		var serie = session.serieHistory[session.selection.serie]
		if (serie){
			aktuelleSerie = []
			for (var i = 0; i < serie.length; i++){
				var shot = {
					ring: serie[i].ring,
					teiler: serie[i].teiler,
					winkel: serie[i].winkel,
					number: serie[i].number,
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
		dscAPI.setSelectedSerie(index)
	}
})



.controller('ringeGesamt', function ($scope, socket) {
	socket.on("setSession", function (session) {
		var gesamt = 0
		var ringeAktuelleSerie
		for(i in session.serieHistory){
			var ringeSerie = 0
			for(ii in session.serieHistory[i]){
				ringeSerie += session.serieHistory[i][ii].ringInt
			}
			if (i == session.selection.serie){
				ringeAktuelleSerie = ringeSerie
			}
			gesamt += ringeSerie
		}
		$scope.gesamt = gesamt
		$scope.gesamtSerie = ringeAktuelleSerie

		if (
			session.serieHistory.length == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('schnitt', function ($scope, socket) {
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
			$scope.schnittCalc = ""
		}

		if (
			count == 0 ||
			session.disziplin.parts[session.type].showInfos == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('anzahlShots', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.gesamt = session.anzahl
		$scope.serie = session.serien[session.selection.serie].shots.length

		console.log($scope.gesamt)

		// for(i in session.serieHistory){
		// 	$scope.gesamt += session.serieHistory[i].length
		// 	if (i == session.selection.serie){
		// 		$scope.serie = session.serieHistory[i].length
		// 	}
		// }

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
		console.log(session)

		var serie = session.serieHistory[session.selection.serie]
		if (serie == undefined) {
			serie = []
		}

		var scheibe = session.disziplin.scheibe
		var zoom

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

		$scope.serie = serie
		$scope.scheibe = scheibe
		$scope.zoomlevel = zoom
		$scope.selectedshotindex = session.selection.shot
		$scope.probeecke = session.disziplin.parts[session.type].probeEcke
	//
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
