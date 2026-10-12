# Neuzeit

Klickbarer Website-Prototyp für **Neuzeit**, eine geplante Beratung für Change-Management im Mittelstand: digitaler und struktureller Wandel, Nutzerakzeptanz neuer Software und Compliance als Change-Prozess. Fehlende Inhalte sind sichtbar als [Platzhalter] markiert. Erfunden ist nichts: keine Kundenstimmen, keine Zahlen, keine Fotos.

**Online ansehen:** https://yannickoderso.github.io/Neuzeit/ (über GitHub Pages, mit SSL)

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Start: Positionierung, Vertrauenssignale, Warum jetzt, Leistungen, Haltung, Vorgehen, Team, Referenzen |
| `leistungen.html` | Die drei Leistungen im Detail, Sprungmarken, häufige Fragen |
| `ueber-uns.html` | Yannick und Aurel, Arbeitsweise, Prototyping als Methode |
| `kontakt.html` | Ablauf des Potenzialgesprächs, Formular, Terminbuchung per Calendly |
| `impressum.html`, `datenschutz.html` | Vorlagen mit Platzhaltern, vor dem Livegang rechtlich prüfen lassen |

Alle Dateien liegen in `neuzeit-prototyp/`. Es gibt kein Framework und keinen Build-Schritt.

## Lokal öffnen

`neuzeit-prototyp/index.html` im Browser öffnen, per Doppelklick oder durch Ziehen ins Browserfenster. Für die weichen Seitenwechsel (View Transitions) braucht es einen kleinen lokalen Server, zum Beispiel:

```
cd neuzeit-prototyp
python3 -m http.server 8000
```

Dann http://localhost:8000 aufrufen.

## Farbvarianten vergleichen

Standard ist die Variante „Warm“. Zum Abstimmen lässt sich der Umschalter mit `?varianten` an der Adresse einblenden, zum Beispiel `index.html?varianten`. Er bleibt dann für die Sitzung sichtbar, `?varianten=aus` blendet ihn wieder aus. Ohne den Umschalter gilt immer „Warm“, auch wenn vorher eine andere Variante gewählt war.

## Gemeinsame Teile ändern

Kopfbereich, Navigation, Footer und der Aufruf „Nächster Schritt“ stehen nur einmal in `neuzeit-prototyp/_partials/`. Nach einer Änderung dort:

```
cd neuzeit-prototyp
python3 tools/sync.py
```

Das Skript setzt die Teile in alle Seiten ein, schreibt Titel, Beschreibung und Vorschaubild jeder Seite und erneuert `sitemap.xml`. Seitentitel und Beschreibungen stehen oben in `tools/sync.py`.

## Vor dem Livegang

1. **Formular:** In `kontakt.html` beim Formular `data-endpoint` mit der Adresse eines Formulardienstes füllen (z. B. Formspree oder Web3Forms; dort die Ziel-E-Mail hinterlegen). Für den Versand ohne JavaScript zusätzlich `action` und `method="post"` setzen. Solange das Feld leer ist, versendet das Formular nichts.
2. **Terminbuchung:** In `kontakt.html` `data-calendly-url` mit dem eigenen Calendly-Link füllen. Der Kalender lädt erst nach einem Klick (Zwei-Klick-Lösung); vorher fließen keine Daten zu Calendly.
3. **Cookie-Banner:** Die Seite setzt keine Cookies und hat kein Tracking, deshalb gibt es keinen Banner. Kommt Analytics oder ein anderer Dienst dazu, wird einer nötig.
4. **Rechtstexte:** Impressum und Datenschutzerklärung ergänzen und von einer Kanzlei prüfen lassen, ebenso die Aussagen zu EU AI Act, NIS2 und DSGVO.
5. **Suchmaschinen:** In `tools/sync.py` `INDEXIERBAR = True` setzen und das Skript ausführen. Bei eigener Domain auch `BASIS_URL` anpassen.
6. **Inhalte:** Alle [Platzhalter] ersetzen: Nachnamen, Porträts, Fotos, Kontaktdaten, Kundenstimmen und Fallbeispiele (nur mit Freigabe).

## Weitere Ordner

- `neuzeit-prototyp/logo/`: Logo in allen Varianten, Favicon, Profilbild und `LOGO.md` mit den Regeln
- `neuzeit-prototyp/fonts/`: Fraunces und Manrope, selbst ausgeliefert (SIL Open Font License)
- `neuzeit-prototyp/og/`: Vorschaubilder für geteilte Links (1200 × 630)
