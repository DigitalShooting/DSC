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
}])