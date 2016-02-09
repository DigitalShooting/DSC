var fs = require("fs");

module.exports = {

	// Port/ Address for api
	api: {
		// Port
		port		:	63455,
		// IPv4/ IPv6 address to bin on. (BSP: "::1")
		address		: 	"0.0.0.0",
	},

	// Port/ Address for main dsc webinterface
	dsc: {
		// Port
		port		:	3000,
		// IPv4/ IPv6 address to bin on. (BSP: "::1")
		address		: 	"0.0.0.0",
	},
};
