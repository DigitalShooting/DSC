angular.module('dsc.services.timeFunctions', [])


.factory('timeFunctions', ["$timeout", function timeFunctions($timeout) {
	var _intervals = {}, _intervalUID = 1;

	return {
		$setInterval: function(operation, interval, $scope) {
			var _internalId = _intervalUID++;
			_intervals[ _internalId ] = $timeout(function intervalOperation(){
				operation( $scope || undefined );
				_intervals[ _internalId ] = $timeout(intervalOperation, interval);
			}, interval);

			return _internalId;
		},

		$clearInterval: function(id) {
			return $timeout.cancel( _intervals[ id ] );
		}
	};
}])



.filter("formatDate", function(){
	return function(input){
		var date = new Date(input);
		var curDate = new Date();
		if (date != undefined){
			var hh = date.getHours().toString();
			var mm = date.getMinutes().toString();
			var ss  = date.getSeconds().toString();



			var dateString = "";
			if (curDate.toDateString() != date.toDateString()){
				var month = (date.getUTCMonth() + 1).toString();
				var day = date.getUTCDate().toString();
				var year = date.getUTCFullYear().toString();
				dateString = " (" + day+"."+month+"."+ year + ")";
			}

			return (hh[1]?hh:"0"+hh[0]) + ":" + (mm[1]?mm:"0"+mm[0]) + ":" + (ss[1]?ss:"0"+ss[0]) + dateString;
		}
		return "";
	};
});
