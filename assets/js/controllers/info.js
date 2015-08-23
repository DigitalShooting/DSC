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
