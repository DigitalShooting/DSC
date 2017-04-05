# Changelog

## Future
- `ADD` API to get new disziplinen
- `ADD` Add Help/ Doku
- move printing to own module to reuse in DSM
- Allow selection of old targets (in parts view)
- Rebuild the connection to the Haering API
- Add power off api
- Prevent multiple prints

## v2.0.2
- `ADD` Support for minDate parameter in /api/data
- `FIX` Fix wrong sum for session and serie when zehntel is used

## v2.0.1
- `ADD` Disziplinen as Submodule
- `UPDATE` Disziplinen (LG Auflage/ Finale)

## v2.0
- `ADD` Breaking changes in API (`setSession` to `setData`)
- `ADD` MongoDB Database backend
- `DEL` SQL
- `ADD` improvements to Disziplinen

## v1.7.2
- `ADD` Disziplinen

## v1.7.1
- `FIX` Load Data

## v1.7
- `ADD` EC6
- `ADD` Load Data (beta)

## v1.6
- `ADD` Doku
- `ADD` Better Latex printing
- `ADD` SQL improvements

## v1.5
- `FIX` Printing Error with Unicode char
- `ADD` Data API

## v1.4
- `ADD` Disziplinen
- `FIX` Latex Printing
- `ADD` More infos on print (Innenzehner, etc.)
- `ADD` Grafix Scale Factor to reduce proccessing
- `ADD` SQL Database

## v1.3
- `ADD` Exit type warning
- `ADD` MySQL connection
- `ADD` Scale factor to use custom size for graphic
- `ADD` Update bower components

## v1.2.1
- `FIX` ExitType handling
- `FIX` NPM package name

## v1.2
- `ADD` Branding (Logo in top left bar)
- `ADD` Center target when `showInfos` is `false`
- `ADD` Clean up codebase and configs
- `ADD` Combine ESA C++ API to one single binary
- `ADD` Review documentation, fixing minor bugs
- `FIX` Name disappered after changing the part

## v1.1
- `ADD` x/ 40 display progress
- `ADD` Lock API Method to display messages
- `ADD` Highlight remaining time
- `ADD` Final mode
- `ADD` API Changes
	- calculation is now done by the server
	- clients just show these infos

## v1.0
- `ADD` Autoreload client page on version change
- `FIX` Basic running version
