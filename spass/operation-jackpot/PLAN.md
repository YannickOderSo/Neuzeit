# Operation Jackpot – Umsetzungsplan

**Stand:** Version 1, zur Abstimmung. Gebaut wird erst nach Freigabe. Offene Fragen stehen am Ende.

Ein kleiner Spaßauftrag: ein animierter Kurzfilm mit Stimmen und Ton über den 31.10.2026. Aurel und Yannick halten eine Lagebesprechung ab, fahren zur Spielbank Neunkirchen im Saarland, spielen dort Clover Link, gewinnen einen dicken Haufen Geld, fahren heim und rauchen zusammen Shisha an der AEON Lounge mit Xkah Pro.

## Was sich gegenüber der Rohfassung ändert

Eine Rohfassung (V0) ist schon gerendert. Sie zeigt Stil, Figuren und Stimmen, hat aber noch den falschen Ort und das falsche Spiel.

| Thema | Rohfassung V0 | Version 1 |
| --- | --- | --- |
| Ort | Spielbank Neuenkirchen | Spielbank Neunkirchen (Saar) |
| Spiel | Roulettetisch mit Croupier | Automatensaal, Clover Link; keine Tischspiele |
| Glückszahl | Chips auf die 31 | Automat Nummer 31 |
| Shisha | allgemeine Shisha mit Kohle, zwei Schläuche | AEON Edition 4 Lounge mit Xkah Pro, ohne Kohle, ein Schlauch |

## Eckdaten

| | |
| --- | --- |
| Titel | **Operation Jackpot** |
| Länge | etwa 2½ Minuten |
| Format | MP4, 1280 × 720, 30 Bilder pro Sekunde, Stereo-Ton, Untertitel ins Bild gebrannt |
| Ton | Heist-Parodie: übertrieben ernster Plan, absurd simple Ausführung |
| Stimmen | deutsche Sprachsynthese mit Piper, offline, jede Figur mit eigener Stimme |
| Musik und Geräusche | selbst erzeugt, keine fremden Aufnahmen |

## Design-Entscheidungen

### 1. Stil
Flacher 2D-Cartoon, gezeichnet auf einem Canvas. Grundfarben sind die Neuzeit-Farben Nachtblau und Koralle, dazu Neon und Gold für die Spielbank. Es ist Halloween-Nacht: Vollmond, Kürbisse, Fledermäuse. Der Stil aus V0 bleibt, er trägt.

### 2. Figuren
Die Merkmale stammen aus den Fotos im Chat. Die Fotos selbst liegen nicht im Repo.

| Figur | Look | Stimme | Rolle |
| --- | --- | --- | --- |
| **Yannick** | rotbraune Locken, Vollbart, schwarzes Shirt mit Kapuzenjacke, Kopfhörer um den Hals | Thorsten | der Stratege: Phasenmodell, Excel-Tabelle, Berater-Sprech |
| **Aurel** | brauner Seitenscheitel, Schnurrbart, langer dunkelblauer Mantel über Strickpulli, Daumen hoch als Markenzeichen | Karlsson | der Bauchmensch: Snacks, Gefühl und am Ende die richtige Zahl |
| Erzähler | nur Stimme | Thorsten, neutral, etwas tiefer | Kinotrailer-Stimme am Anfang und Ende |
| Navi | nur Stimme | Kerstin | trocken, leicht passiv-aggressiv |
| Türsteher | breit, Sonnenbrille, Teufelshörnchen | Thorsten, deutlich tiefer | lässt sie rein, aus Mitleid |
| Saalaufsicht (neu) | Weste, Namensschild, Funkgerät | Ramona | kommt zur Jackpot-Auszahlung; ersetzt den Croupier |

### 3. Spielbank Neunkirchen
- Die Fassade ist frei gezeichnet, ohne Logo der Saarland Spielbank. Das Neonschild sagt „SPIELBANK NEUNKIRCHEN“ und flackert passend zum Neonsurren.
- Unterwegs zieht das gelbe Ortsschild „Neunkirchen“ vorbei. Das Navi sagt „Spielbank Neunkirchen, Saarland“.

