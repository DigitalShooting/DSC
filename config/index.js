var database = require("./database.js")
var line = require("./line.js")
var interf = require("./interface.js")
var disziplinen = require("./disziplinen.js")
var network = require("./network.js")
var about = require("./about.js")
var auth = require("./auth.js")

module.exports = {
	database: database,
	line: line,
	interface: interf,
	disziplinen: disziplinen,
	network: network,
	about: about,
	auth: auth,
}
