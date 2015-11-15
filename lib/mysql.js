var mysql = require("mysql")
var config = require("../config/")

var connection = mysql.createConnection(config.database.mysql)

module.exports = connection
