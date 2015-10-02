# DigitalShootingClient (DSC)
Client zum erfassen von Schüssen mit Anbindung an Häring ESA.

![Demo](https://raw.githubusercontent.com/DigitalShooting/assets/master/DSC_1.png)




## Installation

### Abhängigkeiten
- NodeJS
- NPM
- g++

### Git Installation
````
# clone
git clone https://github.com/DigitalShooting/DSC.git
cd DSC

# NPM install
npm install

# configure
ls config/

# start
node index.js
````



## Bedienung

### Disziplinen
Die Disziplin kann durch einen Klick auf "Disziplin/ Aktuelle Disziplin" gewechselt werden.

Disziplin 		| Parts 					| Beschreibung
----------------|---------------------------|------------------------------------------
LG Training 	| Probe/ Match 				| Keine limitierung der Schüsse
LG Training 5er | Probe/ Match 				| Keine limitierung der Schüsse/ 5er Serien
LG Wettkampf 	| Probe/ Match 				| 40 Schuss Match/ 65 min
LG 3 Stellung 	| Probe/ Match (K, L, S) 	| 40 Schuss Match/ 65 min
				 | 							| 
LG Auflage 		| Probe/ Match 				| 30 Schuss Match/ 75 min
				 | 							| 
LP Training 	| Probe/ Match 				| Keine limitierung der Schüsse
LP Training 5er | Probe/ Match 				| Keine limitierung der Schüsse/ 5er Serien
LP Wettkampf 	| Probe/ Match 				| 40 Schuss Match/ 65 min
				| 							| 
Demo LG 		| Probe 					| Zufallsschüsse
Demo LG Blank 	| Probe 					| Zufallsschüsse
Demo LP 		| Probe/ Match 				| Zufallsschüsse/ 6 min


### Probe/ Match
Die beiden Modie Probe/ Match sind in "Parts" eingeteilt um einer Disziplin mehrere  Parts zuweisen zu können.

Probe ist erkennbar an der Farbigen oberen rechten Ecke, sowie an dem Label "Probe" unter Modus.


### Eingabegeräte

#### Bedienelement Häring
Folgende Tasten sind Belegt:

Taste 			| Aktion
----------------|-----------------------------------------------------
Probe/ Match 	| Schaltet auf den nächsten Part
Neue Scheibe 	| Erzeugt eine neue Session mit dem gleichen Part Type
Hoch 			| Wählt den vorhergehenden Schuss aus
Runter 			| Wählt den nachfolgenden Schuss aus

#### Tastatur
Taste 			| Aktion
----------------|------------------------------------
`M` 			| Schaltet auf den nächsten Part
UP 				| Wählt den vorhergehenden Schuss aus
DOWN 			| Wählt den nachfolgenden Schuss aus
RIGHT 			| Wählt den nachfolgenden Serie aus
LEFT 			| Wählt den vorhergehenden Serie aus


### Status
Der aktuelle Verbindungsstatus ist erkennbar an dem schwarzen Block links oben in der Infoleiste. Ist dieser nicht vorhanden, ist alles in Ordnung.
- Schwarz: Keine Verbindung zum Server
- Rot: Keine Verbindung zum Interface




## API
Als API kann aktuell nur die Socket.io Schnittstelle genutzt werden, die die Aktuelle Session bereitstellt.
TODO: REST API

### Socket Client -> Server
Methode 			| Parameter		| Auth	| Beschreibung
--------------------|---------------|-------|------------------------------------------------
`getSession` 		| 				| false | Sendet die Aktuelle Session
`getData` 			| 				| false | Sendet das Aktuelle Data Obejct (Alle Sessions)
`getConfig` 		| 				| false | Sendet die Aktuelle Config
`setNewTarget` 		| 				| true 	| Neue Scheibe (TODO: Validation if enabled)
`setDisziplin` 		| id 			| true 	| Wechselt die Disziplin
`setSelectedSerie` 	| index 		| true 	| Ausgewählte Serie ändern
`setSelectedShot` 	| index 		| true 	| Ausgewählte Serie ändern
`setUser` 			| user object 	| true 	| Aktuelle Session neuem User zuweisen
`setPart` 			| id 			| true 	| Aktiven Part ändern
`print` 			| 				| true 	| Alle Sessions Drucken
`showMessage`		| Mesage Object	| true	| Zeigt ein Overlay mit `title` vom `type` (alert | default) an
`hideMessage`		|				| true	| Schliest die Message

### Socket Server -> Client
Methode 		| Parameter 		| Beschreibung
----------------|-------------------|---------------------------------------------
`setSession` 	| Session Object 	| Sendet die aktuelle Session bei Veränderung
`setData` 		| Data Object 		| Sendet alle Session (Data) (bei Veränderung)
`setConfig` 	| Config Object 	| Sendet die aktuelle Config
`showMessage`	| Mesage Object		| Zeigt ein Overlay mit `title` vom `type` (alert | default) an
`hideMessage`	|					| Schliest die Message




## Bugreport/ Feature Request
Mail an: diana@janniklorenz.de




## Licence
GNU GENERAL PUBLIC LICENSE Version 3
