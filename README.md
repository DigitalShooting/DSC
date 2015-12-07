# DigitalShootingClient (DSC)
Client zum erfassen von Schüssen mit Anbindung an Häring ESA.

![Demo](https://raw.githubusercontent.com/DigitalShooting/assets/master/DSC_1.gif)




## 1 Installation

### 1.1 Abhängigkeiten
- nodejs (>0.12)
- npm
- g++ (Haering API)
- [node-canvas](https://github.com/Automattic/node-canvas) (Latex Print)
- texlive-full (Latex Print)

### 1.2 Git
````
# clone
git clone https://github.com/DigitalShooting/DSC.git
cd DSC

# NPM install
npm install

# configure (more under /docs/config.md)
ls config/

# start
node index.js
````

Access DSC in you browser for localhost on http://127.0.0.1 (read), or with auth key http://127.0.0.1/?key=123 (write). `123` is the default auth key, defined in config/auth.js.


### 1.3 Konfiguration

### 1.3.1 Authentifizierung
Alle APIs mit Schreibzugriff erfordern eine Authentifizierung mittels mitgeschicktem code. Der Code wird mittels GET Parameter an den URL vom DSC angefügt, z.b. `https://<url>:<port>/?key?<code>`.

Zur Authentifizierung werden 2 Passwörter akzeptiert, welche unter `config/auth.js` festgelegt werden. Eine statisches für den Standrechner/ DSM, sowie ein beim Start dynamisch erzeugtes, z.b. zum anzeigen als QR-Code.




## 2 Bedienung

### 2.1 Probe/ Match
Die beiden Modie Probe/ Match sind in "Parts" eingeteilt um einer Disziplin mehrere  Parts zuweisen zu können.

Probe ist erkennbar an der Farbigen oberen rechten Ecke, sowie an dem Label "Probe" unter Modus.


### 2.2 Eingabegeräte

#### 2.2.1 Bedienelement Häring
Folgende Tasten sind Belegt:

Taste           | Aktion
----------------|-----------------------------------------------------
Links           | Wählt die nachfolgende Serie aus
Rechts          | Wählt die vorhergehenden Serie aus
Hoch            | Wählt den vorhergehenden Schuss aus
Runter          | Wählt den nachfolgenden Schuss aus
Menu            | Öffnet das Disziplinen Menü
Exit            | Schließt alle Overlays
Neue Scheibe    | Erzeugt eine neue Session mit dem gleichen Part Type
Drucken         | Druckt die Gesamte Session
Probe/ Match    | Schaltet auf den nächsten Part




#### 2.2.2 Tastatur
Taste           | Aktion
----------------|------------------------------------
`M`             | Schaltet auf den nächsten Part
UP              | Wählt den vorhergehenden Schuss aus
DOWN            | Wählt den nachfolgenden Schuss aus
RIGHT           | Wählt den nachfolgenden Serie aus
LEFT            | Wählt den vorhergehenden Serie aus


### 2.3 Status
Der aktuelle Verbindungsstatus ist erkennbar an dem schwarzen Block links oben in der Infoleiste. Ist dieser nicht vorhanden, ist alles in Ordnung.
- Schwarz: Keine Verbindung zum Server
- Rot: Keine Verbindung zum Interface




## 3 API
Als API kann aktuell nur die Socket.io Schnittstelle genutzt werden, die die Aktuelle Session bereitstellt.
TODO: REST API

### 3.1 Socket Client -> Server
Methode             | Parameter     | Auth  | Beschreibung
--------------------|---------------|-------|------------------------------------------------
`getSession`        |               | false | Sendet die Aktuelle Session
`getData`           |               | false | Sendet das Aktuelle Data Obejct (Alle Sessions)
`getConfig`         |               | false | Sendet die Aktuelle Config
`setNewTarget`      |               | true  | Neue Scheibe (TODO: Validation if enabled)
`setDisziplin`      | id            | true  | Wechselt die Disziplin
`setSelectedSerie`  | index         | true  | Ausgewählte Serie ändern
`setSelectedShot`   | index         | true  | Ausgewählte Serie ändern
`setUser`           | user object   | true  | Aktuelle Session neuem User zuweisen
`setPart`           | id            | true  | Aktiven Part ändern
`print`             |               | true  | Alle Sessions Drucken
`showMessage`       | Mesage Object | true  | Zeigt ein Overlay mit `title` vom `type` (alert | default) an
`hideMessage`       |               | true  | Schliest die Message

### 3.2 Socket Server -> Client
Methode         | Parameter         | Beschreibung
----------------|-------------------|---------------------------------------------
`setSession`    | Session Object    | Sendet die aktuelle Session bei Veränderung
`setData`       | Data Object       | Sendet alle Session (Data) (bei Veränderung)
`setConfig`     | Config Object     | Sendet die aktuelle Config
`showMessage`   | Mesage Object     | Zeigt ein Overlay mit `title` vom `type` (alert | default) an
`hideMessage`   |                   | Schliest die Message




## 4 Bugreport/ Feature Request
Mail an: diana@janniklorenz.de




## 5 Licence
GNU GENERAL PUBLIC LICENSE Version 3
