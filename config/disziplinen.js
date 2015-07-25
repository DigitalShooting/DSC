
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
}


var scheiben = {
	lg: {
		title: "LG 10m",
		ringe: [
			{ value: 10, width:  0.5, color: "white", text: false, textColor: "white", zoom: zooms.lg.z3 },
			{ value:  9, width:  5.5, color: "black", text: false, textColor: "white", zoom: zooms.lg.z3 },
			{ value:  8, width: 10.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2 },
			{ value:  7, width: 15.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2 },
			{ value:  6, width: 20.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z2 },
			{ value:  5, width: 25.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z1 },
			{ value:  4, width: 30.5, color: "black", text: true, textColor: "white", zoom: zooms.lg.z1 },
			{ value:  3, width: 35.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1 },
			{ value:  2, width: 40.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1 },
			{ value:  1, width: 45.5, color: "white", text: true, textColor: "black", zoom: zooms.lg.z1 },
		],
		defaultZoom: zooms.lg.z1,
		kugelDurchmesser: 4.5,
	},
	lp: {
		title: "LP 10m",
		ringe: [
			{ value: 10, width:  11.5, color: "black", text: true, textColor: "white" },
			{ value:  9, width:  27.5, color: "black", text: true, textColor: "white" },
			{ value:  8, width:  43.5, color: "black", text: true, textColor: "white" },
			{ value:  7, width:  59.5, color: "black", text: true, textColor: "white" },
			{ value:  6, width:  75.5, color: "white", text: true, textColor: "black" },
			{ value:  5, width:  91.5, color: "white", text: true, textColor: "black" },
			{ value:  4, width: 107.5, color: "white", text: true, textColor: "black" },
			{ value:  3, width: 123.5, color: "white", text: true, textColor: "black" },
			{ value:  2, width: 139.5, color: "white", text: true, textColor: "black" },
			{ value:  1, width: 155.5, color: "white", text: true, textColor: "black" },
		],
		kugelDurchmesser: 4.5,
	},
}

module.exports = {
	lgTraining: {
		title: "LG Training",
		scheibe: scheiben.lg,
		serienLength: 10,
		anzahlShots: 0,
	},
	lgTraining5: {
		title: "LG Training 5er",
		scheibe: scheiben.lg,
		serienLength: 5,
		anzahlShots: 0,
	},
	lgWettkampf: {
		title: "LG Wettkampf",
		scheibe: scheiben.lg,
		serienLength: 10,
		anzahlShots: 40,
	},
	lpTraining: {
		title: "LP Training",
		scheibe: scheiben.lp,
		serienLength: 10,
		anzahlShots: 0,
	},
	lpTraining5: {
		title: "LP Training 5er",
		scheibe: scheiben.lp,
		serienLength: 5,
		anzahlShots: 0,
	},
	lpWettkampf: {
		title: "LP Wettkampf",
		scheibe: scheiben.lp,
		serienLength: 10,
		anzahlShots: 40,
	}
}
