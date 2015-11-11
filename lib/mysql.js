var mysql = require("mysql")
var config = require("../config/")

var connection = mysql.createConnection(config.database.mysql)

connection.connect()

module.exports = connection

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
// 	if (err) throw err
//
// 	console.log('The solution is: ', rows[0].solution)
// })

// connection.end()
