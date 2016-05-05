angular.module('dsc.controllers.log', [])



.controller('grafik', function ($scope, socket) {
	$scope.size = "250px";
	$scope.scheibe = undefined;
	$scope.zoomlevel = undefined;
	$scope.serie = undefined;
	$scope.selectedshotindex = undefined;

	function setData(){
		if ($scope.data.sessionParts !== undefined && $scope.indexSession !== undefined){
			$scope.session = $scope.data.sessionParts[$scope.indexSession];

			$scope.scheibe = $scope.data.disziplin.scheibe;
			$scope.zoomlevel = $scope.data.disziplin.scheibe.defaultZoom;
			setSerie();
			$scope.selectedshotindex = -1;

			$scope.probeecke = $scope.data.disziplin.parts[$scope.session.type].probeEcke;
		}
	}
	function setSerie(){
		if ($scope.session !== undefined && $scope.serieIndex !== undefined){
			$scope.serie = $scope.session.serien[$scope.serieIndex].shots;
		}
	}

	$scope.init = function(indexSession, serieIndex){
		$scope.indexSession = indexSession;
		setData();

		$scope.serieIndex = serieIndex;
		setSerie();
	};

	socket.on("setData", function (data) {
		$scope.data = data;
		setData();
	});
})



.controller('summary', function ($scope, socket) {

	function setData(){
		if ($scope.data.sessionParts !== undefined && $scope.indexSession !== undefined){
			$scope.session = $scope.data.sessionParts[$scope.indexSession];
		}
	}

	$scope.init = function(indexSession){
		$scope.indexSession = indexSession;
		setData();
	};

	socket.on("setData", function (data) {
		$scope.data.sessionParts = data.sessionParts;
		setData();
	});

})



.controller('sessions', function ($scope, socket) {
	socket.on("setData", function (data) {
		$scope.data = data;
	});

	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}
	var date = new Date();
	$scope.currentDate = n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear());
})



.filter("formatDuration", function(){
	return function(seconds){
		var numhours = Math.floor(seconds / 3600);
		var numminutes = Math.floor((seconds % 3600) / 60);
		var numseconds = (seconds % 3600) % 60;

		Number.prototype.toFixedDown = function(digits) {
			var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
				m = this.toString().match(re);
				return m ? parseFloat(m[1]) : this.valueOf();
		};

		var string = "";
		if(numhours > 0){ string += numhours.toFixedDown(0) + "h "; }
		if(numminutes > 0){ string += numminutes.toFixedDown(0) + "m "; }
		if(numseconds > 0){ string += numseconds.toFixedDown(0) + "s "; }

		return string;
	};
});
