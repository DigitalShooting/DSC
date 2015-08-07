
var zooms = {
	lg: {
		z1: {
			scale: 43.5,
			offset: {
				x: 10,
				y: 10,
			},
		},
		z2: {
			scale: 70,
			offset: {
				x: -600,
				y: -600,
			},
		},
		z3: {
			scale: 100,
			offset: {
				x: -1270,
				y: -1270,
			},
		},
	},
	lp: {
		z1: {
			scale: 12.6,
			offset: {
				x: 20,
				y: 20,
			},
		},
		z2: {
			scale: 20.3,
			offset: {
				x: -580,
				y: -580,
			},
		},
		z3: {
			scale: 29,
			offset: {
				x: -1250,
				y: -1250,
			},
		},
		z4: {
			scale: 46,
			offset: {
				x: -2570,
				y: -2570,
			},
		},
	},
}


var scheiben = {
	lg: {
		title: "LG 10m",
		ringe: [
			{ value: 10, width:  0.5, color: "white", text: false, textColor: "white", zoom: zooms.lg.z3, hitColor: "red" },
			{ value:  9, width:  5.5, color: "black", text: false, textColor: "white", zoom: zooms.lg.z3, hitColor: "green" },
			{ value:  8, width: 10.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2, hitColor: "yellow" },
			{ value:  7, width: 15.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2, hitColor: "#00bffF" },
			{ value:  6, width: 20.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2, hitColor: "#00bffF" },
			{ value:  5, width: 25.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  4, width: 30.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  3, width: 35.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  2, width: 40.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  1, width: 45.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1, hitColor: "#00bffF" },
		],
		defaultZoom: zooms.lg.z1,
		probeEcke: {
			color: "#0f0",
			alpha: 0.7,
		},
		text: {
			size: 1.0,
			width: 0.3,
			up: 1.8,
			down: -0.8,
			left: 0.95,
			right: -1.7,
		},
		kugelDurchmesser: 4.5,
	},
	lp: {
		title: "LP 10m",
		ringe: [
			{ value: 10, width:  11.5, color: "black", text: false, textColor: "white", zoom: zooms.lp.z4, hitColor: "red" },
			{ value:  9, width:  27.5, color: "black", text: true, textColor: "white", zoom: zooms.lp.z4, hitColor: "green" },
			{ value:  8, width:  43.5, color: "black", text: true, textColor: "white", zoom: zooms.lp.z3, hitColor: "yellow" },
			{ value:  7, width:  59.5, color: "black", text: true, textColor: "white", zoom: zooms.lp.z3, hitColor: "#00bffF" },
			{ value:  6, width:  75.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z2, hitColor: "#00bffF" },
			{ value:  5, width:  91.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z2, hitColor: "#00bffF" },
			{ value:  4, width: 107.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  3, width: 123.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  2, width: 139.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  1, width: 155.5, color: "white", text: true, textColor: "black", zoom: zooms.lp.z1, hitColor: "#00bffF" },
		],
		defaultZoom: zooms.lp.z1,
		probeEcke: {
			color: "#0f0",
			alpha: 0.7,
		},
		text: {
			size: 3.0,
			width: 0.9,
			up: 4.8,
			down: -2.6,
			left: 2.6,
			right: -4.8,
		},
		kugelDurchmesser: 4.5,
	},
}

var defaultMode = {
	probe: {
		title: "Probe",
		anzahlShots: 0,
	},
	match: {
		title: "Match",
		anzahlShots: 40,
	},
}

module.exports = {
	lgTraining: {
		_id: "lgTraining",
		title: "LG Training",
		scheibe: scheiben.lg,
		modes: defaultMode,
		anzahlShots: 0,
		serienLength: 10,
		time: {
			type: "none",
		},
	},
	lgTraining5: {
		_id: "lgTraining5",
		title: "LG Training 5er",
		scheibe: scheiben.lg,
		modes: defaultMode,
		serienLength: 5,
		anzahlShots: 0,
		time: 0,
		time: {
			type: "none",
		},
	},
	lgWettkampf: {
		_id: "lgWettkampf",
		title: "LG Wettkampf",
		scheibe: scheiben.lg,
		modes: defaultMode,
		serienLength: 10,
		anzahlShots: 40,
		time: {
			type: "full",
			duration: 50,
		},
	},
	lpTraining: {
		_id: "lpTraining",
		title: "LP Training",
		scheibe: scheiben.lp,
		modes: defaultMode,
		serienLength: 10,
		anzahlShots: 0,
		time: {
			type: "none",
		},
	},
	lpTraining5: {
		_id: "lpTraining5",
		title: "LP Training 5er",
		scheibe: scheiben.lp,
		modes: defaultMode,
		serienLength: 5,
		anzahlShots: 0,
		time: {
			type: "none",
		},
	},
	lpWettkampf: {
		_id: "lpWettkampf",
		title: "LP Wettkampf",
		scheibe: scheiben.lp,
		modes: defaultMode,
		serienLength: 10,
		anzahlShots: 40,
		time: {
			type: "full",
			duration: 50,
		},
	}
}
