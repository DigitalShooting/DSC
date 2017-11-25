module.exports = {

	// ESA Interface
	esa: {

		// Path to API file
		path: "./lib/Interfaces/DeviceInterfaceESA.js",

		// COM Port
		com : "/dev/ttyS0",
		
		// Band ACK
		bandACK: {
			enabled: true,
			port: 61424,
		},
	},

	// Demo Interface
	demo: {

		// Path to API file
		path: "./lib/Interfaces/DeviceInterfaceDemo.js",
	},
};
