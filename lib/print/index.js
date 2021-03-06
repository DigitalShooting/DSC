var fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
var config = require("../../config/");
var child_process = require('child_process');

var currentRing = {};
var context;

var scaleFactor = 10;

function drawScheibe(context, scheibe, serie, zoom, selectedShotIndex, probeEcke){
	var lastRing = scheibe.ringe[scheibe.ringe.length-1];

	for (var i = scheibe.ringe.length-1; i >= 0; i--){
		var ring = scheibe.ringe[i];

		context.globalAlpha = 1.0;
		context.fillStyle = ring.color;
		context.beginPath();
		context.arc(lastRing.width/2*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), lastRing.width/2*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor), ring.width/2*(zoom.scale/scaleFactor), 0, 2*Math.PI);
		context.closePath();

		context.fill();
		context.strokeStyle = ring.textColor;
		context.lineWidth = 4/scaleFactor;
		context.stroke();
		context.fillStyle = "black";

		if (ring.text === true){
			context.font = "bold "+(scheibe.text.size*(zoom.scale/scaleFactor))+"px verdana, sans-serif";
			context.fillStyle = ring.textColor;
			context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + scheibe.text.left)*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), (lastRing.width/2+scheibe.text.width)*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor));
			context.fillText(ring.value, (lastRing.width/2 + ring.width/2 + scheibe.text.right)*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), (lastRing.width/2+scheibe.text.width)*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor));
			context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), (lastRing.width/2 + ring.width/2 + scheibe.text.down)*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor));
			context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), (lastRing.width/2 - ring.width/2 + scheibe.text.up)*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor));
		}
	}

	for (i = scheibe.ringeDrawOnly.length-1; i >= 0; i--){
		var ring = scheibe.ringeDrawOnly[i];

		context.globalAlpha = 1.0;
		context.fillStyle = ring.color;
		context.beginPath();
		context.arc(lastRing.width/2*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), lastRing.width/2*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor), ring.width/2*(zoom.scale/scaleFactor), 0, 2*Math.PI);
		context.closePath();

		context.fill();
		context.strokeStyle = ring.textColor;
		context.lineWidth = 4/scaleFactor;
		context.stroke();
		context.fillStyle = "black";
	}

	for (i = scheibe.rechteckDrawOnly.length-1; i >= 0; i--){
		var rechteck = scheibe.rechteckDrawOnly[i];

		context.beginPath();
		context.globalAlpha = 1.0;
		context.fillStyle = rechteck.color;
		context.fillRect(
			(zoom.offset.x/scaleFactor)-rechteck.width/2*(zoom.scale/scaleFactor),
			(zoom.offset.y/scaleFactor)-rechteck.height/2*(zoom.scale/scaleFactor),
			rechteck.width*(zoom.scale/scaleFactor),
			rechteck.height*(zoom.scale/scaleFactor)
		);
	}

	// Probeecke
	if (probeEcke === true){
		context.beginPath();
		context.moveTo(1450/scaleFactor, 50/scaleFactor);
		context.lineTo(1950/scaleFactor, 50/scaleFactor);
		context.lineTo(1950/scaleFactor, 550/scaleFactor);
		context.fillStyle = scheibe.probeEcke.color;
		context.globalAlpha = scheibe.probeEcke.alpha;
		context.fill();
	}
}

function drawShot(context, scheibe, shot, zoom, last){
	var lastRing = scheibe.ringe[scheibe.ringe.length-1];
	var currentRing = scheibe.ringe[scheibe.ringe.length - shot.ring.int];

	if (last){
		if (currentRing){
			context.fillStyle = currentRing.hitColor;
		}
		else {
			context.fillStyle = scheibe.defaultHitColor;
		}
		context.globalAlpha = 1.0;
	}
	else {
		context.fillStyle = "#ffffff";
		context.globalAlpha = 0.5;
	}
	context.beginPath();
	context.arc((lastRing.width/2 + shot.x/1000)*(zoom.scale/scaleFactor)+(zoom.offset.x/scaleFactor), (lastRing.width/2 - shot.y/1000)*(zoom.scale/scaleFactor)+(zoom.offset.y/scaleFactor), scheibe.kugelDurchmesser/2*(zoom.scale/scaleFactor), 0, 2*Math.PI);
	context.closePath();
	context.fill();
}

function drawMode(context, scheibe, serie, zoom, selectedShotIndex){
	if (serie){
		for (var i in serie){
			if (i != selectedShotIndex){
				drawShot(context, scheibe, serie[i], zoom, false);
			}
		}
		if (serie.length > selectedShotIndex && selectedShotIndex > -1){
			var selectedShot = serie[selectedShotIndex];
			drawShot(context, scheibe, selectedShot, zoom, true);
		}
	}
}

function resize() {
	if (scope.size === undefined){
		var width = element.parent().outerWidth(true);
		var height = element.parent().outerHeight(true);

		var newHeight = width;

		if (newHeight > height) {
			width = height;
		}
		else {
			height = newHeight;
		}

		canvas.style.top = (element.parent().height() - height) / 2 + "px";
		canvas.style.width = width+'px';
		canvas.style.height = height+'px';
	}
	else {
		canvas.style.width = scope.size;
		canvas.style.height = scope.size;
	}

}

var templates = {
	default: __dirname+"/templates/default.pug",
	dateless: __dirname+"/templates/dateless.pug",
	bigImage: __dirname+"/templates/bigImage.pug",
};



// Trigges PDF generation and printing
// data: DSC Data Object
// callback: function(error)
module.exports = function(data, templateName, callback){
	for (var session_i in data.sessionParts){
		var session = data.sessionParts[session_i];
		session.index = session_i;

		for (var serien_i in session.serien){
			var serie = session.serien[serien_i];
			serie.index = serien_i;

			var scheibe = data.disziplin.scheibe;
			var zoomLevel = scheibe.defaultZoom;
			var selectedShotIndex = -1;
			var probeEcke = data.disziplin.parts[session.type].probeEcke;

			if (scheibe !== undefined && serie !== undefined && zoomLevel !== undefined && selectedShotIndex !== undefined){
				var canvas = createCanvas(2000/scaleFactor, 2000/scaleFactor, 'pdf');
				var context = canvas.getContext('2d');

				drawScheibe(context, scheibe, serie.shots, zoomLevel, selectedShotIndex, probeEcke);
				drawMode(context, scheibe, serie.shots, zoomLevel, selectedShotIndex);

				fs.writeFileSync(__dirname+"/tmp/scheibe_"+session_i+"_"+serien_i+".pdf", canvas.toBuffer());
			}
			// console.log(serie)
		}
		// console.log(session)
	}

	var pug = require('pug');

	var template = templates.default;
	if (templates[templateName] != null) {
		template = templates[templateName];
	}

	// Compile a function
	var fn = ( pug.compile(fs.readFileSync(template, "utf8"), {}) );
	

	var htmlOutput = fn({
		data: data,
		line: config.line
	});

	console.log("[INFO] Trigger Print");

	fs.writeFile(__dirname+"/tmp/print.tex", htmlOutput, function(err) {
		if (err) {
			callback(true);
			console.log(err);
		}
		else {
			child_process.exec("cd lib/print/tmp && pdflatex print.tex", function(err, out, code) {
				if (err) {
					callback(true);
					console.log(err);
				}
				else {
					child_process.exec("cd lib/print/tmp && lp -d "+config.line.printer.name+" print.pdf", function(err, out, code) {
						if (err){
							callback(true);
							console.log(err);
						}
						else {
							callback(false);
						}
					});
				}
			});
		}
	});


};
