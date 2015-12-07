angular.module('dsc.services.dscAPI', [
	"dsc.services.socketio",
])


.factory('dscAPI', function (socket, auth) {
	return {
		setNewTarget: function(){
			socket.emit("newTarget", {
				auth: auth,
			})
		},
		setPart: function(partId){
			socket.emit("setPart", {
				auth: auth,
				partId: partId,
			})
		},
		setSelectedSerie: function(index){
			socket.emit("setSelectedSerie", {
				auth: auth,
				index: index,
			})
		},
		setSelectedShot: function(index){
			socket.emit("setSelectedShot", {
				auth: auth,
				index: index,
			})
		},
		setUser: function(user){
			socket.emit("setUser", {
				auth: auth,
				user: user,
			})
		},
		setDisziplin: function(disziplin){
			socket.emit("setDisziplin", {
				auth: auth,
				disziplin: disziplin,
			})
		},
		print: function(){
			socket.emit("print", {
				auth: auth,
			})
		},
		getTempToken: function(){
			socket.emit("getTempToken", {
				auth: auth,
			})
		},
	}
})
