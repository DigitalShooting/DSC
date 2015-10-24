# Config
## Disziplin
### Zoom
```javascript
module.exports = {
	// Level 0
	z0: {
		// Scale factor
		scale: 30,
		// Target offest
		offset: { x: 320, y: 320 },
	},
}
```

### Scheibe
```javascript
var zoom = require("./zoom.js")

module.exports = {
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
	],
	// Draw only rings, used in lp for inner 10
	ringeDrawOnly: [],
	// Draw only rectangle
	rechteckDrawOnly: [],
	// used for 0
	defaultHitColor: "#000000",
	// used for start
	defaultZoom: zoom.z1,
	// used for 0
	minZoom: zooms.lg.z0,
	// InnenZehner Teiler
	innenZehner: 200,
	// pobe ecke
	probeEcke: { color: "#0f0", alpha: 0.7 },
	// text label configs
	text: {
		// text size
		size: 1.0,
		// text width
		width: 0.3,
		// some offests
		up: 1.8, down: -0.8, left: 0.95, right: -1.7,
	},
	// kaliber width
	kugelDurchmesser: 4.5,
}
```

### Disziplin
```javascript
var scheibe = require("./scheibe.js")

module.exports = {
	// unique disziplin id
	_id: "demo",
	// Title of the Disziplin
	title: "LG Demo",
	// Interface to use (defined in interface.js)
	interface: {
		// interface id from the interface config
		name: "demo",
		// DEMO INTERFACE: time config
		time: 2500,
		// ESA INTERFACE: band config
		band: {
			// moves the paper x ticks on every part change
			onChangePart: 5,
			// moves the paper x ticks after every shot
			onShot: 3,
		},
	},,
	// Time Settings for all parts (if enabled, part settings will be ignored)
	time: {
		// One time for all parts, self change mode
		enabled: false,
		// Duration in minutes
		duration: 0,
		// starts the timer bevor the first shot if true
		instantStart: false,
	},
	// scheibe object (reqire)
	scheibe: scheibe,
	// Parts are subsets of actions in a disziplin, like probe/ match or probe1/match1/probe2/...
	parts: {
		// id of the part
		probe: {
			// Part title
			title: "Probe",
			// Show triangle in the upper right corner
			probeEcke: true,
			// allow new target button
			neueScheibe: true,
			// shots in one serie
			serienLength: 10,
			// max shots/ 0 for infinite
			anzahlShots: 0,
			// show shot info labels
			showInfos: true,
			// count with tenths
			zehntel: true,
			// part time config
			time: {
				// enable timer
				enabled: false,
				// duration in minutes
				duration: 0,
				// starts the timer bevor the first shot if true
				instantStart: false,
			},
			// calculates the final score
			average: {
				// enable/ disable
				enabled: true,
				// number of shot to count up
				anzahl: 40,
			},
			// TODO: exitType
			// exit types define, when the user can exit a part (should only affects DSC client/ DSM or API )
			// beforeFirst: user can change the part befor the first shot
			// none: user can't exit the part
			// "": (empty) user can exit the part
			// exitType: "",
		},
	},
}
```
