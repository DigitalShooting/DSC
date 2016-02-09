var mysql = require("mysql");
var config = require("../config/");

var connection = mysql.createPool(config.database.mysql);

connection.query('SELECT 1', function(err, rows) {
	if (err && config.database.enabled){
		console.log("[ERROR] SQL not connected ("+err+")");
	}
});

module.exports = connection;
