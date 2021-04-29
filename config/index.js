const fs = require('fs');

let config;

const DSCConfig = process.env["DSCConfig"];
if (DSCConfig != null) {
	let rawdata = fs.readFileSync(DSCConfig);
	config = JSON.parse(rawdata);
	config.auth.tempKey = Math.random().toString(36).substr(2, 5);
	config.interface.esa.path = "./lib/Interfaces/DeviceInterfaceESA.js";
	config.interface.esa.bandACK: {
		enabled: false,
		port: 61424,
	};
	config.interface.demo: {
		path: "./lib/Interfaces/DeviceInterfaceDemo.js",
	};
	config.line.hostVerein.logoPath = __dirname + "/logo.png";
}
else {
	config = {
		line: require("./line.js"),
		interface: require("./interface.js"),
		disziplinen: require("../disziplinen/"),
		network: require("./network.js"),
		auth: require("./auth.js"),
		database: require("./database.js")
	};
}

module.exports = config;
