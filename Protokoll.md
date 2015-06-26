# Datenblatt

## Write

### Init
````
# Mit Verzögerung
FF 55 00 20 00 00 00 06  73 AA FF FF FF 55 01 14
05 FA 14 03 09 0D 08 4F  00 00 00 00 1E DC 01 90
B8 AA FF FF FF 55 01 13  00 47 AA FF FF
````

### Heardbeat
````
# Mit Verzögerung
FF 55 01 00 54 AA FF FF

# Ohne Verzögerung
55 01 13 00 47 AA
````

#### Band
````
# Mit Verzögerung
FF 55 01 13 00 47 AA FF  FF

# Ohne Verzögerung
55 01 17 02 41 AA
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
http://babbage.cs.qc.cuny.edu/IEEE-754.old/32bit.html
````
55 01 1D 00: 8872597127168
00 30 CD 00: 4.4816439589913446e-39
00 1E 29 00: 2.7697729134212896e-39
00 0E 2E A3: 1.302427048577451e-39
AA

55 01 1D 00
00
   30 CD
00 00
   1E 29
00 00
   0E 2E
A3
AA

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
