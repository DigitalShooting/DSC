angular.module('dsc.controllers.main', [])


.controller('name', function ($scope, socket) {
	socket.on("setConfig", function (config) {
		$scope.line = config.line.title;
	});
	socket.on("setData", function (data) {
		setTimeout(function(){
			// trigger window.resize to fix possible wring zize of labels
			$(window).trigger('resize');
		}, 50);

		$scope.name = data.user.firstName + " " + data.user.lastName;

		$scope.openUserMenu = function(){
			$('#userMenu').modal('show');

			$("#userMenu .menuItem").click(function(){
				$('#userMenu').modal('hide');
			});
			$("#userMenu .selectUser").click(function(){

			});
		};

		$scope.hidden = false;
	});
})



.controller('verein', function ($scope, socket) {
	socket.on("setData", function (data) {
		$scope.verein = data.user.verein;
		$scope.manschaft = data.user.manschaft;

		if (
			$scope.verein === "" &&
			$scope.manschaft === ""
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('time', ['$scope', 'timeFunctions', function ($scope, timeFunctions) {
	var refreshIntervalId;

	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}

	function refresh($scope){
		var date = new Date();

		$scope.time = n(date.getHours())+":"+n(date.getMinutes())+":"+n(date.getSeconds()) + " Uhr";
		$scope.date = n(date.getDate())+"."+n((date.getMonth()+1))+"."+n(date.getFullYear());
	}

	timeFunctions.$clearInterval( refreshIntervalId );
	refreshIntervalId = timeFunctions.$setInterval(refresh, 1000, $scope);
	refresh($scope);
}])



.controller('newTarget', function ($scope, socket, dscAPI) {
	socket.on("setData", function (data) {
		$scope.newTarget = function(){
			dscAPI.setNewTarget();
		};


		var parts = data.disziplin.parts;
		if (
			parts[data.sessionParts[data.sessionIndex].type].neueScheibe === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('part', function ($scope, socket) {
	socket.on("setData", function (data) {
		var parts = data.disziplin.parts;

		$scope.activePart = parts[data.sessionParts[data.sessionIndex].type].title;
		$scope.openPartsMenu = function(){
			$('#modeMenu').modal('show');
		};

		$scope.hidden = false;
	});
})



.controller('menuParts', function ($scope, socket, dscAPI) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		$scope.disziplin = data.disziplin.title;
		$scope.parts = [];
		for (var id in data.disziplin.parts){
			var part = data.disziplin.parts[id];
			$scope.parts.push({
				id: id,
				title: part.title,
				active: id == session.type ? "active" : ""
			});
		}
	});

	$scope.switchToPart = function(id){
		dscAPI.setPart(id);
		$('#modeMenu').modal('hide');
	};

	$scope.print = function(printTemplate){
		dscAPI.print(printTemplate);
		$('#modeMenu').modal('hide');
	};
	$scope.menuOldPartSelect = function() {
		$('#modeMenu').modal('hide');
		$('#modeOldPartSelect').modal('show');
	};
})



.controller('menuOldPartSelect', function ($scope, socket, dscAPI) {
	socket.on("setData", function (data) {
		$scope.usedParts = [];
		for (var sessionIndex = 0; sessionIndex < data.sessionParts.length; sessionIndex++) {
			$scope.usedParts.push({
				title: data.disziplin.parts[data.sessionParts[sessionIndex].type].title,
				index: sessionIndex,
				active: sessionIndex == data.sessionIndex ? "active" : "",
			});
		}
	});

	$scope.switchToSession = function(index){
		dscAPI.setSessionIndex(index);
		console.log(index);
	};
})



.controller('disziplin', function ($scope, socket) {
	socket.on("setData", function (data) {
		$scope.disziplin = data.disziplin.title;
		$scope.scheibe = data.disziplin.scheibe.title;

		$scope.openDisziplinMenu = function(){
			$('#disziplinMenu').modal('show');
		};

		$scope.hidden = false;
	});
})



.controller('menuOld', function ($scope, dscAPI, socket, auth, $http) {
	$scope.activeID = "";
	$scope.totalItems = 0;
	$scope.itemsPerPage = 15;
	$scope.currentPage = 1;
	$scope.paginationMaxSize = 5;

	$scope.loadData = function(data){
		dscAPI.loadData(data);
		$('#modeOld').modal('hide');
	};

	function update(){
		$http({
			method: 'GET',
			url: '/api/data',
			params: {
				limit: $scope.itemsPerPage,
				page: $scope.currentPage-1,
			},
		}).then(function successCallback(response) {
			$scope.historieData = response.data;
		}, function errorCallback(response) { });

		$http({
			method: 'GET',
			url: '/api/data/count',
		}).then(function successCallback(response) {
			$scope.totalItems = response.data;
		}, function errorCallback(response) { });
	}

	update();

	$scope.$watch('currentPage', function() {
		update();
	});

	socket.on("switchData", function (data) {
		$scope.activeID = data._id;
		update();
	});
})



.controller('menuDisziplinen', function ($scope, socket, dscAPI) {
	$scope.setDisziplien = function(disziplin){
		dscAPI.setDisziplin(disziplin);
		$('#disziplinMenu').modal('hide');
	};

	$scope.openHistorie = function(){
		$('#disziplinMenu').modal('hide');

		$('#modeOld').modal('show');
	};

	socket.on("setConfig", function (config) {
		$scope.disziplinen = config.disziplinen;

		$scope.hidden = false;
	});
	socket.on("setData", function (data) {
		// $scope.session = session
		$scope.isActive = function(id){
			return id == data.disziplin._id ? "active" : "";
		};

		$scope.hidden = false;
	});
})



.controller('menuUser', function ($scope, dscAPI, socket, auth) {
	$scope.url = location.protocol + '//' + location.host + location.pathname;
	$scope.adminUrl = window.location.href;

	dscAPI.getTempToken();
	setInterval(dscAPI.getTempToken, 30000);
	socket.on("setTempToken", function (token) {
		$scope.adminUrl = location.protocol + '//' + location.host + location.pathname + "?key=" + token;
	});
})



.controller('shortcut', function ($scope, socket, dscAPI) {
	var isTempDisabled = false;

	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		var previousSerie = function(){
			if (session.selection.serie > 0){
				dscAPI.setSelectedSerie(--session.selection.serie);
			}
		};
		var nextSerie = function(){
			if (session.selection.serie < session.serien.length-1){
				dscAPI.setSelectedSerie(++session.selection.serie);
				dscAPI.setSelectedShot(0);
			}
		};
		var previousShot = function(){
			if (session.selection.shot > 0){
				dscAPI.setSelectedShot(--session.selection.shot);
			}
			else if (session.selection.serie > 0){
				dscAPI.setSelectedSerie(--session.selection.serie);
			}
		};
		var nextShot = function(){
			if (session.selection.shot < session.serien[session.selection.serie].shots.length-1){
				dscAPI.setSelectedShot(++session.selection.shot);
			}
			else if (session.selection.serie < session.serien.length-1){
				dscAPI.setSelectedSerie(++session.selection.serie);
				dscAPI.setSelectedShot(0);
			}
		};
		var newTarget = function(){
			if (data.disziplin.parts[session.type].neueScheibe === true){
				dscAPI.setNewTarget();
			}
		};
		var togglePart = function(){
			var index = 0;
			var partsOrder = Object.keys(data.disziplin.parts);

			for (var i = 0; i < partsOrder.length; i++){
				var key = partsOrder[i];

				if (key == session.type){
					index = i;
					break;
				}
			}

			var nextIndex = i + 1;
			var key;
			if (nextIndex < partsOrder.length){
				key = partsOrder[nextIndex];
			}
			else {
				key = partsOrder[0];
			}
			dscAPI.setPart(key);
		};
		var print = function(){
			dscAPI.print();
		};


		var tempDisableShortcut = function(){
			if (isTempDisabled) {
				return false;
			}
			else {
				isTempDisabled = true;
				setTimeout(function(){
					isTempDisabled = false;
				}, 1000);
				return true;
			}
		};

		// LEFT - Previous serie
		shortcut.remove("left");
		shortcut.add("left", previousSerie);

		// RIGHT - Next serie
		shortcut.remove("right");
		shortcut.add("right", nextSerie);

		// F1 (Up)/ UP - Previous shot
		shortcut.remove("F1");
		shortcut.remove("up");
		shortcut.add("F1", previousShot);
		shortcut.add("up", previousShot);

		// F2 (Down)/ DOWN - Next shot
		shortcut.remove("F2");
		shortcut.remove("down");
		shortcut.add("F2", nextShot);
		shortcut.add("down", nextShot);

		// Enter/ Menu
		shortcut.remove("F3");
		shortcut.add("F3", function(){
			$('#disziplinMenu').modal('show');
		});

		// Shutdown
		shortcut.remove("F4");
		shortcut.add("F4", function(){
			$('#disziplinMenu').modal('hide');
			$('#overlayMenu').modal('hide');
			$('#userMenu').modal('hide');
			$('#modeMenu').modal('hide');
		});

		// F5 - Neue Scheibe
		shortcut.remove("F5");
		shortcut.add("F5", function(){
			if (tempDisableShortcut()) {
				newTarget();
			}
		});

		// F6 - OK
		// shortcut.remove("F6")
		// shortcut.add("F6", function(){})

		// F7 - Drucken
		shortcut.remove("F7");
		shortcut.add("F7", print);

		// F8 / m - Abbrechen/ Probe/ Match
		shortcut.remove("F8");
		shortcut.remove("m");
		shortcut.add("F8", function(){
			if (tempDisableShortcut()) {
				togglePart();
			}
		});
		shortcut.add("m", function(){
			if (tempDisableShortcut()) {
				togglePart();
			}
		});
	});
})


.controller('version', function ($scope, socket) {
	socket.on("setAbout", function(about){
		if ($scope.version !== undefined && $scope.version !== about.version){
			location.reload();
		}
		else {
			$scope.version = about.version;
		}
	});
})

.controller('overlayController', function ($scope, socket, dscAPI) {
	socket.on("info", function (info) {
		$('#overlayMenu').modal('hide');

		$scope.infoObject = info;
		$('#overlayMenu').modal('show');

		setTimeout(function(){
			$('#overlayMenu').modal('hide');
		}, 5000);
	});
})

.controller('messageController', function ($scope, socket, dscAPI) {
	$scope.hidden = true;

	socket.on("showMessage", function (message) {
		$scope.hidden = false;
		$scope.message = message;
	});
	socket.on("hideMessage", function (message) {
		$scope.hidden = true;
	});
})



.controller('aktuelleSerie', ['$scope', '$sce', "socket", "dscAPI", function ($scope, $sce, socket, dscAPI) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];
		var aktuelleSerie;

		var serie = data.sessionParts[data.sessionIndex].serien[session.selection.serie];
		if (serie){
			aktuelleSerie = [];
			for (var i = 0; i < serie.shots.length; i++){
				var shot = {
					ring: serie.shots[i].ring.display,
					teiler: serie.shots[i].teiler,
					winkel: serie.shots[i].winkel,
					number: serie.shots[i].number,
					innenZehner: serie.shots[i].innenZehner,
				};

				// Parse if showDetails is set
				var part = data.disziplin.parts[session.type];
				if (part != null && part.showDetails == false) {
					shot.ring = serie.shots[i].ring.int;
				}

				var pfeil;
				var winkel;
				if (shot.innenZehner) {
					pfeil = "&#9099;";
					winkel = - parseInt(shot.winkel) - 225;
				}
				else {
					pfeil = "&#8594;";
					winkel = - parseInt(shot.winkel);
				}

				aktuelleSerie.push({
					index: i,
					number: shot.number,
					value: shot.ring,
					arrow: $sce.trustAsHtml(pfeil),
					winkel: winkel,
					selectedClass: i == data.sessionParts[data.sessionIndex].selection.shot ? "bold" : "",
				});
			}
		}

		$scope.aktuelleSerie = aktuelleSerie;

		if (
			aktuelleSerie === undefined ||
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;

		$scope.selectShot = function(index){
			dscAPI.setSelectedShot(index);
		};
	});
}])



.controller('aktuellerSchuss', ['$scope', '$sce', "socket", function ($scope, $sce, socket) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];
		var currentShot;

		$scope.showTeiler = true;

		var serie = session.serien[session.selection.serie];
		if (serie){
			currentShot = {
				teiler: serie.shots[session.selection.shot].teiler,
				ring: serie.shots[session.selection.shot].ring.display,
				winkel: serie.shots[session.selection.shot].winkel,
				innenZehner: serie.shots[session.selection.shot].innenZehner,
			};

			// Parse if showDetails is set
			var part = data.disziplin.parts[session.type];
			if (part != null && part.showDetails == false) {
				currentShot.ring = serie.shots[session.selection.shot].ring.int;
				$scope.showTeiler = false;
			}

			if (currentShot){
				if (currentShot.innenZehner) {
					currentShot.pfeil = $sce.trustAsHtml("&#9099;");
					currentShot.winkel = - parseInt(currentShot.winkel) - 225;
				}
				else {
					currentShot.pfeil = $sce.trustAsHtml("&#8594;");
					currentShot.winkel = - parseInt(currentShot.winkel);
				}
			}
		}

		$scope.currentShot = currentShot;

		if (
			currentShot === undefined ||
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
}])



