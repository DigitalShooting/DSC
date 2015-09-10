# DigitalShootingClient (DSC)
Client zum erfassen von Schüssen mit Anbindung an Häring ESA.

![Demo](https://raw.githubusercontent.com/DigitalShooting/assets/master/demo1.png)




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

Disziplin | Parts | Beschreibung
---|---|---
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
---|---|---
Probe/ Match | Schaltet auf den nächsten Part
Neue Scheibe | Erzeugt eine neue Session mit dem gleichen Part Type
Hoch | Wählt den vorhergehenden Schuss aus
Runter | Wählt den nachfolgenden Schuss aus


### Status
Der aktuelle Verbindungsstatus ist erkennbar an dem schwarzen Block links oben in der Infoleiste. Ist dieser nicht vorhanden, ist alles in Ordnung.
- Schwarz: Keine Verbindung zum Server
- Rot: Keine Verbindung zum Interface




## API
Als API kann aktuell nur die Socket.io Schnittstelle genutzt werden, die die Aktuelle Session bereitstellt.
TODO: REST API

### Socket Client -> Server
Methode | Parameter | Beschreibung | Auth
---|---|---|---
`getSession` | | Sendet die Aktuelle Session | false
`getData` | | Sendet das Aktuelle Data Obejct (Alle Sessions) | false
`getConfig` | | Sendet die Aktuelle Config | false
`setNewTarget` | | Neue Scheibe (TODO: Validation if enabled) | true
`setDisziplin` | id | Wechselt die Disziplin | true
`setSelectedSerie` | index | Ausgewählte Serie ändern | true
`setSelectedShot` | index | Ausgewählte Serie ändern | true
`setUser` | user object | Aktuelle Session neuem User zuweisen | true
`setPart` | id | Aktiven Part ändern | true
`print` | | Alle Sessions Drucken | true

### Socket Server -> Client
Methode | Parameter | Beschreibung
---|---|---
`setSession` | Session Object | Sendet die aktuelle Session bei Veränderung
`setData` | Data Object | Sendet alle Session (Data) (bei Veränderung)
`setConfig` | Config Object | Sendet die aktuelle Config



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
- [x] Auth
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
- [ ] Zehntel
- [x] Calculate Sereinsum etc into session -> less logic in client

### 2.0
- [ ] REST API als Zugang zum Backend




## Bugreport/ Feature Request
Mail an: diana@janniklorenz.de




## Licence
GNU GENERAL PUBLIC LICENSE Version 3
