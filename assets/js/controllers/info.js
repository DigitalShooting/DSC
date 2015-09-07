angular.module('dsc.controllers.info', [])


.controller('name', function ($scope, socket) {
	socket.on("setConfig", function (config) {
		$scope.line = config.line.title
	})
	socket.on("setSession", function (session) {
		$scope.name = session.user.firstName + " " + session.user.lastName

		$scope.openUserMenu = function(){
			$('#userMenu').modal('show')

			$("#userMenu .menuItem").click(function(){
				$('#userMenu').modal('hide')
			})
			$("#userMenu .selectUser").click(function(){

			})
		}

		$scope.hidden = false
	});
})



.controller('verein', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.verein = session.user.verein
		$scope.manschaft = session.user.manschaft

		if (
			$scope.verein == "" &&
			$scope.manschaft == ""
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('time', ['$scope', 'timeFunctions', function ($scope, timeFunctions) {
	var refreshIntervalId

	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}

	function refresh($scope){
		var date = new Date()

		$scope.time = n(date.getHours())+":"+n(date.getMinutes())+":"+n(date.getSeconds()) + " Uhr"
		$scope.date = n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear())
	}

	timeFunctions.$clearInterval( refreshIntervalId );
	refreshIntervalId = timeFunctions.$setInterval(refresh, 1000, $scope);
	refresh($scope)
}])



.controller('newTarget', function ($scope, socket, dscAPI) {
	socket.on("setSession", function (session) {
		$scope.newTarget = function(){
			dscAPI.setNewTarget()
		}


		var parts = session.disziplin.parts
		if (
			parts[session.type].neueScheibe == false
		) $scope.hidden = true
		else $scope.hidden = false
	});
})



.controller('part', function ($scope, socket) {
	socket.on("setSession", function (session) {
		var parts = session.disziplin.parts

		$scope.activePart = parts[session.type].title
		$scope.openPartsMenu = function(){
			$('#modeMenu').modal('show')
		}

		$scope.hidden = false
	});
})



.controller('menuParts', function ($scope, socket, dscAPI) {
	socket.on("setSession", function (session) {
		$scope.disziplin = session.disziplin.title
		$scope.parts = []
		for (var id in session.disziplin.parts){
			var part = session.disziplin.parts[id]
			$scope.parts.push({
				id: id,
				title: part.title,
				active: id == session.type ? "active" : ""
			})
		}

		$scope.switchToPart = function(id){
			dscAPI.setPart(id)
			$('#modeMenu').modal('hide')
		}

		$scope.print = function(type){
			dscAPI.print(type)
			$('#modeMenu').modal('hide')
		}
	});
})



.controller('disziplin', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.disziplin = session.disziplin.title
		$scope.scheibe = session.disziplin.scheibe.title

		$scope.openDisziplinMenu = function(){
			$('#disziplinMenu').modal('show')
		}

		$scope.hidden = false
	});
})



.controller('menuDisziplinen', function ($scope, socket, dscAPI) {
	$scope.setDisziplien = function(disziplin){
		dscAPI.setDisziplin(disziplin)
		$('#disziplinMenu').modal('hide')
	}

	socket.on("setConfig", function (config) {
		$scope.disziplinen = config.disziplinen

		$scope.hidden = false
	});
	socket.on("setSession", function (session) {
		// $scope.session = session
		$scope.isActive = function(id){
			return id == session.disziplin._id ? "active" : ""
		}

		$scope.hidden = false
	});
})



.controller('menuUser', function ($scope, dscAPI, socket, auth) {
	$scope.url = location.protocol + '//' + location.host + location.pathname
	$scope.adminUrl = window.location.href

	dscAPI.getTempToken()
	setInterval(dscAPI.getTempToken, 30000)
	socket.on("setTempToken", function (token) {
		$scope.adminUrl = location.protocol + '//' + location.host + location.pathname + "?key=" + token
	})
})



.controller('shortcut', function ($scope, socket, dscAPI) {
	socket.on("setSession", function (session) {

		var previousSerie = function(){
			if (session.selection.serie > 0){
				dscAPI.setSelectedSerie(--session.selection.serie)
			}
		}
		var nextSerie = function(){
			if (session.selection.serie < session.serieHistory.length-1){
				dscAPI.setSelectedSerie(++session.selection.serie)
				dscAPI.setSelectedShot(0)
			}
		}
		var previousShot = function(){
			if (session.selection.shot > 0){
				dscAPI.setSelectedShot(--session.selection.shot)
			}
			else if (session.selection.serie > 0){
				dscAPI.setSelectedSerie(--session.selection.serie)
			}
		}
		var nextShot = function(){
			if (session.selection.shot < session.serieHistory[session.selection.serie].length-1){
				dscAPI.setSelectedShot(++session.selection.shot)
			}
			else if (session.selection.serie < session.serieHistory.length-1){
				dscAPI.setSelectedSerie(++session.selection.serie)
				dscAPI.setSelectedShot(0)
			}
		}
		var newTarget = function(){
			if (session.disziplin.parts[session.type].neueScheibe == true){
				dscAPI.setNewTarget()
			}
		}
		var togglePart = function(){
			var index = 0
			var partsOrder = Object.keys(session.disziplin.parts)

			for (var i = 0; i < partsOrder.length; i++){
				var key = partsOrder[i]

				if (key == session.type){
					index = i
					break
				}
			}

			var nextIndex = i + 1
			var key
			if (nextIndex < partsOrder.length){
				key = partsOrder[nextIndex]
			}
			else {
				key = partsOrder[0]
			}
			dscAPI.setPart(key)
		}
		var print = function(){
			dscAPI.print(false)
		}

		// LEFT - Previous serie
		shortcut.remove("left")
		shortcut.add("left", previousSerie)

		// RIGHT - Next serie
		shortcut.remove("right")
		shortcut.add("right", nextSerie)

		// F1 (Up)/ UP - Previous shot
		shortcut.remove("F1")
		shortcut.remove("up")
		shortcut.add("F1", previousShot)
		shortcut.add("up", previousShot)

		// F2 (Down)/ DOWN - Next shot
		shortcut.remove("F2")
		shortcut.remove("down")
		shortcut.add("F2", nextShot)
		shortcut.add("down", nextShot)

		// Enter/ Menu
		// shortcut.remove("F3")
		// shortcut.add("F3", function(){})

		// Shutdown
		// shortcut.remove("F4")
		// shortcut.add("F4", function(){})

		// F5 - Neue Scheibe
		shortcut.remove("F5")
		shortcut.add("F5", newTarget)

		// F6 - OK
		// shortcut.remove("F6")
		// shortcut.add("F6", function(){})

		// F7 - Drucken
		shortcut.remove("F7")
		shortcut.add("F7", print)

		// F8 / m - Abbrechen/ Probe/ Match
		shortcut.remove("F8")
		shortcut.remove("m")
		shortcut.add("F8", togglePart)
		shortcut.add("m", togglePart)
	})
})
