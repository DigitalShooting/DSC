angular.module('dsc.services.socketio', [
	"btford.socket-io",
])


.factory('socket', function (socketFactory) {
	return socketFactory();
})


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
		print: function(all){
			socket.emit("print", {
				auth: auth,
				all: all,
			})
		},
	}
})


.factory('auth', function (QueryString) {
	return {
		key: QueryString.key,
	}
})


.factory('QueryString', function () {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
})
