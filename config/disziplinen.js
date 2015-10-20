


// Zooms
var zooms = {

	// Type
	lg: {

		// Level 0
		z0: {

			// Scale factor
			scale: 30,

			// Target offest
			offset: { x: 320, y: 320 },
		},
		z1: {
			scale: 43.5,
			offset: { x: 10, y: 10 },
		},
		z2: {
			scale: 70,
			offset: { x: -600, y: -600 },
		},
		z3: {
			scale: 100,
			offset: { x: -1270, y: -1270 },
		},
	},
	lp: {
		z0: {
			scale: 8.6,
			offset: { x: 330, y: 330 },
		},
		z1: {
			scale: 12.6,
			offset: { x: 20, y: 20 },
		},
		z2: {
			scale: 20.3,
			offset: { x: -580, y: -580 },
		},
		z3: {
			scale: 29,
			offset: { x: -1250, y: -1250 },
		},
		z4: {
			scale: 48,
			offset: { x: -2730, y: -2730 },
		},
	},



	gewehr15: {
		z0: {
			scale: 12.6,
			offset: { x: 460, y: 460 },
		},
		z1: {
			scale: 20.6,
			offset: { x: 120, y: 120 },
		},
		z2: {
			scale: 30.3,
			offset: { x: -300, y: -300 },
		},
		z3: {
			scale: 48,
			offset: { x: -1060, y: -1060 },
		},
		z4: {
			scale: 62,
			offset: { x: -1660, y: -1660 },
		},
	},

	strichBreit: {
		z0: {
			scale: 10,
			offset: { x: 1000, y: 1000 },
		},
	}



}





