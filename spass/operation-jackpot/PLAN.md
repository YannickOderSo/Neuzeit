# Operation Jackpot – Umsetzungsplan

**Stand:** Version 1 ist freigegeben und umgesetzt. Der Film dauert 2:54, das Video wird im Chat abgegeben und liegt nicht im Repo. Die Entscheidungen zu den offenen Fragen stehen am Ende.

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
| Länge | 2:54 |
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
| Saalaufsicht (neu) | Dutt, Weste, Namensschild, Funkgerät | Kerstin, etwas höher und ohne Navi-Klang | kommt zur Jackpot-Auszahlung; ersetzt den Croupier |

### 3. Spielbank Neunkirchen
- Die Fassade ist nach euren Fotos gezeichnet, die Fotos selbst liegen nicht im Repo. Zu sehen sind eine flache Halle aus hellen Paneelen mit grünem Blätterband und das große grüne Schild „Lucky Jungle“ mit Papagei. Darunter steht „Spielbank Neunkirchen“. Der Eingang ist ein eigener Vorbau mit schwarzem Schild, Palmblättern, Papagei, Drehtür und Pflanzkübeln, daneben ein weißer Zaun.
- Logos sind keine übernommen. Nachts leuchtet „Lucky Jungle“ und flackert passend zum Neonsurren. Zu Halloween stehen Kürbisse vor der Tür, und der Türsteher trägt Hörnchen.
- Unterwegs zieht das gelbe Ortsschild „Neunkirchen“ vorbei. Das Navi sagt „Spielbank Neunkirchen, Saarland“.

### 4. Automatensaal und Clover Link
- **Aufbau nach eurem Foto:** vier hohe Automaten mit grün leuchtendem Rahmen nebeneinander (Nummern 29 bis 32), darüber ein LED-Banner „GRAND JACKPOT“ mit Betrag. Oben auf jedem Automaten steht der Schriftzug, darunter die Jackpots: Grand (rotes Kleeblatt), Major (lila), Minor (blau) und Mini (grün), die letzten beiden als Bonus. Unten ist das Spielmenü mit vier Spielen und Einsätzen von 1 bis 10 Cent, darunter blau leuchtende Tasten. Links im Saal stehen weitere Automatenreihen.
- **Spielablauf nach den Spielregeln** von Red Hot Burning Clover Link (APEX Gaming), einem der Spiele im Menü:
  - 5 Walzen × 3 Reihen mit Früchten, Sieben und Glocke.
  - Ab 5 Kleeblättern startet das *Clover Feature* mit 3 Re-Spins. Die Kleeblätter bleiben liegen, nur die freien Felder drehen neu, und jedes neue Kleeblatt setzt die Re-Spins wieder auf 3.
  - Kleeblätter tragen Beträge oder Mini- und Minor-Bonus.
  - Der Grand Jackpot fällt sofort, wenn das rote Grand-Kleeblatt auf Walze 1, 3 und 5 liegt.
- **Im Film:**
  - Aurel tippt im Menü auf Red Hot Burning und drückt Start. Fünf Kleeblätter landen, das Clover Feature beginnt.
  - Ein Re-Spin bringt nichts (3 → 2). Danach kommt Grand auf Walze 1 dazu, dann Grand auf Walze 3; beide Male springt der Zähler wieder auf 3.
  - Beim letzten Re-Spin bleibt Walze 5 lange stehen und leuchtet, Trommelwirbel, dann landet Grand auf Walze 5.
- Gezeichnet im eigenen Cartoon-Stil, ohne Originallogos. „Clover Link“ steht in eigener Schrift auf den Automaten.
- Die Glückszahl: Yannick will laut Excel Automat 12, Aurel nimmt Automat 31, weil heute der 31. ist.
- Der Jackpot steht beim Gewinn auf **31.031,31 €**. Danach zeigt das Banner kurz „AUTOMAT 31“ und springt dann auf 10.000 € zurück.

### 5. Shisha: AEON Edition 4 Lounge mit Xkah Pro
Die Angaben stammen aus Händlerbeschreibungen. Ein Foto eures Setups würde die Zeichnung genauer machen.
- **AEON Edition 4 Lounge:** etwa 53 cm hoch, schlanke einteilige Rauchsäule aus Edelstahl, mundgeblasene klare Glasbowl, ein Schlauchanschluss, Ausblasventil kaum sichtbar im Fuß. Im Film: ein Schlauch, den die beiden hin und her reichen.
- **Xkah Pro:** kabelloser elektrischer Kopf statt Kohle, mit LED-Display für die Temperatur; ein Licht meldet das Session-Ende. Im Film: schwarz, keine Kohle und keine Glut. Die Kamera geht nah ran, der Xkah piept, das Display zeigt „ON“, zählt bis 280° hoch und dann den Timer ab 31:00 herunter. Yannick zeigt darauf.
- Rest der Szene wie in V0: Blubbern im Glas bei jedem Zug, Rauchwolken formen €, dann 27, dann 31. Auf dem Flipchart sind alle Phasen abgehakt, in der Ecke liegt der dicke Haufen Geld.

