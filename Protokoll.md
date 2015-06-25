# Datenblatt

## Write

### Init
````
FF 55 00 20 00 00 00 06  73 AA FF FF FF 55 01 14
05 FA 14 03 09 0D 08 4F  00 00 00 00 1E DC 01 90
B8 AA FF FF FF 55 01 13  00 47 AA FF FF
````

### Heardbeat
````
FF 55 01 00 54 AA FF FF
````

#### Band
````
FF 55 01 13 00 47 AA FF  FF
````


## Read

### Heardbeat
Wird vom Interface gesendet, wenn keine Aktion stattfindet.
````
55 01 08 5C AA
````

### Schuss
7,6 Links (ca. 5 clicks bei hoch)
````
55 01 1D 00 00 30 CD 00  00 1E 29 00 00 0E 2E A3
AA
````

Analyse
````
55 01 1D 00
00 30 CD 00
00 1E 29 00
00 0E 2E A3
AA

55
01 1D 00 00
30 CD 00 00
1E 29 00 00
0E 2E A3 AA
````




8,8 Rechts (ca. 3 clicks bei tief) [Unvollständig]

Analyse
````
55 01 1D 00
00 3C 5F FF
FF EB 50 FF
FF F9 F5 9D
AA

55 01 08 5C AA

55 40 88 A5 FF

55 01 08 5C AA
...
````
