


// Zooms
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
			scale: 48,
			offset: {
				x: -2730,
				y: -2730,
			},
		},
	},
}





// Scheiben
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
		ringeDrawOnly: [],
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
	lgBlank: {
		title: "LG 10m (Blank)",
		ringe: [
			{ value: 10, width:  0.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  9, width:  5.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  8, width: 10.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  7, width: 15.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  6, width: 20.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  5, width: 25.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  4, width: 30.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  3, width: 35.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  2, width: 40.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
			{ value:  1, width: 45.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lg.z1, hitColor: "#00bffF" },
		],
		ringeDrawOnly: [],
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
		ringeDrawOnly: [
			{ width:  5.0, color: "black", textColor: "white" },
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






// Disziplinen
module.exports = {



	lgTraining: {
		_id: "lgTraining",
		title: "LG Training",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},





	lgTraining5: {
		_id: "lgTraining5",
		title: "LG Training 5er",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},






	lgWettkampf: {
		_id: "lgWettkampf",
		title: "LG Wettkampf",
		interface: "esa",
		time: {
			enabled: true,
			duration: 75,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},






	lgAuflage: {
		_id: "lgAuflage",
		title: "LG Auflage",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 30,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},




	lgBlank: {
		_id: "lgBlank",
		title: "LG Blank",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: false,
				neueScheibe: true,
				serienLength: 100,
				anzahlShots: 0,
				showInfos: false,
				scheibe: scheiben.lgBlank,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
		],
	},




	lg3Stellung: {
		_id: "lg3Stellung",
		title: "LG 3 Stellung",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe1: {
				title: "Probe 1",
				probeEcke: true,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match1: {
				title: "Match 1",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 20,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			probe2: {
				title: "Probe 2",
				probeEcke: true,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match2: {
				title: "Match 2",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 20,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			probe3: {
				title: "Probe 3",
				probeEcke: true,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match3: {
				title: "Match 3",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 20,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe1",
			"match1",
			"probe2",
			"match2",
			"probe3",
			"match3",
		],
	},




	lpTraining: {
		_id: "lpTraining",
		title: "LP Training",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},





	lpTraining5: {
		_id: "lpTraining5",
		title: "LP Training 5er",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},





	lpWettkampf: {
		_id: "lpWettkampf",
		title: "LP Wettkampf",
		interface: "esa",
		time: {
			enabled: false,
			duration: 0,
		},
		parts: {
			probe: {
				title: "Probe",
				probeEcke: true,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
			match: {
				title: "Match",
				probeEcke: false,
				neueScheibe: false,
				serienLength: 10,
				anzahlShots: 40,
				showInfos: true,
				scheibe: scheiben.lp,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},
		partsOrder: [
			"probe",
			"match"
		],
	},





	demo: {
		_id: "demo",

		// Title of the Disziplin
		title: "Demo",

		// Interface to use
		interface: "demo",

		// Time Settings for all parts
		time: {

			// One time for all parts, self change mode
			enabled: false,

			duration: 75,
		},

		// Parts are subsets of actions in a disziplin, like probe/ match or probe1/match1/probe2/...
		parts: {
			probe: {
				title: "Probe",
				probeEcke: false,
				neueScheibe: true,
				serienLength: 10,
				anzahlShots: 0,
				showInfos: true,
				scheibe: scheiben.lg,
				time: {
					enabled: false,
					duration: 0,
				},
			},
		},

		// Order of the parts
		partsOrder: [
			"probe",
		],


	},
}
