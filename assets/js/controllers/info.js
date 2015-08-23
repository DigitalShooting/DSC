angular.module('dsc.controllers.info', [])


.controller('name', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.name = session.user.firstName + " " + session.user.lastName
		$scope.stand = session.user.stand.title

		$scope.openUserMenu = function(){
			$('#userMenu').modal('show')

			$("#userMenu .menuItem").click(function(){
				$('#userMenu').modal('hide')
			})
			$("#userMenu .selectUser").click(function(){

			})
			$("#userMenu .selectUserGast").click(function(){
				socket.emit("setUserGast", {})
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



.controller('newTarget', function ($scope, socket) {
	socket.on("setSession", function (session) {
		$scope.newTarget = function(){
			socket.emit("newTarget", {})
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



.controller('menuParts', function ($scope, socket) {
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
			socket.emit("switchToPart", id)
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



.controller('menuDisziplinen', function ($scope, socket) {
	$scope.setDisziplien = function(disziplin){
		socket.emit('setDisziplin', disziplin)
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



.controller('menuUser', function ($scope, socket) {
	$scope.url = "ddd"

	// socket.on("setConfig", function (config) {
	// 	$scope.disziplinen = config.disziplinen
	//
	// 	$scope.hidden = false
	// });
	// socket.on("setSession", function (session) {
	// 	// $scope.session = session
	// 	$scope.isActive = function(id){
	// 		return id == session.disziplin._id ? "active" : ""
	// 	}
	//
	// 	$scope.hidden = false
	// });
})



.controller('shortcut', function ($scope, socket) {
	socket.on("setSession", function (session) {

		// UP - Previous shot
		shortcut.remove("up")
		shortcut.add("up", function(){
			if (session.selection.shot > 0){
				socket.emit('setSelectedShot', --session.selection.shot)
			}
			else if (session.selection.serie > 0){
				socket.emit('setSelectedSerie', --session.selection.serie)
			}
		})

		// DOWN - Next shot
		shortcut.remove("down")
		shortcut.add("down", function(){
			if (session.selection.shot < session.serieHistory[session.selection.serie].length-1){
				socket.emit('setSelectedShot', ++session.selection.shot)
			}
			else if (session.selection.serie < session.serieHistory.length-1){
				socket.emit('setSelectedSerie', ++session.selection.serie)
				socket.emit('setSelectedShot', 0)
			}
		})

		// LEFT - Previous serie
		shortcut.remove("left")
		shortcut.add("left", function(){
			if (session.selection.serie > 0){
				socket.emit('setSelectedSerie', --session.selection.serie)
			}
		})

		// RIGHT - Next serie
		shortcut.remove("right")
		shortcut.add("right", function(){
			if (session.selection.serie < session.serieHistory.length-1){
				socket.emit('setSelectedSerie', ++session.selection.serie)
				socket.emit('setSelectedShot', 0)
			}
		})

		// F1 (Down) - Previous shot
		shortcut.remove("F1")
		shortcut.add("F1",function() {
			if (session.selection.shot > 0){
				socket.emit('setSelectedShot', --session.selection.shot)
			}
			else if (session.selection.serie > 0){
				socket.emit('setSelectedSerie', --session.selection.serie)
			}
		})

		// // F2 (Up) - Next shot
		shortcut.remove("F2")
		shortcut.add("F2",function(){
			if (session.selection.shot < session.serieHistory[session.selection.serie].length-1){
				socket.emit('setSelectedShot', ++session.selection.shot)
			}
			else if (session.selection.serie < session.serieHistory.length-1){
				socket.emit('setSelectedSerie', ++session.selection.serie)
				socket.emit('setSelectedShot', 0)
			}
		})

		// Enter/ Menu
		// shortcut.remove("F3")
		// shortcut.add("F3",function() {
		// 	$('#disziplinMenu').modal('show')
		// })

		// Shutdown
		// shortcut.remove("F4")
		// shortcut.add("F4",function() {
		// 	alert("Shutdown");
		// })

		// F5 - Neue Scheibe
		shortcut.remove("F5")
		shortcut.add("F5",function() {
			if (session.disziplin.parts[session.type].neueScheibe == true){
				socket.emit("newTarget", {})
			}
		})

		// OK
		// shortcut.remove("F6")
		// shortcut.add("F6",function() {
		// 	alert("OK");
		// })

		// Drucken
		// shortcut.remove("F7")
		// shortcut.add("F7",function() {
		// 	alert("Drucken");
		// })

		// F8 - Abbrechen/ Probe/ Match
		shortcut.remove("F8")
		shortcut.add("F8",function(){
			var index = 0
			for (var i = 0; i < session.disziplin.partsOrder.length; i++){
				var key = session.disziplin.partsOrder[i]

				if (key == session.type){
					index = i
					break
				}
			}

			var nextIndex = i + 1

			if (nextIndex < session.disziplin.partsOrder.length){
				var key = session.disziplin.partsOrder[nextIndex]

				socket.emit("switchToPart", key)
			}
		})
	})


})
