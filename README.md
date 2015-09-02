# DigitalShootingClient (DSC)
Client zum erfassen von Schüssen mit Anbindung an Häring ESA.

![Demo](https://raw.githubusercontent.com/DigitalShooting/assets/master/demo1.png)




## Installation

### Abhängigkeiten
- NodeJS
- NPM

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

Disziplin | Parts | Beschreibung
--- | --- | ---
LG Training | Probe/ Match | Keine limitierung der Schüsse
LG Training 5er | Probe/ Match | Keine limitierung der Schüsse/ 5er Serien
LG Wettkampf | Probe/ Match | 40 Schuss Match/ 75 min
 | | 
LG Auflage | Probe/ Match | 30 Schuss Match/ 75 min
 | | 
LP Training | Probe/ Match | Keine limitierung der Schüsse
LP Training 5er | Probe/ Match | Keine limitierung der Schüsse/ 5er Serien
LP Wettkampf | Probe/ Match | 40 Schuss Match/ 75 min
 | | 
Demo | Probe | Zufallsschüsse


### Probe/ Match
Die beiden Modie Probe/ Match sind in "Parts" eingeteilt um einer Disziplin mehrere  Parts zuweisen zu können.

Probe ist erkennbar an der Farbigen oberen rechten Ecke, sowie an dem Label "Probe" unter Modus.


### Bedienelement Häring
Folgende Tasten sind Belegt:

Taste | Aktion
--- | --- | ---
Probe/ Match | Schaltet auf den nächsten Part
Neue Scheibe | Erzeugt eine neue Session mit dem gleichen Part Type
Hoch | Wählt den vorhergehenden Schuss aus
Runter | Wählt den nachfolgenden Schuss aus


### Status
Der aktuelle Verbindungsstatus ist erkennbar an dem schwarzen Block links oben in der Infoleiste. Ist dieser nicht vorhanden, ist alles in Ordnung.
- Schwarz: Keine Verbindung zum Server
- Rot: Keine Verbindung zum Interface




## Bugreport/ Feature Request
Mail an: diana@janniklorenz.de




## API
Als API kann aktuell nur die Socket.io Schnittstelle genutzt werden, die die Aktuelle Session bereitstellt.
TODO: REST API

### Socket Client -> Server
Methode | Parameter | Beschreibung
--- | ---
getSession | | Sendet die Aktuelle Session
getData | | Sendet das Aktuelle Data Obejct (Alle Sessions)
getConfig| | Sendet die Aktuelle Config
newTarget | | Neue Scheibe (TODO: Validation if enabled)
setDisziplin | id | Wechselt die Disziplin
setSelectedSerie | index | Ausgewählte Serie ändern
setSelectedShot | index | Ausgewählte Serie ändern
setUser | user object | Aktuelle Session neuem User zuweisen
switchToPart | id | Aktiven Part ändern
print | Alle Sessions Drucken

### Socket Server -> Client
Methode | Parameter | Beschreibung
--- | ---
setSession | Session Object | Sendet die aktuelle Session bei Veränderung
setData | Data Object | Sendet alle Session (Data) (bei Veränderung)
setConfig | Config Object



## Changelog

### v0.7
- [x] Changeing Parts
	- Changing the active Part should get a config which provides:
		- Free mode
		- Change bevor first shot
		- Disabled
	- [x] Toggle Band
- [x] Inner 10
	- Each Target should have a inner 10 property (Teiler).
- [x] Print
	- [ ] Printing confirm alert

### v1.0
- [ ] MongoDB Backend
	- Sessions have to be saved.
- [ ] Backup solution
	- Maybe a dedicated MongoDB server which we try to connect to.
- [ ] Logging
	- Crashed should get logged, also the arrived data from the interface.
- [ ] Rest Time Color
	- The Rest time should get oringe/ red when coming near the end.
- [ ] Last shot/ Time over alert
	- When the last shot was done or the time is over an alert should pop up (auto close/ manual OK Button???)
- [ ] Ring Count List

### 2.0
- [ ] REST API als Zugang zum Backend



## Licence
GNU GENERAL PUBLIC LICENSE Version 2
