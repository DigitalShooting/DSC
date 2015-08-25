angular.module('dsc.controllers.print', [])



.controller('grafik', function ($scope, socket) {
	// $scope.session = undefined

	$scope.size = "130px"
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
})



.controller('summary', function ($scope, socket) {

	function setSession(){
		if ($scope.sessions != undefined && $scope.indexSession != undefined){
			$scope.session = $scope.sessions[$scope.indexSession]


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

			var dateFrom
			var dateTo
			if ($scope.session.serieHistory.length > 0){
				if ($scope.session.serieHistory[0].length > 0){
					dateFrom = new Date($scope.session.serieHistory[0][0].time).getTime()/1000

					var i = $scope.session.serieHistory.length-1
					var ii = $scope.session.serieHistory[i].length-1
					dateTo = new Date($scope.session.serieHistory[i][ii].time).getTime()/1000
				}
			}
			$scope.duration = secondsToString(dateTo-dateFrom)

			$scope.gesamt = 0
			$scope.anzahlShots = 0
			var schnitt = 0
			for (var i in $scope.session.serieHistory){
				for (var ii in $scope.session.serieHistory[i]){
					var shot = $scope.session.serieHistory[i][ii]
					$scope.gesamt += shot.ringInt
					schnitt += shot.ringInt
					$scope.anzahlShots++
				}
			}

			$scope.teilerSchnitt = Math.round(schnitt / $scope.anzahlShots).toFixed(1)

		}
	}

	$scope.init = function(indexSession){
		$scope.indexSession = indexSession
		setSession()
	}

	socket.on("setData", function (data) {
		$scope.sessions = data.sessionParts
		setSession()
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
