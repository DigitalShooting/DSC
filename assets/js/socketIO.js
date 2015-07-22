var socket = io();






var scheibe = {
	title: "LG 10m",
	ringe: [
		{ value: 10, width:  0.5, color: "white", text: false, textColor: "white" },
		{ value:  9, width:  5.5, color: "black", text: false, textColor: "white" },
		{ value:  8, width: 10.5, color: "black", text: true, textColor: "white" },
		{ value:  7, width: 15.5, color: "black", text: true, textColor: "white" },
		{ value:  6, width: 20.5, color: "black", text: true, textColor: "white" },
		{ value:  5, width: 25.5, color: "black", text: true, textColor: "white" },
		{ value:  4, width: 30.5, color: "black", text: true, textColor: "white" },
		{ value:  3, width: 35.5, color: "white", text: true, textColor: "black" },
		{ value:  2, width: 40.5, color: "white", text: true, textColor: "black" },
		{ value:  1, width: 45.5, color: "white", text: true, textColor: "black" },
	],
	kugelDurchmesser: 4.5,
}
// var scheibe = {
// 	title: "LP 10m",
// 	ringe: [
// 		{ value: 10, width:  11.5, color: "black", text: false, textColor: "white" },
// 		{ value:  9, width:  27.5, color: "black", text: true, textColor: "white" },
// 		{ value:  8, width:  43.5, color: "black", text: true, textColor: "white" },
// 		{ value:  7, width:  59.5, color: "black", text: true, textColor: "white" },
// 		{ value:  6, width:  75.5, color: "white", text: true, textColor: "black" },
// 		{ value:  5, width:  91.5, color: "white", text: true, textColor: "black" },
// 		{ value:  4, width: 107.5, color: "white", text: true, textColor: "black" },
// 		{ value:  3, width: 123.5, color: "white", text: true, textColor: "black" },
// 		{ value:  2, width: 139.5, color: "white", text: true, textColor: "black" },
// 		{ value:  1, width: 155.5, color: "white", text: true, textColor: "black" },
// 	],
// 	kugelDurchmesser: 4.5,
// }


var a_canvas = document.getElementById("grafik");
console.log(a_canvas)
var context = a_canvas.getContext("2d");


var scale = 10


// Draw Main
var lastRing = scheibe.ringe[scheibe.ringe.length-1]
for (var i = scheibe.ringe.length-1; i >= 0; i--){
	var ring = scheibe.ringe[i]

	context.fillStyle = ring.color;
	context.beginPath();
	context.arc(lastRing.width/2*scale+1, lastRing.width/2*scale+1, ring.width/2*scale, 0, 2*Math.PI);
	context.closePath();

	context.fill();
	context.strokeStyle = ring.textColor
	context.lineWidth = 1;
	context.stroke();
	context.fillStyle = "black";

	if (ring.text == true){
		// context.font = (10*scale)+" px";
		context.font = "bold "+(1*scale)+"px verdana, sans-serif";
		context.fillStyle = ring.textColor
		context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + 0.95)*scale+1, (lastRing.width/2+0.3)*scale+1);
		context.fillText(ring.value, (lastRing.width/2 + ring.width/2 - 1.7)*scale+1, (lastRing.width/2+0.3)*scale+1);
		context.fillText(ring.value, (lastRing.width/2-0.3)*scale+1, (lastRing.width/2 + ring.width/2 - 0.8)*scale+1);
		context.fillText(ring.value, (lastRing.width/2-0.3)*scale+1, (lastRing.width/2 - ring.width/2 + 1.8)*scale+1);
	}

	console.log(ring.width)
}









// session: enthält alle daten
var session = {
	// user object
	user: null,

	// mode: aktueller modus
	mode: {

		// type: art des modus (probe/ match)
		type: "probe",

		// disziplin: art des modes
		disziplin: {
			title: "LG Training",
			scheibe: null,//.scheiben.lg,
			serienLength: 10,
		},


		// shots: schüsse
		shot: {
			shots: [

			],
			new: function(shot){
				this.shots.push(shot)
				console.log(shot)
				$("#modules .serie ul").append("<li>"+shot.ring+"</li>")

				context.fillStyle = "red";
				context.beginPath();
				context.arc((lastRing.width/2 - shot.x/1000)*scale+1, (lastRing.width/2 - shot.x/1000)*scale+1, scheibe.kugelDurchmesser/2*scale, 0, 2*Math.PI);
				context.closePath();
				context.fill();
				// context.strokeStyle = ring.textColor
				context.lineWidth = 1;
				context.stroke();
				context.fillStyle = "black";

			}
		},

	},
	modeHistory : [],
}




// Init
socket.on('init', function(data){
	console.log('changedMode: ' + data);
});




// Mode (LG Traning, LP Wettkampf, ...)
socket.on('mode.change', function(data){
	console.log('changedMode: ' + data);
});



// User
socket.on('user.switch', function(data){
	console.log('changedUser: ' + data);
});
socket.on('user.changeSettings', function(data){
	console.log('changedUser Settings: ' + data);
});



// Shot stuff
socket.on('shot.new', function(data){
	console.log('newShot: ' + data);
	session.mode.shot.new(data)
});
socket.on('shot.newTarget', function(data){
	console.log('newTarget: ' + data);
});
socket.on('shot.switchToMatch', function(data){
	console.log('switchToMatch: ' + data);
});
socket.on('shot.switchToProbe', function(data){
	console.log('switchToProbe: ' + data);
});



// Reset
socket.on('reset.exit', function(data){
	console.log('reset: ' + data);
});
