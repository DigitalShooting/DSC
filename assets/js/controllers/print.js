angular.module('dsc.controllers.print', [])



.controller('grafik', function ($scope, socket) {
	// $scope.session = undefined

	$scope.scheibe = undefined
	$scope.zoomlevel = undefined
	$scope.serie = undefined
	$scope.selectedshotindex = undefined

	function setSession(){
		if ($scope.sessions != undefined && $scope.indexSession != undefined){
			$scope.session = $scope.sessions[$scope.indexSession]

			$scope.scheibe = $scope.session.disziplin.scheibe
			$scope.zoomlevel = $scope.session.disziplin.scheibe.defaultZoom
			setSerie()
			$scope.selectedshotindex = -1

			$scope.probeecke = $scope.session.disziplin.parts[$scope.session.type].probeEcke
		}
	}
	function setSerie(){
		if ($scope.session != undefined && $scope.serieIndex != undefined){
			$scope.serie = $scope.session.serieHistory[$scope.serieIndex]
		}
	}

	$scope.init = function(indexSession, serieIndex){
		$scope.indexSession = indexSession
		setSession()

		$scope.serieIndex = serieIndex
		setSerie()
	}

	socket.on("setData", function (data) {
		$scope.sessions = data.sessionParts
		setSession()
	});

	socket.on("setData", function (data) {

	});
})



.controller('sessions', function ($scope, socket) {
	socket.on("setData", function (data) {
		$scope.sessions = data.sessionParts
	});

	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}
	var date = new Date()
	$scope.currentDate = n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear())
})



.filter("formatDate", function(){
	return function(input){
		var date = new Date(input)
		if (date != undefined){
			var hh = date.getHours().toString()
			var mm = date.getMinutes().toString()
			var ss  = date.getSeconds().toString()
			return (hh[1]?hh:"0"+hh[0]) + ":" + (mm[1]?mm:"0"+mm[0]) + ":" + (ss[1]?ss:"0"+ss[0])
		}
		return ""
	}
});