### 6. Stimmen
Piper mit den Stimmen aus der Figurentabelle. Jeder Satz wird nach dem Erzeugen mit einer Spracherkennung (Whisper) gegengehört. Was sie falsch versteht, bekommt im Drehbuch eine Lautschrift unter `say`, zum Beispiel „Neun-Kirchen“, „Klouwer Link“, „Iks-Kah Pro“ und „Lage-Besprechung“. Yannicks Flüstersatz kommt aus der Flüsterstimme desselben Sprechers (Thorsten). „Fünf Kleeblätter“ sagt Yannick statt Aurel, weil die Aurel-Stimme das Wort nicht sauber trifft.

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
- **Bild und Ton:** Aurel tippt auf Red Hot Burning und drückt Start, die Walzen surren, fünf Kleeblätter landen, jedes mit eigenem Glockenton. Die Musik setzt aus, das Clover Feature startet.
- **Yannick:** „Fünf Kleeblätter. Das Clover Feature.“
- **Bild:** Re-Spins, Grand auf Walze 1, Grand auf Walze 3.
- **Yannick** *(flüsternd)*: „Rote Kleeblätter auf Walze eins und drei. Fehlt nur noch die Fünf.“
- **Bild und Ton:** Walze 5 hält lange an, Trommelwirbel, Grand landet. *GRAND* blinkt, Fanfare, Jackpot-Klingel, die Rahmen blinken, Münz- und Geldregen, „GRAND JACKPOT!“.
- **Aurel:** „Jaaa! Phase zwei erledigt!“
- **Saalaufsicht** *(kommt mit Funkgerät)*: „Herzlichen Glückwunsch. Grand Jackpot an Automat einunddreißig.“
- **Yannick:** „Ich nenne das: erfolgreiches Erwartungsmanagement.“

### Szene 6 – Die Heimfahrt · unverändert
- **Bild:** Kofferraum offen und randvoll, Geldscheine flattern hinterher, Aurel zeigt Daumen hoch aus dem Fenster.
- **Navi:** „Route nach Hause. Herzlichen Glückwunsch. Sie sind jetzt vermögend.“
- **Aurel:** „Ab in Phase drei.“

### Szene 7 – Shisha zu Hause *(überarbeitet)*
- **Bild:** Wohnzimmer bei gedimmtem Licht. Auf dem Couchtisch steht die AEON Edition 4 Lounge mit dem Xkah Pro. Nahaufnahme: Das Display zählt hoch und zeigt dann den Timer ab 31:00. Danach wandert der eine Schlauch zwischen den beiden hin und her, angestoßen wird mit Teegläsern.
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
| `drehbuch.json` | Texte aus dem Drehbuch oben, neue Stimmen „aufsicht“ und „yannick_leise“, die Walzen-Abfolge mit allen Kleeblättern unter `walzen`, neue Geräusch-Cues für den Automatensaal und den Xkah |
| `bauen.py` | rechnet die Walzenzeiten aus und legt dazu Walzenlauf, Walzenstopp und eine Glocke pro Kleeblatt. Neu sind außerdem Feature-Jingle, Jackpot-Klingel, Drehtür und Xkah-Piepen; Kugel, Chips und Croupier fallen weg. Anker `W2`/`W2e` stehen für Start und letzten Stopp eines Spins |
| `film.html` | neue Szene „automaten“ statt „roulette“: Saal, Clover-Link-Insel, Walzen mit Symbolen, Link-Feature, Jackpot-Anzeige, Saalaufsicht. Shisha-Szene mit AEON Lounge und Xkah Pro, ein Schlauch. Überall Neunkirchen statt Neuenkirchen. |
| `render.mjs` | unverändert |

```
pip install piper-tts
python3 bauen.py       # Stimmen, Musik, Geräusche, Zeitachse
node render.mjs        # Bilder aufnehmen und zum MP4 zusammensetzen
```

Fehlende Stimmmodelle lädt `bauen.py` von Hugging Face nach `build/voices`. Das Rendern dauert etwa zwei Minuten.

## Ablauf

1. Plan abstimmen ✓
2. Drehbuch und Ton umbauen, Aussprache mit Whisper prüfen ✓
3. Fassade, Automatensaal und Shisha zeichnen, Standbilder prüfen ✓
4. Rendern, ansehen, nachschärfen ✓
5. Video im Chat abgeben ✓

## Entscheidungen zu den offenen Fragen

Ihr habt den Plan mit „sollte passen“ freigegeben. Damit gelten die Vorschläge:

1. **AEON Edition 4 Lounge:** Ausführung Clear
2. **Xkah Pro:** Schwarz
3. **Clover Link:** Name im Dialog und in eigener Schrift auf den Automaten, ohne Originallogo
4. **Fahrer:** Aurel
5. **Jackpot-Betrag:** 31.031,31 €
6. **Video:** nur im Chat. `operation-jackpot.mp4` steht in `.gitignore`, im Repo liegen nur Plan und Quellen.

## Rechte

Im Film sind nur noch Thorsten und Kerstin (beide CC0) sowie Karlsson aus dem M-AILABS-Datensatz zu hören. Die Stimme Pavoque (CC BY-NC-SA 4.0) ist mit dem Croupier weggefallen. Der Film soll trotzdem privat bleiben. Clover Link, AEON und Xkah sind Marken ihrer Hersteller. Sie werden im Film nur genannt und frei nachgezeichnet, ohne Logos.
