var mysql = require("mysql")
var config = require("../config/")

var connection = mysql.createConnection(config.database.mysql)

// connection.connect()

// function handleDisconnect(conn) {
// 	conn.on("error", function(err) {
// 		if (!err.fatal) {
// 			return
// 		}
//
// 		if (err.code !== "PROTOCOL_CONNECTION_LOST") {
// 			console.log(err.code)
// 		}
//
// 		console.log("Re-connecting lost connection: " + err.stack)
//
// 		connection = mysql.createConnection(conn.config)
// 		setTimeout(function(){
// 			handleDisconnect(connection)
// 			connection.connect()
// 		}, 5000)
// 	})
// }
// handleDisconnect(connection)

module.exports = connection