.controller('serien', function ($scope, socket, dscAPI) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];
		var serien = [];
		for(var i in session.serien){
			serien.push({
				index: i,
				value: session.serien[i].gesamt,
				selectedClass: i == session.selection.serie ? "bold" : "",
			});
		}

		$scope.serien = serien;

		if (
			serien.length === 0 ||
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});

	$scope.selectSerie = function(index){
		dscAPI.setSelectedSerie(index);
	};
})



.controller('ringeGesamt', function ($scope, socket) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		$scope.gesamt = session.gesamt;
		if (session.selection.serie < session.serien.length){
			$scope.gesamtSerie = session.serien[session.selection.serie].gesamt;
		}

		if (
			session.serien.length === 0 ||
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('schnitt', function ($scope, socket) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		$scope.schnitt = session.schnitt;
		$scope.schnittCalc = session.schnittCalc;

		var part = data.disziplin.parts[session.type];
		if (part.average.enabled === true){
			$scope.schnittCalc = session.schnittCalc + " " + ((session.schnittCalc==1) ? "Ring" : "Ringe");
		}
		else {
			$scope.schnittCalc = "";
		}

		if (
			session.anzahl === 0 ||
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('anzahlShots', function ($scope, socket) {
	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		$scope.gesamt = session.anzahl;

		var part = data.disziplin.parts[session.type];
		if (part.anzahlShots !== 0) {
			$scope.gesamt += "/ " + part.anzahlShots;
		}

		if (session.serien[session.selection.serie] !== undefined){
			$scope.serie = session.serien[session.selection.serie].shots.length + "/ " + part.serienLength;
		}

		if (
			session.anzahl === 0
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('restTime', ['$scope', "socket", 'timeFunctions', function ($scope, socket, timeFunctions) {
	var refreshIntervalId;

	$scope.textColor = "#000";

	function secondsToString(seconds){

		var numhours = Math.floor(seconds / 3600);
		var numminutes = Math.floor((seconds % 3600) / 60);
		var numseconds = (seconds % 3600) % 60;

		Number.prototype.toFixedDown = function(digits) {
			var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
				m = this.toString().match(re);
				return m ? parseFloat(m[1]) : this.valueOf();
		};

		var string = "";
		if(numhours > 0){ string += numhours.toFixedDown(0) + "h "; }
		if(numminutes > 0){ string += numminutes.toFixedDown(0) + "m "; }
		if(numseconds > 0){ string += numseconds.toFixedDown(0) + "s "; }

		return string;
	}

	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		function refresh($scope){
			if (session.time.enabled === true){
				var date = (session.time.end - (new Date().getTime()))/1000;

				$scope.label = "Verbleibende Zeit";
				if (date > 0){
					$scope.rest = secondsToString(date);

					var percentOver = 1 - (date / (session.time.duration*60));
					if (percentOver < 0.8) {
						$scope.textColor = "#000000";
					}
					else if (percentOver < 0.9) {
						$scope.textColor = "#ffa500";
					}
					else {
						$scope.textColor = "#ff0000";
					}
				}
				else {
					$scope.rest = "Zeit abgelaufen";
					$scope.textColor = "#ff0000";
				}
				$scope.gesamt = secondsToString(session.time.duration*60);
			}
		}

		timeFunctions.$clearInterval( refreshIntervalId );
		refreshIntervalId = timeFunctions.$setInterval(refresh, 1000, $scope);
		refresh($scope);

		if (
			session.time.enabled === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
}])



.controller('grafik', function ($scope, socket) {
	// $scope.session = undefined

	$scope.scheibe = undefined;
	$scope.zoomlevel = undefined;
	$scope.serie = undefined;
	$scope.selectedshotindex = undefined;

	socket.on("setData", function (data) {
		var session = data.sessionParts[data.sessionIndex];

		var serieTmp = session.serien[session.selection.serie];
		var serie;
		if (serieTmp === undefined) {
			serie = [];
		}
		else {
			serie = serieTmp.shots;
		}

		var scheibe = data.disziplin.scheibe;
		var zoom;

		if (serie !== undefined && serie.length !== 0) {
			var ringInt = serie[session.selection.shot].ring.int;
			var ring = scheibe.ringe[scheibe.ringe.length - ringInt];

			currentRing = undefined;
			if (ring){
				currentRing = ring;
				zoom = ring.zoom;
			}
			else if (ringInt === 0){
				zoom = scheibe.minZoom;
			}
			else {
				zoom = scheibe.defaultZoom;
			}
		}
		else {
			zoom = scheibe.defaultZoom;
		}

		$scope.serie = serie;
		$scope.scheibe = scheibe;
		$scope.zoomlevel = zoom;
		$scope.selectedshotindex = session.selection.shot;
		$scope.probeecke = data.disziplin.parts[session.type].probeEcke;

		if (
			data.disziplin.parts[session.type].showInfos === false
		) $scope.hidden = true;
		else $scope.hidden = false;
	});
})



.controller('connection', function ($scope, socket) {
	socket.on('disconnect', function(){
		$scope.color = "black";
	});
	socket.on('connect', function(){
		$scope.color = "transparent";
	});
	socket.on('setStatus', function(connected){
		$scope.color = connected === true ? "transparent" : "red";
	});
})




.controller('session', function ($scope, socket) {
	socket.on("setData", function (data) {
		$scope.session = data.sessionParts[data.sessionIndex];
	});
});
