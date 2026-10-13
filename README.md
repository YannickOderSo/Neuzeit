# Neuzeit

Klickbarer Website-Prototyp für **Neuzeit**, eine geplante Beratung für Change-Management im Mittelstand: digitaler und struktureller Wandel, Nutzerakzeptanz neuer Software und Compliance als Change-Prozess. Neuzeit ist noch nicht gegründet und hat noch keine Aufträge abgeschlossen. Was es erst danach geben kann, fehlt deshalb bewusst: Kundenstimmen, Fallbeispiele, Fotos, Kontaktdaten. Erfunden ist nichts. Markierte [Platzhalter] stehen nur noch in Impressum und Datenschutz, für Pflichtangaben, die mit der Gründung feststehen.

**Online ansehen:** https://yannickoderso.github.io/Neuzeit/ (über GitHub Pages, mit SSL)

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Start: Positionierung, Vertrauenssignale, Warum jetzt, Leistungen, Haltung, Vorgehen, Team |
| `leistungen.html` | Die drei Leistungen im Detail, Sprungmarken, häufige Fragen |
| `ueber-uns.html` | Yannick und Aurel, Arbeitsweise, Prototyping als Methode |
| `kontakt.html` | Ablauf des Potenzialgesprächs, Formular, Terminbuchung per Calendly |
| `impressum.html`, `datenschutz.html` | Vorlagen mit Platzhaltern, vor dem Livegang rechtlich prüfen lassen |
| `styleguide.html` | intern: Gestaltungssystem mit Farben, Schrift, Logo und allen Bausteinen |
| `fallbeispiel.html` | intern: Vorlage für Fallbeispiele, nirgends verlinkt; erst nach Aufträgen und mit Freigabe des Kunden füllen |

Alle Dateien liegen in `neuzeit-prototyp/`. Es gibt kein Framework und keinen Build-Schritt.

## Lokal öffnen

`neuzeit-prototyp/index.html` im Browser öffnen, per Doppelklick oder durch Ziehen ins Browserfenster. Für die weichen Seitenwechsel (View Transitions) braucht es einen kleinen lokalen Server, zum Beispiel:

```
cd neuzeit-prototyp
python3 -m http.server 8000
```

Dann http://localhost:8000 aufrufen.

## Gemeinsame Teile ändern

Kopfbereich, Navigation, Footer und der Aufruf „Nächster Schritt“ stehen nur einmal in `neuzeit-prototyp/_partials/`. Nach einer Änderung dort:

```
cd neuzeit-prototyp
python3 tools/sync.py
```

Das Skript setzt die Teile in alle Seiten ein, schreibt Titel, Beschreibung und Vorschaubild jeder Seite und erneuert `sitemap.xml`. Seitentitel und Beschreibungen stehen oben in `tools/sync.py`. Interne Seiten (`"intern": True`) bleiben aus Navigation und Sitemap und sind nie für Suchmaschinen freigegeben.

## Gestaltungssystem

- `neuzeit-prototyp/DESIGN.md` hält fest, was der Code tut: Farben mit Kontrasten, Schrift, Raster und Abstände, die Regeln für die Sonne, Bausteine, Bewegung und Platzhalter.
- `neuzeit-prototyp/styleguide.html` zeigt dieselben Bausteine mit ihren echten Klassen. Neue Bausteine zuerst dort zeigen, dann in `DESIGN.md` festhalten.
- Es gibt genau eine Palette, „Nachtblau & Koralle“. Die Koralle gehört allein der Sonne, Buttons sind Nachtblau.

## Vorschaubilder, 404-Seite, Druck

- **Vorschaubilder** (`neuzeit-prototyp/og/*.png`, 1200 × 630) erzeugt `tools/og.mjs` aus den echten Seiten: Kicker, Titel und Lage der Sonne kommen aus der jeweiligen Seite, Schrift und Farben aus `styles.css`. Nach einer Änderung an Titeln oder Farben neu erzeugen:

  ```
  cd neuzeit-prototyp
  node tools/og.mjs
  python3 tools/sync.py
  ```

  Das Skript braucht Playwright mit Chromium (`npm install playwright`, `npx playwright install chromium`). Es warnt, wenn ein Titel nicht mehr zum Alternativtext in `OG_SAETZE` passt. Impressum, Datenschutz und interne Seiten nutzen `og/neutral.png` mit Logo und Horizont.
