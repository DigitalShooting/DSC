var scheibe = require("./scheibe_blank.js")

module.exports = {
	_id: "lg_blank",
	title: "LG Blank",
	interface: {
		name: "esa",
		band: {
			onChangePart: 5,
			onShot: 3,
		},
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
			probeEcke: false,
			neueScheibe: true,
			serienLength: 100,
			anzahlShots: 0,
			showInfos: false,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: false,
				anzahl: 0,
			},
			exitType: "",
		},
	},
}