### 4. Automatensaal und Clover Link
- Ein dunkler Saal mit Reihen blinkender Automaten statt Roulettetisch. In der Mitte steht eine Clover-Link-Insel: mehrere Automaten im Halbkreis, darüber eine große Jackpot-Anzeige mit vier Stufen (Grand, Major, Minor, Mini), überall Kleeblätter in Grün und Gold.
- Gezeichnet wird im eigenen Cartoon-Stil, ohne Originallogo und ohne Originalgrafik. Der Name „Clover Link“ fällt im Dialog und steht in eigener Schrift auf der Anzeige (siehe offene Frage 3).
- Walzen: 5 × 3 mit Kleeblatt, Sieben, Glocke, Kirsche und Hufeisen. Der Gewinn läuft so: Kleeblätter landen, das Link-Feature startet, der Bildschirm füllt sich Feld für Feld mit Kleeblättern, oben blinkt „GRAND“.
- Die Glückszahl: Yannick will laut Excel Automat 12, Aurel nimmt Automat 31, weil heute der 31. ist. Die Nummer steht groß auf dem Automaten.
- Jackpot-Betrag als Gag: **31.031,31 €** (siehe offene Frage 5).

### 5. Shisha: AEON Edition 4 Lounge mit Xkah Pro
Die Angaben stammen aus Händlerbeschreibungen. Ein Foto eures Setups würde die Zeichnung genauer machen.
- **AEON Edition 4 Lounge:** etwa 53 cm hoch, schlanke einteilige Rauchsäule aus Edelstahl, mundgeblasene klare Glasbowl, ein Schlauchanschluss, Ausblasventil kaum sichtbar im Fuß. Im Film: ein Schlauch, den die beiden hin und her reichen.
- **Xkah Pro:** kabelloser elektrischer Kopf statt Kohle, mit LED-Display für die Temperatur; ein Licht meldet das Session-Ende. Im Film: keine Kohle und keine Glut. Yannick setzt den Kopf auf, das Display zählt die Temperatur hoch und zeigt dann den Timer „31 min“. Zum Session-Ende blinkt das Licht.
- Rest der Szene wie in V0: Blubbern im Glas bei jedem Zug, Rauchwolken formen €, dann 27, dann 31. Auf dem Flipchart sind alle Phasen abgehakt, in der Ecke liegt der dicke Haufen Geld.

### 6. Stimmen
Piper mit den Stimmen aus der Figurentabelle. Jeder Satz wird nach dem Erzeugen mit einer Spracherkennung (Whisper) gegengehört. Was sie falsch versteht, bekommt im Drehbuch eine Lautschrift unter `say`, wie schon bei „Neuenkirrchen“ und „Lage-Besprechung“. Neu zu prüfen: „Neunkirchen“, „Clover Link“, „Xkah“, „Grand Jackpot“.

### 7. Musik und Geräusche
| Szene | Musik | Geräusche |
| --- | --- | --- |
| Intro, Lage, Fahrten | Heist-Thema in d-Moll: Walking Bass, Besen, Vibraphon, Spuk-Theremin | Trailer-Schlag, Flipchart-Plopp, Motor, Navi-Gong |
| Eingang | Heist-Thema gedämpft hinter der Tür | Neonsurren, Schritte, knarzende Tür |
| Automatensaal | Heist-Thema, setzt beim Link-Feature aus | Automaten-Klingeln im Raum, Walzen surren, Walzenstopps, ein Glockenton pro Kleeblatt, Trommelwirbel, Jackpot-Fanfare mit Klingeln und Münzregen |
| Shisha | Lounge-Version des Themas | Piepen beim Einschalten des Xkah, Blubbern |

Musik wird leiser, sobald jemand spricht.

### 8. Augenzwinkern und Verantwortung
Der Abspann bleibt mit: *Spiel mit Verantwortung. Glücksspiel kann süchtig machen. Diese Geschichte ist frei erfunden, der Geldhaufen leider auch.* Bei Glücksspiel und Shisha mit echten Ortsnamen ist das ein vernünftiger Schlusspunkt.

## Drehbuch

### Szene 1 – Trailer-Intro (Nacht, Vollmond) · unverändert
- **Bild:** Sternenhimmel, Fledermäuse, Kürbis. *OPERATION JACKPOT* knallt ins Bild, darunter *31.10.2026*. Silhouetten vor dem Mond, Fragezeichen.
- **Erzähler:** „Einunddreißigster Oktober, zweitausendsechsundzwanzig. Zwei Männer. Ein Plan. Und erstaunlich wenig Ahnung.“