- **404-Seite:** `404.html` liegt im Hauptordner, weil GitHub Pages sie dort für jede unbekannte Adresse ausliefert. `tools/sync.py` füllt sie mit und setzt ein `<base>` mit dem Pfad aus `BASIS_URL`, damit Stile und Links in jeder Tiefe stimmen. Lokal lässt sie sich nur ansehen, wenn der Server eine Ebene über dem Repo startet und der Ordner `Neuzeit` heißt: http://localhost:8000/Neuzeit/404.html
- **Druck und PDF:** Die Seiten drucken auf A4 ohne dunkle Flächen, Navigation, Formular und Kalender. Die häufigen Fragen klappen dafür von selbst auf.

## Vor dem Livegang

1. **Formular:** In `kontakt.html` beim Formular `data-endpoint` mit der Adresse eines Formulardienstes füllen (z. B. Formspree oder Web3Forms; dort die Ziel-E-Mail hinterlegen). Für den Versand ohne JavaScript zusätzlich `action` und `method="post"` setzen. Solange das Feld leer ist, versendet das Formular nichts.
2. **Terminbuchung:** In `kontakt.html` `data-calendly-url` mit dem eigenen Calendly-Link füllen. Erst dann erscheinen der Abschnitt „Termin direkt buchen“ und der Verweis darauf, vorher sind beide ausgeblendet. Der Kalender lädt erst nach einem Klick (Zwei-Klick-Lösung); vorher fließen keine Daten zu Calendly. Den Verweis „Oder direkt einen Termin wählen“ im CTA-Band dann in `_partials/cta.html` wieder ergänzen (`kontakt.html#termin`).
3. **Cookie-Banner:** Die Seite setzt keine eigenen Cookies und hat kein Tracking, deshalb gibt es keinen Banner. Calendly kann Cookies setzen, lädt aber erst nach einem Klick mit Hinweis und Einwilligung. Kommt Analytics oder ein anderer Dienst dazu, wird ein Banner nötig.
4. **Rechtstexte:** Impressum und Datenschutzerklärung ergänzen und von einer Kanzlei prüfen lassen, ebenso die Aussagen zu EU AI Act, NIS2 und DSGVO.
5. **Suchmaschinen:** In `tools/sync.py` `INDEXIERBAR = True` setzen und das Skript ausführen. Bei eigener Domain auch `BASIS_URL` anpassen.
6. **Nach der Gründung:** Kontaktdaten ergänzen, im Footer als eigene Spalte (`.site-footer__meta`, Hinweis zum Raster in `styles.css`) und auf der Kontaktseite (`.contact__direct`). Webadresse und E-Mail auch in die Absenderzeile für den Druck (`.site-footer__print` in `_partials/fusszeile.html`), weil gedruckt nur diese Zeile vom Footer bleibt. Danach `python3 tools/sync.py`. Nachnamen und Porträtfotos bei Bedarf in Start- und Über-uns-Seite.
7. **Nach den ersten Aufträgen:** Kundenstimmen (`.quote-card`), Fallbeispiele (`.case`, Vorlage `fallbeispiel.html`) und Fotos aus Projekten (`.photo`) wieder einbauen, nur mit Freigabe der Kunden. Die Bausteine stehen weiter in `styles.css`, den Bildplatzhalter zeigt auch `styleguide.html`.

## Weitere Ordner

- `neuzeit-prototyp/logo/`: Logo in allen Varianten, Favicon, Profilbild und `LOGO.md` mit den Regeln
- `neuzeit-prototyp/fonts/`: Fraunces und Manrope, selbst ausgeliefert (SIL Open Font License). Fraunces ist auf das Schriftbild der Wortmarke festgelegt und dadurch halb so groß; Quelle, Befehl und Ersatzschriften in `fonts/README.md`
- `neuzeit-prototyp/og/`: Vorschaubilder für geteilte Links (1200 × 630)
