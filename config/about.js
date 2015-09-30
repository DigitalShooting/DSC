var fs = require('fs');

module.exports = {
	version: fs.readFileSync(__dirname + "/version.tmp", "utf8"),
}