### Szene 2 – Die Lagebesprechung (Wohnzimmer, Flipchart)
- **Bild:** wie V0. Auf dem Lageplan steht jetzt „Spielbank Neunkirchen“. Die zweite Flipchart-Seite zeigt die Stakeholder-Analyse von Automat 31.
- **Yannick:** „Meine Herren, willkommen zur Lagebesprechung.“
- **Aurel:** „Ich bin der Einzige hier.“
- **Yannick:** „Phase eins: Wir fahren zur Spielbank Neunkirchen.“
- **Yannick:** „Phase zwei: Wir machen einen dicken Haufen Geld.“
- **Aurel:** „Und wie genau?“
- **Yannick:** „Phase zwei ist … ein dicker Haufen Geld.“
- **Aurel:** „Genial. Und Phase drei?“
- **Yannick:** „Heimfahren. Shisha.“
- **Aurel:** „Das ist der beste Plan, den ich je gesehen habe.“
- **Yannick:** „Ich habe sogar eine Stakeholder-Analyse vom Spielautomaten gemacht.“ *(neu)*
- **Aurel:** „Der Automat hat keine Stakeholder.“ *(neu)*
- **Yannick:** „Noch nicht.“

### Szene 3 – Die Anfahrt (Landstraße bei Nacht)
- **Bild:** wie V0. Das Ortsschild heißt jetzt „Neunkirchen“.
- **Navi:** „Route wird berechnet. Ziel: Spielbank Neunkirchen, Saarland. Voraussichtliche Ankunft: reich.“ *(geändert)*
- **Aurel:** „Hast du die Snacks?“
- **Yannick:** „Ich habe einen Projektplan.“
- **Aurel:** „Kann man den essen?“
- **Navi:** „In dreihundert Metern rechts abbiegen. Bitte lassen Sie Ihre Würde im Fahrzeug.“

### Szene 4 – Am Eingang · Dialog unverändert
- **Bild:** wie V0, Neonschild „SPIELBANK NEUNKIRCHEN“.
- **Türsteher:** „Halloween, hm? Als was geht ihr?“
- **Yannick:** „Gar nicht verkleidet. Wir sind Unternehmensberater.“
- **Türsteher:** „Gruselig. Rein mit euch.“

### Szene 5 – Der Automatensaal *(neu)*
- **Bild:** Kamerafahrt durch die Automatenreihen bis zur Clover-Link-Insel. Die Jackpot-Anzeige leuchtet: Grand 31.031,31 €.
- **Aurel:** „Da ist er. Clover Link.“
- **Yannick:** „Laut meiner Excel-Tabelle nehmen wir Automat zwölf. Beste Auszahlungskurve.“
- **Aurel:** „Heute ist der Einunddreißigste. Ich nehm die Einunddreißig.“ *(setzt sich an Automat 31)*
- **Yannick:** „Das ist methodisch überhaupt nicht belastbar.“
- **Bild und Ton:** Aurel drückt Start, die Walzen surren, ein Kleeblatt landet, noch eins, noch eins. Die Musik setzt aus, das Link-Feature startet, Feld für Feld füllen sich die Walzen mit Kleeblättern, Trommelwirbel.
- **Yannick** *(flüsternd)*: „Sind das … alles Kleeblätter?“
- **Bild und Ton:** *GRAND* blinkt, Fanfare, Klingeln, die Lichter drehen durch, Münzregen.
- **Aurel:** „Jaaa! Phase zwei erledigt!“
- **Saalaufsicht** *(kommt mit Funkgerät)*: „Herzlichen Glückwunsch. Grand Jackpot an Automat einunddreißig.“
- **Yannick:** „Ich nenne das: erfolgreiches Erwartungsmanagement.“

### Szene 6 – Die Heimfahrt · unverändert
- **Bild:** Kofferraum offen und randvoll, Geldscheine flattern hinterher, Aurel zeigt Daumen hoch aus dem Fenster.
- **Navi:** „Route nach Hause. Herzlichen Glückwunsch. Sie sind jetzt vermögend.“
- **Aurel:** „Ab in Phase drei.“

