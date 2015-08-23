Number.prototype.toFixedDown = function(digits) {
	var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
		m = this.toString().match(re);
		return m ? parseFloat(m[1]) : this.valueOf();
};






angular.module('dsc', [
	'dsc.services.grafik',
	'dsc.services.socketio',
	"dsc.services.timeFunctions",

	'dsc.controllers.info',
	'dsc.controllers.session',

	// 3rd party dependencies
	"btford.socket-io",
	"ja.qr",
])
