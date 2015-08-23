angular.module('dsc.services.grafik', [])


.directive('target', ['$timeout', '$window', function($timeout, $window){

	return {
		template: '<canvas width="2000" height="2000" style="position: relative;"></canvas>',
		scope: {
			session: '=',
		},
		link: function postlink(scope, element, attrs){
			var canvas = element.find('canvas')[0];
			var canvas2D = !!$window.CanvasRenderingContext2D;


			var zoom = {}
			var currentRing = {}

			function drawScheibe(context, session, scheibe){
				var lastRing = scheibe.ringe[scheibe.ringe.length-1]

				for (var i = scheibe.ringe.length-1; i >= 0; i--){
					var ring = scheibe.ringe[i]

					context.globalAlpha = 1.0
					context.fillStyle = ring.color;
					context.beginPath();
					context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
					context.closePath();

					context.fill();
					context.strokeStyle = ring.textColor
					context.lineWidth = 4;
					context.stroke();
					context.fillStyle = "black";

					if (ring.text == true){
						context.font = "bold "+(scheibe.text.size*zoom.scale)+"px verdana, sans-serif";
						context.fillStyle = ring.textColor
						context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + scheibe.text.left)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2 + ring.width/2 + scheibe.text.right)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 + ring.width/2 + scheibe.text.down)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 - ring.width/2 + scheibe.text.up)*zoom.scale+zoom.offset.y);
					}
				}

				for (var i = scheibe.ringeDrawOnly.length-1; i >= 0; i--){
					var ring = scheibe.ringeDrawOnly[i]

					context.globalAlpha = 1.0
					context.fillStyle = ring.color;
					context.beginPath();
					context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
					context.closePath();

					context.fill();
					context.strokeStyle = ring.textColor
					context.lineWidth = 4;
					context.stroke();
					context.fillStyle = "black";
				}

				// Probeecke
				var parts = session.disziplin.parts
				if (parts[session.type].probeEcke == true){
					context.beginPath()
					context.moveTo(1450,50)
					context.lineTo(1950,50)
					context.lineTo(1950,550)
					context.fillStyle = scheibe.probeEcke.color
					context.globalAlpha = scheibe.probeEcke.alpha
					context.fill();
				}
			}

			function drawShot(context, shot, scheibe, last){
				var lastRing = scheibe.ringe[scheibe.ringe.length-1]

				if (last){
					if (currentRing){
						context.fillStyle = currentRing.hitColor
					}
					else {
						context.fillStyle = scheibe.defaultHitColor
					}
					context.globalAlpha = 1.0
				}
				else {
					context.fillStyle = "#cccccc";
					context.globalAlpha = 0.5
				}
				context.beginPath();
				context.arc((lastRing.width/2 + shot.x/1000)*zoom.scale+zoom.offset.x, (lastRing.width/2 - shot.y/1000)*zoom.scale+zoom.offset.y, scheibe.kugelDurchmesser/2*zoom.scale, 0, 2*Math.PI);
				context.closePath();
				context.fill();
			}

			function drawMode(context, session, scheibe){
				var serie = session.serieHistory[session.selection.serie]
				if (serie){
					for (i in serie){
						if (i != session.selection.shot){
							drawShot(context, serie[i], scheibe, false)
						}
					}
					if (serie.length > session.selection.shot){
						var selectedShot = serie[session.selection.shot]
						drawShot(context, selectedShot, scheibe, true)
					}
				}
			}

			function resize() {
				var width = element.parent().outerWidth(true)
				var height = element.parent().outerHeight(true)

				var newHeight = width

				if (newHeight > height) {
					width = height
				}
				else {
					height = newHeight
				}

				canvas.style.top = (element.parent().height() - height) / 2 + "px";
				canvas.style.width = width+'px';
				canvas.style.height = height+'px';
			}
			window.addEventListener('load', resize, false);
			window.addEventListener('resize', resize, false);

			var render = function(a_canvas){
				if (scope.session != undefined){
					var context = a_canvas.getContext("2d");
					resize()

					var session = scope.session
					var serie = session.serieHistory[session.selection.serie]

					context.clearRect(0, 0, a_canvas.width, a_canvas.height);

					var scheibe = session.disziplin.scheibe
					if (serie != undefined && serie.length != 0) {
						var ringInt = serie[session.selection.shot].ringInt
						var ring = scheibe.ringe[scheibe.ringe.length - ringInt]

						currentRing = undefined
						if (ring){
							currentRing = ring
							zoom = ring.zoom
						}
						else if (ringInt == 0){
							zoom = scheibe.minZoom
						}
						else {
							zoom = scheibe.defaultZoom
						}
					}
					else {
						zoom = scheibe.defaultZoom
					}

					drawScheibe(context, session, scheibe)
					drawMode(context, session, scheibe)
				}
			};

			$timeout(function(){
				scope.$watch('session', function(value, old){
					render(canvas)
				})
			});
		}
	};
}]);
