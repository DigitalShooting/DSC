angular.module('dsc.services.socketio', [
	"btford.socket-io",
])


.factory('socket', function (socketFactory) {
// 	const ws = new WebSocket("ws://127.0.0.1:8080")
// 	ws.onopen = function (evt) {
//    ws.send("Hello!");
// };


	return {
		emit: function(type, data) {
			if (ws.readyState === ws.OPEN) {
				console.log(JSON.stringify({
					type: type,
					data: data,
				}))
				ws.send(JSON.stringify({
					type: type,
					data: data,
				}));
			}
			else {
				console.log("WS not open")
			}
		},
		on: function(type, callback) {
			ws.addEventListener("message", function (event) {
				var message = JSON.parse(event.data);
				if (message == null) {
					console.log("Got null message");
				}
				else if (message.type == type) {
					console.log(message);
					callback(message.data);
				}
			}.bind(this));

		}
	};

	// return socketFactory();
})


.factory('auth', function (QueryString) {
	return {
		key: QueryString.key,
	};
})


.factory('QueryString', function () {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] == "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] == "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
});