### Szene 7 – Shisha zu Hause *(überarbeitet)*
- **Bild:** Wohnzimmer bei gedimmtem Licht. Auf dem Couchtisch steht die AEON Edition 4 Lounge. Yannick setzt den Xkah Pro auf, das Display zählt hoch und springt auf „31 min“. Ein Schlauch wandert zwischen den beiden hin und her.
- **Yannick:** „Xkah Pro. Keine Kohle, kein Stress. Timer: einunddreißig Minuten.“ *(neu)*
- **Aurel:** „Auf die beste Lagebesprechung aller Zeiten.“
- **Yannick:** „Auf Phase drei.“
- **Aurel:** „Und nächstes Jahr? Einunddreißigster Oktober, zweitausendsiebenundzwanzig?“
- **Bild:** Eine Rauchwolke formt die 27.
- **Yannick:** „Dann nehmen wir Automat siebenundzwanzig.“ *(geändert)*
- **Aurel:** „Methodisch belastbar.“
- **Bild:** Beide lachen, die Wolke formt die 31.

### Szene 8 – Abspann
- **Erzähler:** „Operation Jackpot.“ … „Demnächst.“ … „Vielleicht.“ … „Eher nicht.“
- **Abspann:** Figuren, Stimmen, Werkzeuge, der Hinweis zum verantwortungsvollen Spielen. Der Kürbis zwinkert.

## Technische Umsetzung

Die Werkzeugkette aus V0 bleibt. Zu ändern ist Folgendes:

| Datei | Änderung |
| --- | --- |
| `drehbuch.json` | Texte aus dem Drehbuch oben, neue Stimme „aufsicht“ (Ramona), neue Geräusch-Cues für den Automatensaal und den Xkah |
| `bauen.py` | neue Geräusche: Walzenlauf, Walzenstopp, Kleeblatt-Glocke, Jackpot-Klingeln, Xkah-Piepen; Kugel, Chips und Croupier fallen weg |
| `film.html` | neue Szene „automaten“ statt „roulette“: Saal, Clover-Link-Insel, Walzen mit Symbolen, Link-Feature, Jackpot-Anzeige, Saalaufsicht. Shisha-Szene mit AEON Lounge und Xkah Pro, ein Schlauch. Überall Neunkirchen statt Neuenkirchen. |
| `render.mjs` | unverändert |

```
pip install piper-tts
python3 bauen.py       # Stimmen, Musik, Geräusche, Zeitachse
node render.mjs        # Bilder aufnehmen und zum MP4 zusammensetzen
```

Fehlende Stimmmodelle lädt `bauen.py` von Hugging Face nach `build/voices`. Das Rendern dauert etwa zwei Minuten.

## Ablauf

1. Diesen Plan abstimmen und die offenen Fragen klären
2. Drehbuch und Ton umbauen, Aussprache mit Whisper prüfen
3. Automatensaal und Shisha zeichnen, Standbilder prüfen
4. Rendern, ansehen, nachschärfen
5. Fertiges Video hier im Chat abgeben; ob es auch ins Repo kommt, klärt Frage 6

## Offene Fragen

1. **AEON Edition 4 Lounge:** Welche Ausführung habt ihr, Clear, Copper Edge oder eine andere? Am besten wäre ein Foto, das wie die Personenfotos nur im Chat bleibt.
2. **Xkah Pro:** Welche Farbe: Schwarz, Silber, Blau oder Pink?
3. **Clover Link auf dem Bildschirm:** Name im Dialog und in eigener Schrift auf der Jackpot-Anzeige, gezeichnet ohne Originallogo. Passt das, oder lieber ein Fantasiename wie „Klee-Link“?
4. **Wer fährt?** In V0 sitzt Aurel am Steuer.
5. **Jackpot-Betrag:** „31.031,31 €“ als Gag, oder lieber ohne Zahl?
6. **Video im Repo:** Das Repo ist die Neuzeit-Website, und GitHub Pages veröffentlicht nach dem Mergen alles darin. Vorschlag: das Video nur hier im Chat abgeben und im Repo nur Plan und Quellen behalten.

## Rechte

Die Stimme Pavoque steht unter CC BY-NC-SA 4.0. Sie fällt mit dem Croupier weg, der Film soll trotzdem privat bleiben. Thorsten und Kerstin sind CC0, Karlsson und Ramona stammen aus dem M-AILABS-Datensatz. Clover Link, AEON und Xkah sind Marken ihrer Hersteller. Sie werden im Film nur genannt und frei nachgezeichnet, ohne Logos.
