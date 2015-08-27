angular.module('dsc.services.socketio', [
	"btford.socket-io",
])


.factory('socket', function (socketFactory) {
	return socketFactory();
})
