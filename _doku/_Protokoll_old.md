# Datenblatt

## Write

### Init
````
# Mit Verzögerung
FF 55 00 20 00 00 00 06  73 AA FF FF FF 55 01 14
05 FA 14 03 09 0D 08 4F  00 00 00 00 1E DC 01 90
B8 AA FF FF FF 55 01 13  00 47 AA FF FF


55 00 20 00 00 00 06  73 AA
55 01 14 05 FA 14 03 09 0D 08 4F 00 00 00 00 1E DC 01 90 B8 AA
55 01 13  00 47 AA
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

 0  1  2    3  4  5  6    7  8  9 10   11 12 13 14   15 16
55 01 1D   00 00 30 CD   00 00 1E 29   00 00 0E 2E   A3 AA

55 01 1D
00 00 30 CD
00 00 1E 29
00 00 0E 2E
A3 AA
````


Ring    |  Breite   | 1/2 Breite    | Delta
-       | -         | -             | -
10      |   0,5     |    0,25       |
 9      |   5,5     |    2,75       | 2,5
 8      |  10,5     |    5,25       | 2,5
 7      |  15,5     |    7,75       | 2,5
 6      |  20,5     |   10,25       | 2,5
 5      |  25,5     |   12,75       | 2,5
 4      |  30,5     |   15,25       | 2,5
 3      |  35,5     |   17,75       | 2,5
 2      |  40,5     |   20,25       | 2,5
 1      |  45,5     |   22,75       | 2,5


Analyse
````
55 01
1D  trefferdaten

# Time
00 00 30 CD # 12493

# Treffer X
00 00 1E 29 # 7721

# Treffer Y
00 00 0E 2E # 3630

8,532
8,532 - 4,5/2 = 6,282






15,5
7,75
5,25


6,282 - 5,25 = 1,032
7,75 - 5,25 = 2,5



6,282 - 0,5 = 5,782

22,75





````










8,8 Rechts (ca. 3 clicks bei tief) [Unvollständig]

Analyse
````
55 01 1D
00 00 3C 5F
FF FF EB 50 
FF FF F9 F5
9D AA

55 01 08 5C AA

55 40 88 A5 FF

55 01 08 5C AA
...
````







diff: 0.3639917581484504
ring: 10 Zehntel: 0.7689629670665579
Ring: 10.8 (271, 243)


Ringbreite 10:      0.5
Kaliber/2           2,25
Summe Max10         2,75

2,75 ^= 10,0
0    ^= 10,9

((2,75 - diff) / 2,75 ) * 0.9



RB (Ringbreite/2) = 0.25
RBV (Ringbreite Prev/2) = 0
K (Kaliber/2) = 2,25

vergleichen mit (RB + K) >= diff
    ( (RB - diff) / (RB - RBV) ) * 0.9