// Scheiben
var scheiben = {
	lg: {

		// Title label
		title: "LG 10m",

		// Ringe, first and last is used to calc a linear function to get the shot value
		ringe: [
			{
				// Ring value
				value: 10,

				// Ring width (mm)
				width:  0.5,

				// Ring color (background)
				color: "white",

				// Show text
				text: false,

				// Text color (hex or title), used for text and border
				textColor: "white",

				// Shot zoom level
				zoom: zooms.lg.z3,

				// Shot hit color
				hitColor: "red"
			},
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

		// Draw only rings, used in lp for inner 10
		ringeDrawOnly: [],


		rechteckDrawOnly: [],

		// used for 0
		defaultHitColor: "#000000",

		// used for start
		defaultZoom: zooms.lg.z1,

		// used for 0
		minZoom: zooms.lg.z0,

		// InnenZehner Teiler
		innenZehner: 200,

		// Bandvorschub
		band: {

			// Vorschub bei wechsel des Parts
			onChangePart: 8,

			// Vorschub nach jedem Schuss
			onShot: 3,
		},

		// pobe ecke
		probeEcke: { color: "#0f0", alpha: 0.7 },

		// text label configs
		text: {

			// text size
			size: 1.0,

			// text width
			width: 0.3,

			// some offests
			up: 1.8,
			down: -0.8,
			left: 0.95,
			right: -1.7,
		},

		// kaliber width
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
		rechteckDrawOnly: [],
		defaultHitColor: "#000000",
		defaultZoom: zooms.lg.z1,
		minZoom: zooms.lg.z0,
		innenZehner: 200,
		band: {
			onChangePart: 8,
			onShot: 3,
		},
		probeEcke: { color: "#0f0", alpha: 0.7 },
		text: { size: 1.0, width: 0.3, up: 1.8, down: -0.8, left: 0.95, right: -1.7 },
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
		rechteckDrawOnly: [],
		defaultHitColor: "#000000",
		defaultZoom: zooms.lp.z1,
		minZoom: zooms.lp.z0,
		innenZehner: 475,
		band: {
			onChangePart: 8,
			onShot: 3,
		},
		probeEcke: { color: "#0f0", alpha: 0.7 },
		text: { size: 3.0, width: 0.9, up: 4.8, down: -2.6, left: 2.6, right: -4.8 },
		kugelDurchmesser: 4.5,
	},
	lpBlank: {
		title: "LP 10m (Blank)",
		ringe: [
			{ value: 10, width:  11.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  9, width:  27.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  8, width:  43.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  7, width:  59.5, color: "black", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  6, width:  75.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  5, width:  91.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  4, width: 107.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  3, width: 123.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  2, width: 139.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
			{ value:  1, width: 155.5, color: "white", text: false, textColor: "transparent", zoom: zooms.lp.z1, hitColor: "#00bffF" },
		],
		ringeDrawOnly: [],
		rechteckDrawOnly: [],
		defaultHitColor: "#000000",
		defaultZoom: zooms.lp.z1,
		minZoom: zooms.lp.z0,
		innenZehner: 475,
		band: {
			onChangePart: 8,
			onShot: 3,
		},
		probeEcke: { color: "#0f0", alpha: 0.7 },
		text: { size: 3.0, width: 0.9, up: 4.8, down: -2.6, left: 2.6, right: -4.8 },
		kugelDurchmesser: 4.5,
	},
	gewehr15: {
		title: "15m Gewehr",
		ringe: [
			{ value: 10, width:  4.5, color: "black", text: false, textColor: "white", zoom: zooms.gewehr15.z4, hitColor: "red" },
			{ value:  9, width:  13.5, color: "black", text: true, textColor: "white", zoom: zooms.gewehr15.z4, hitColor: "green" },
			{ value:  8, width:  22.5, color: "black", text: true, textColor: "white", zoom: zooms.gewehr15.z3, hitColor: "yellow" },
			{ value:  7, width:  31.5, color: "black", text: true, textColor: "white", zoom: zooms.gewehr15.z3, hitColor: "#00bffF" },
			{ value:  6, width:  40.5, color: "black", text: true, textColor: "white", zoom: zooms.gewehr15.z2, hitColor: "#00bffF" },
			{ value:  5, width:  49.5, color: "white", text: true, textColor: "black", zoom: zooms.gewehr15.z2, hitColor: "#00bffF" },
			{ value:  4, width:  58.5, color: "white", text: true, textColor: "black", zoom: zooms.gewehr15.z2, hitColor: "#00bffF" },
			{ value:  3, width:  67.5, color: "white", text: true, textColor: "black", zoom: zooms.gewehr15.z1, hitColor: "#00bffF" },
			{ value:  2, width:  76.5, color: "white", text: true, textColor: "black", zoom: zooms.gewehr15.z1, hitColor: "#00bffF" },
			{ value:  1, width:  85.5, color: "white", text: true, textColor: "black", zoom: zooms.gewehr15.z1, hitColor: "#00bffF" },
		],
		ringeDrawOnly: [],
		rechteckDrawOnly: [],
		defaultHitColor: "#000000",
		defaultZoom: zooms.gewehr15.z1,
		minZoom: zooms.gewehr15.z0,
		innenZehner: 0,
		band: {
			onChangePart: 8,
			onShot: 3,
		},
		probeEcke: { color: "#0f0", alpha: 0.7 },
		text: { size: 2.6, width: 0.9, up: 3.2, down: -1.2, left: 1.4, right: -3.2 },
		kugelDurchmesser: 4.5,
	},
	strichBreit: {
		title: "LP Strich",
		ringe: [
			{ value: 0, width: 0, color: "transparent", text: false, textColor: "transparent", zoom: zooms.strichBreit.z0, hitColor: "#00bffF" },
			{ value: 0, width: 0, color: "transparent", text: false, textColor: "transparent", zoom: zooms.strichBreit.z0, hitColor: "#00bffF" },
		],
		ringeDrawOnly: [],
		rechteckDrawOnly: [
			{ width:  29, height:  161, color: "black", hitColor: "#00bffF" },
		],
		defaultHitColor: "#00bffF",
		defaultZoom: zooms.strichBreit.z0,
		minZoom: zooms.strichBreit.z0,
		innenZehner: 0,
		band: {
			onChangePart: 8,
			onShot: 3,
		},
		probeEcke: { color: "#0f0", alpha: 0.7 },
		kugelDurchmesser: 4.5,
	},
}






// Disziplinen
module.exports = {

	groups: [
		{title: "LG", disziplinen: ["lgWettkampf", "lgFinale", "lgTraining", "lgTraining5", "lgBlank"]},
		{title: "LP", disziplinen: ["lpWettkampf", "lpFinale", "lpTraining", "lpTraining5", "lpBlank", "lpStrich"]},
		{title: "Sonstige", disziplinen: ["lgAuflage", "lg3Stellung", "zimmerstutzen"]},
		{title: "Demo", disziplinen: ["demo", "demoBlank", "demoLP", "demoStrich"]},
	],

	all: {
		demo: {
			// has to be the object key
			_id: "demo",

			// Title of the Disziplin
			title: "LG Demo",

			// Interface to use (defined in interface.js)
			interface: "demo",

			// Time Settings for all parts
			time: {

				// One time for all parts, self change mode
				enabled: false,

				// Duration in minutes
				duration: 0,

				instantStart: false,
			},

			// Scheibe
			scheibe: scheiben.lg,

			// Parts are subsets of actions in a disziplin, like probe/ match or probe1/match1/probe2/...
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: true,
					time: {
						enabled: false,
						duration: 0,
						instantStart: false,
					},
					average: {
						enabled: true,
						anzahl: 40,
					},
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 40,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
			},

		},




		demoStrich: {
			_id: "demoStrich",
			title: "LP Demo Strich",
			interface: "demo",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.strichBreit,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 100,
					anzahlShots: 0,
					showInfos: false,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},





		demoBlank: {
			_id: "demoBlank",
			title: "LG Demo Blank",
			interface: "demo",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lgBlank,
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
		},




		demoLP: {
			_id: "demoLP",
			title: "LP Demo",
			interface: "demo",
			time: { enabled: true, duration: 1, instantStart: false },
			scheibe: scheiben.lp,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
			},
		},





		lgTraining: {
			_id: "lgTraining",
			title: "LG Training",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
			},
		},


		lgTraining5: {
			_id: "lgTraining5",
			title: "LG Training 5er",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 5,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},




		lgBlank: {
			_id: "lgBlank",
			title: "LG Blank",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lgBlank,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 100,
					anzahlShots: 0,
					showInfos: false,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},





		lgWettkampf: {
			_id: "lgWettkampf",
			title: "LG Wettkampf",
			interface: "esa",
			time: { enabled: true, duration: 65, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 40,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "beforeFirst",
				},
			},
		},



		lgFinale: {
			_id: "lgFinale",
			title: "LG Finale",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 10,
					showInfos: true,
					zehntel: true,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "beforeFirst",
				},
			},
		},






		lgAuflage: {
			_id: "lgAuflage",
			title: "LG Auflage",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false,
					},
					average: { enabled: true, anzahl: 30 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 30,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 30 },
					exitType: "beforeFirst",
				},
			},
		},



		lg3Stellung: {
			_id: "lg3Stellung",
			title: "LG 3 Stellung",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lg,
			parts: {
				probeK: {
					title: "Probe (Kniend)",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "",
				},
				matchK: {
					title: "Match (Kniend)",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 20,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "beforeFirst",
				},
				probeL: {
					title: "Probe (Liegend)",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "",
				},
				matchL: {
					title: "Match (Liegend)",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 20,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "beforeFirst",
				},
				probeS: {
					title: "Probe (Stehend)",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "",
				},
				matchS: {
					title: "Match (Stehend)",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 20,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 20 },
					exitType: "beforeFirst",
				},
			},
		},




		lpTraining: {
			_id: "lpTraining",
			title: "LP Training",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lp,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
			},
		},





		lpTraining5: {
			_id: "lpTraining5",
			title: "LP Training 5er",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lp,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: true,
					serienLength: 5,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},




		lpBlank: {
			_id: "lpBlank",
			title: "LP Blank",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lpBlank,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 100,
					anzahlShots: 0,
					showInfos: false,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},




		lpWettkampf: {
			_id: "lpWettkampf",
			title: "LP Wettkampf",
			interface: "esa",
			time: { enabled: true, duration: 65, instantStart: false },
			scheibe: scheiben.lp,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 40,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "beforeFirst",
				},
			},
		},



		lpFinale: {
			_id: "lpFinale",
			title: "LP Finale",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.lp,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 10,
					showInfos: true,
					zehntel: true,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 40 },
					exitType: "beforeFirst",
				},
			},
		},



		lpStrich: {
			_id: "lpStrich",
			title: "LP Strich",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.strichBreit,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: false,
					neueScheibe: true,
					serienLength: 100,
					anzahlShots: 0,
					showInfos: false,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: false, anzahl: 0 },
					exitType: "",
				},
			},
		},







		zimmerstutzen: {
			_id: "zimmerstutzen",
			title: "Zimmerstutzen",
			interface: "esa",
			time: { enabled: false, duration: 0, instantStart: false },
			scheibe: scheiben.gewehr15,
			parts: {
				probe: {
					title: "Probe",
					probeEcke: true,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 0,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 30 },
					exitType: "",
				},
				match: {
					title: "Match",
					probeEcke: false,
					neueScheibe: false,
					serienLength: 10,
					anzahlShots: 30,
					showInfos: true,
					zehntel: false,
					time: { enabled: false, duration: 0, instantStart: false },
					average: { enabled: true, anzahl: 30 },
					exitType: "beforeFirst",
				},
			},
		},
	},
}
