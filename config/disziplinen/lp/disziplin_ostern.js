var scheibe = require("./scheibe.js");

module.exports = {
	_id: "lp_ostern",
	title: "LP Ostern",
	interface: {
		name: "demo",
		time: 2500,
	},
	time: {
		enabled: false,
		duration: 0,
		instantStart: false,
	},
	scheibe: scheibe,
	parts: {
		probe: {
			title: "Probe",
			probeEcke: true,
			neueScheibe: false,
			serienLength: 3,
			anzahlShots: 3,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 5,
			},
			exitType: "",
		},
		match: {
			title: "Match",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 5,
			anzahlShots: 5,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 5,
			},
			exitType: "",
		},
	},
};
