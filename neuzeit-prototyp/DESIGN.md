# Gestaltungssystem neuzeit

**Idee:** Ein redaktionelles 12-Spalten-Raster. Überschriften stehen links in einer schmalen Spalte, Inhalte rücken nach rechts. Feine Linien bilden eine Zeitachse, der Horizont (Halbkreis über einer Linie) kehrt als Leitmotiv wieder. Bewegung ist Zusatz: Ohne JavaScript oder bei reduzierter Bewegung steht die ruhige Endfassung.

Dieses Dokument hält fest, was der Code tut. Die Werte stammen aus `styles.css`. Zum Ansehen und Ausprobieren gibt es `styleguide.html`, für das Logo gilt `logo/LOGO.md`.

## Dateien

| Datei | Inhalt |
| --- | --- |
| `styles.css` | alle Stile, Tokens in `:root` (Kapitel 1), danach Grundlagen, Bausteine, Bewegung, Druck |
| `main.js` | Navigation, Einblenden, Scroll-Bewegung, Platzhalter-Hinweis, Formular, Terminbuchung |
| `_partials/` | Kopf, Kopfzeile, Fußzeile und CTA-Band, nur hier ändern |
| `tools/sync.py` | setzt die Partials in alle Seiten ein, schreibt Titel, Vorschaubild und `sitemap.xml` |
| `styleguide.html`, `styleguide.css` | lebendige Übersicht mit den echten Klassen, intern |
| `fonts/` | Fraunces und Manrope, selbst ausgeliefert (SIL Open Font License) |

## Farben

Es gibt genau eine Palette: **„Nachtblau & Koralle“**. Bild: der Himmel kurz vor Sonnenaufgang. Nachtblau trägt Schrift, Buttons und dunkle Abschnitte, heller Dunst die Flächen. Die Koralle gehört allein der Sonne und ihren kleinen Echos. Die früheren Paletten Warm, Klar und Frisch kamen in einer Umfrage nicht gut an; Farbumschalter, Varianten und `?varianten` sind entfernt. Einen Dunkelmodus gibt es nicht (`color-scheme: light`).

| Token | Wert | Einsatz | Kontrast |
| --- | --- | --- | --- |
| `--color-bg` | `#FBF8F5` Morgenweiß | Seitengrund | Nachttinte darauf 16,7:1 |
| `--color-surface` | `#EDEEF1` Dunst | Karten, getönte Abschnitte, CTA-Band | Nachttinte 15,2:1 |
| `--color-surface-strong` | `#E1E3E8` Dunst tief | Grund der Platzhalter, Fläche auf Dunst | Nachttinte 13,8:1 |
| `--color-field` | `#FFFFFF` | Eingabefelder | Nachttinte 17,7:1 |
| `--color-text` | `#11182B` Nachttinte | Text, Linie und Schrift im Logo | 16,7:1 auf Morgenweiß |
| `--color-text-muted` | `#4A5569` | Nebentext | 7,1:1 auf Morgenweiß, 6,5:1 auf Dunst, 5,9:1 auf Dunst tief |
| `--color-line` | `rgba(17, 24, 43, 0.14)` | feine Trennlinien, rein dekorativ | |
| `--color-line-strong` | `#737E92` | Formularränder, Ghost-Button, Platzhalter-Rahmen | 3,9:1 auf Morgenweiß, 3,5:1 auf Dunst |
| `--color-dark` | `#18203F` Nachtblau | dunkle Abschnitte, Footer, Ergebnis-Karte | Morgenweiß darauf 15,1:1 |
| `--color-accent-fill` | `#18203F` Nachtblau | Fläche aller Buttons | Weiß darauf 15,9:1 |
| `--color-accent-fill-hover` | `#283258` | Button beim Hover | Weiß darauf 12,5:1 |
| `--color-accent-border` | `#FBF8F5` | Button-Rand: auf Hell unsichtbar, im dunklen Footer helle Kontur | |
| `--color-on-accent` | `#FFFFFF` | Schrift auf Buttons | |
| `--color-on-dark` | `#FBF8F5` | Schrift auf Nachtblau | 15,1:1 |
| `--color-on-dark-muted` | `#B9C2D4` | Nebentext auf Nachtblau | 8,9:1 |
| `--color-line-on-dark` | `rgba(251, 248, 245, 0.2)` | Linien auf Nachtblau, dekorativ | |
| `--color-accent` | `#E95739` Koralle | Sonne, Grafik, große Ziffern | 3,4:1 auf Morgenweiß, 3,1:1 auf Dunst, nur Grafik |
| `--color-accent-line` | `#E95739` | Linien und Marker auf Hell | wie oben |
| `--color-accent-text` | `#AE3F29` | Koralle für kleine Schrift, Fokusring auf Hell | 5,6:1 auf Morgenweiß, 5,1:1 auf Dunst, 4,6:1 auf Dunst tief |
| `--color-accent-on-dark` | `#FF8A70` helle Koralle | Akzentschrift und große Ziffern auf Nachtblau | 6,9:1 |
| `--color-motif-on-dark` | `#E95739` | dieselbe Sonne auf Nachtblau | 4,5:1 |
| `--color-error` | `#9C1645` Beerenrot | Fehlermeldungen, Rand ungültiger Felder | 7,6:1 auf Morgenweiß, 6,9:1 auf Dunst, 8,0:1 auf Weiß |
| `--color-selection` | `rgba(233, 87, 57, 0.2)` | Textauswahl | |

Kontraste nach WCAG 2.1, aus den CSS-Kommentaren bzw. nachgerechnet.

- **Koralle nur für die Sonne** und ihre kleinen Echos: Punkt am Titel (`.accent-mark`), Knoten der Zeitlinie, große Ziffern, Unterstriche, Lesefortschritt und Marker, der Akzent im Icon. Nie als Fläche, nie für Buttons, nie für Fließtext.
- **Sonne und Button haben nie dieselbe Farbe.** Die Sonne ist das Erkennungszeichen und soll der einzige warme Punkt der Seite bleiben; ein Button in Koralle würde mit ihr um den Blick konkurrieren. Außerdem erreicht Weiß auf Koralle nur 3,6:1, zu wenig für Button-Schrift. Buttons sind deshalb Nachtblau wie die dunklen Abschnitte.
- **Koralle hat drei Fassungen:** `#E95739` für Grafik, `#AE3F29` für kleine Schrift auf Hell, `#FF8A70` für Schrift auf Nachtblau. Auf Dunst tief schafft die Grafik-Koralle nur 2,8:1, dort steht keine Sonne.
- **Fehlerrot** ist ein Beerenrot und bewusst von der Koralle getrennt, damit ein Fehler nicht wie ein Akzent aussieht.
- **Kontext-Tokens:** Bausteine färben über `--fg`, `--fg-muted`, `--line`, `--accent-graphic`, `--accent-type`, `--accent-display`, `--accent-line`, `--accent-mark` und `--focus`, nicht über die Grundfarben. So funktioniert derselbe Baustein auf Hell und auf Nachtblau.

| Kontext-Token | auf Hell | auf Nachtblau |
| --- | --- | --- |
| `--fg` | `--color-text` | `--color-on-dark` |
| `--fg-muted` | `--color-text-muted` | `--color-on-dark-muted` |
| `--line` | `--color-line` | `--color-line-on-dark` |
| `--accent-graphic` | `--color-accent` | `--color-motif-on-dark` |
| `--accent-type` | `--color-accent-text` | `--color-accent-on-dark` |
| `--accent-display` | `--color-accent` | `--color-accent-on-dark` |
| `--accent-line` | `--color-accent-line` | `--color-motif-on-dark` |
| `--focus` | `--color-accent-text` | `--color-on-dark` |

`.section--dark` schaltet alle diese Tokens um, `.site-footer` alle außer `--accent-display`, `.offer__result` nur `--fg`, `--fg-muted`, `--line` und `--accent-graphic`. `--accent-mark` wird nicht umgeschaltet.

- **Papierkörnung:** feines SVG-Rauschen über der ganzen Seite, `--grain-opacity: 0.03`, im Druck aus.
- **Druckfarben** stehen in `logo/LOGO.md`.

## Schrift

- **Fraunces** (variabel, `opsz` automatisch) für Display, Überschriften, Zitate, große Ziffern und Briefings, nie für Fließtext, Labels oder Bedienung. Gewichte 330 bis 450, Kursive für Zitate und Hervorhebungen. Kleinste Größe im Code: 1.125rem (18 px).
  - Die Dateien sind auf das Schriftbild der Wortmarke festgelegt: SOFT 30, WONK 0, `wght` 300–500 (`fonts/README.md`). Fetter als 500 geht nicht, `font-variation-settings` auf `body` bleibt nur als Absicherung.
- **Manrope** für Fließtext, Labels und Bedienung. Fließtext 450, Labels und Buttons 650, Navigation 550.
- **Laden:** Beide Schriften kommen vom eigenen Server, aufrecht vorab geladen (`preload`), die Kursive erst bei Bedarf. Bis sie da sind, stehen „Manrope Ersatz“ und „Fraunces Ersatz“: Systemschriften (Arial, Times New Roman bzw. Liberation), per `size-adjust` und `ascent-override` auf die Maße der Webschriften gebracht, damit beim Wechsel keine Zeile springt.

| Token | Wert | Bereich | Einsatz |
| --- | --- | --- | --- |
| `--fs-display` | `clamp(2.75rem, min(1.25rem + 5vw, max(6vw, 4.5rem)), 5.5rem)` | 44–88 px | `.display`, Gewicht 380, Laufweite −0,025 em |
| Seitenkopf | `clamp(2.5rem, min(1.25rem + 4.2vw, max(5.2vw, 3.9rem)), 4.75rem)` | 40–76 px | `.page-head__title`, klein `clamp(2.25rem, 4.4vw, 3.75rem)` |
| `--fs-quote` | `clamp(2rem, 4.6vw, 4.25rem)` | 32–68 px | Zitat der Haltung, kursiv 340 |
| `--fs-h2` | `clamp(2rem, 3.8vw, 3.375rem)` | 32–54 px | `.h2`, Zeilenhöhe 1.08, −0,02 em |
| `--fs-h3` | `clamp(1.375rem, 1.9vw, 1.75rem)` | 22–28 px | Titel von Karten, Schritten, Grundsätzen, Formular |
| `--fs-lead` | `clamp(1.125rem, 1.35vw, 1.3125rem)` | 18–21 px | `.lead`, Intros, Zeilenhöhe 1.55 |
| `--fs-body` | `1.0625rem` | 17 px | Fließtext, Zeilenhöhe 1.6 |
| `--fs-small` | `0.9375rem` | 15 px | Hinweise, Quellen, Fehlermeldungen |
| `--fs-label` | `0.78125rem` | 12,5 px | Versal-Labels |

Zeilenhöhen: `--lh-tight: 1.04` (Display), `--lh-snug: 1.2` (H3), `--lh-body: 1.6`. Zeilenlänge: `--measure: 36rem`.

**Versal-Labels:** Manrope 650, `--fs-label`, Laufweite 0.12em, Versalien, Zeilenhöhe 1.4. Gilt für `.kicker`, `.eyebrow`, `.reason__tag`, `.step__num`, `.person__role`, `.case__label`, `.field__label` (Laufweite 0.1em) und `.contact__direct dt`; dieselben Werte haben `.site-footer__heading` und `.offer__label`. `.case__service` steht in derselben Regel, setzt sich aber auf normale Schreibung in `--fs-small` zurück. Ziffern in Navigation und Sprungmarken (`.mobile-menu__num`, `.subnav__num`) nutzen Größe, Gewicht und Laufweite der Labels in `--accent-type`.

- `.kicker` über Seitentiteln: `--fg-muted`, davor eine 2rem lange Linie.
- `.eyebrow` über der Zeitlinie eines Abschnitts: `--fg`.
- Übrige Labels in `--fg-muted`, Ausnahmen `.case__label` und `.field__label` in `--fg`.

**Umbruch:**

- Überschriften `text-wrap: balance`, Absätze, Listen und Zitate `text-wrap: pretty`.
- **Sinnzeilen** im Display-Titel: `.ln` bricht nur innen um, wenn die Zeile allein nicht passt; `.ln-keep` hält Wortgruppen zusammen, damit kein Wort allein am Ende steht. Beides erst ab 22.5rem, darunter bricht der Titel frei um.
- **Silbentrennung** (`hyphens: auto`, `hyphenate-limit-chars: 10 4 4`) in schmalen Spalten (`.reason__text`, `.service__list li`, `.step__text`, `.case__story dd`, `.proof__text`, `.principle__text`) und unter 48rem im ganzen Fließtext. Überschriften, Zitate, Labels und Navigation bleiben ungetrennt; lange Wörter in Titeln bekommen ein `&shy;`.

## Raster, Abstände, Breakpoints

- **Container** `--container: 75rem` (1200 px), Seitenrand `--gutter: clamp(1rem, 4.5vw, 2.5rem)`, mindestens 16 px.
- **12 Spalten** ab 60rem, Spaltenabstand `--space-m`. Das Label eines Abschnitts steht in Spalte 1 bis 3, Titel und Inhalt ab Spalte 4. Eingerückte Inhalte nutzen `margin-left: calc((100% + var(--space-m)) / 12 * 3)`.
- **Kopfzeile** `--header-h: 4.5rem`.

| Token | Wert | | Token | Wert |
| --- | --- | --- | --- | --- |
| `--space-3xs` | 0.25rem (4 px) | | `--space-l` | 2.25rem (36 px) |
| `--space-2xs` | 0.5rem (8 px) | | `--space-xl` | 3.5rem (56 px) |
| `--space-xs` | 0.75rem (12 px) | | `--space-2xl` | `clamp(3.5rem, 7vw, 6rem)` (56–96 px) |
| `--space-s` | 1rem (16 px) | | `--space-section` | `clamp(5rem, 11vw, 9.5rem)` (80–152 px) |
| `--space-m` | 1.5rem (24 px) | | | |

Ein Abschnitt hat oben und unten `--space-section`. Folgen zwei Abschnitte auf demselben Grund aufeinander, schrumpft der obere Abstand auf 40 %.

**Breakpoints** (Mobil zuerst, `max-width` immer als `…99rem`):

| Breite | Was sich ändert |
| --- | --- |
| 40rem (640 px) | Navigation statt Menü-Button, Footer dreispaltig |
| 48rem (768 px) | zweispaltige Bausteine (Team, Profile, Grundsätze), Leistungslisten dreispaltig, Zeitlinie im Vorgehen waagerecht; darunter Silbentrennung im ganzen Fließtext und Anlässe als Liste statt Pillen |
| 60rem (960 px) | 12-Spalten-Raster, klebende Spalten (Leistungen, Kontakt) |
| 75rem (1200 px) | volle Containerbreite, Leistungskarten mit Nummer links, Gründe eingerückt |

Dazu einzelne Hilfsgrenzen: 22.5rem (Sinnzeilen), 30rem (darunter Buttons gestapelt und gleich breit, darüber Button in der Kopfzeile), 40rem (Bildband 3:1 statt 3:2). Der Kopf der Leistungen klebt nur ab 50rem Höhe. Das Formular richtet seine Feldzeilen per Container-Abfrage (`@container (min-width: 32rem)`) nach der eigenen Breite.

**Radien:** `--radius-s: 0.375rem` (Felder, Platzhalter, Fokus an Links), `--radius-m: 0.875rem` (Hinweise, Status, Toast), `--radius-l: 1.5rem` (Karten, Formular, Bildplatzhalter, CTA-Band), `--radius-pill: 999px` (Buttons, Chips, Merkmale, kleine Etiketten). Halbkreise entstehen mit `border-radius: d d 0 0`.

**Abschnittskopf** (`.section-head`): Linie oben in `--line` als Zeitlinie, Knoten 0.625rem in `--accent-graphic`, Abstand nach unten `--space-2xl`. Varianten: `__main` (Titel und Einleitung nebeneinander ab 60rem), `--plain` (nur Label, Abstand `--space-l`), `--stacked` (Einleitung und Link untereinander in schmaler Spalte), `--arrive` (Halbkreis statt Knoten, Fuge 2 px; derzeit auf keiner Seite eingesetzt).

## Sonne

Die Sonne bedeutet Ankunft und Neubeginn. Sie ist Signet, keine Dekoration.

- **Höchstens drei große Sonnen pro Seite:**
  1. **Signatur** oben: Hero auf der Startseite, sonst der Seitenkopf.
  2. **Mittelmoment**, nur wo nötig: auf der Startseite die Haltung auf Nachtblau.
  3. **Schluss**: die Sonne im CTA-Band. Das Schlusslogo im Footer ist gedämpft, auch seine Sonne (`currentColor`, 16 % Morgenweiß auf Nachtblau), und zählt nicht.
- **Fuge:** Zwischen Sonne und Horizont bleibt immer ein Spalt von 7 % des Durchmessers, also 0,14 r wie in der großen Logo-Fassung. Im CSS: `--sun-gap: calc(var(--sun-d) * 0.07)` (Seitenkopf, CTA-Band). Hero und Haltung halten die Fuge in ihren SVG-Maßen (Hero r 138, Kante 20 Einheiten über der Linie; Haltung r 170, 24 Einheiten).
- **Größen:** Seitenkopf `--sun-d: clamp(7rem, 15vw, 12.5rem)`, klein `clamp(5rem, 9vw, 7.5rem)`; CTA-Band `clamp(6.5rem, 15vw, 14rem)`. Jeder Seitenkopf setzt die Sonne mit `--sun-x` an eine eigene Stelle.
- **Kleine Sonnen** nur dort, wo etwas ankommt: Logo, Lesefortschritt unter der Kopfzeile (0.625rem), letzter Schritt im Vorgehen (1.75rem), Ergebnis-Karte (3rem), Prototyp-Grafik, Abschnittskopf `--arrive`. Feste Fuge 2 px, in der Ergebnis-Karte 4 px.
- **Ohne Sonne:** Aufzählungszeichen (12-px-Strich in `--fg-muted`), Kunden-Avatare (gestrichelter Kreis), Icons, Markierung im Mobilmenü, Abschlusskarte im Formular. Das Ladezeichen im Button ist ein kleiner Halbkreis in Schriftfarbe, keine Koralle.
- Sonnen haben keine Kontur, die Koralle steht auf jedem Grund für sich.

## Flächen und Karten

| Fläche | Umsetzung | Beispiele |
| --- | --- | --- |
| Morgenweiß | `--color-bg` | Seite, Formular auf Dunst, Bildplatzhalter und Hinweis auf Dunst |
| Dunst | `--color-surface`, `--radius-l` | Leistungskarten, CTA-Band, Prototyp-Demo, Bildplatzhalter, Porträt, getönte Abschnitte (`.offer--tint`, `.contact`) |
| Akzentkante | Dunst, links 3px `--accent-line`, Radius `0 m m 0` | `.reg`, `.legal-note`, `.form__status` |
| Umriss | 1px `--line` auf Morgenweiß | `.booking__panel` |
| Nachtblau | `--color-dark` mit umgeschalteten Kontext-Tokens | `.section--dark`, `.site-footer`, `.offer__result` |
| Platzhalter-Karte | 1px gestrichelt `--color-line-strong`, 45 % Dunst | `.case`, `.quote-card` |

- Innenabstand großer Karten `clamp(1.5rem, 4vw, 2.75rem)`, kleinerer Karten `clamp(1.5rem, 3.5vw, 2.25rem)`.
- Auf einer getönten Fläche wechseln Karten auf Morgenweiß, nie Dunst auf Dunst.
- **Schatten** nur beim schwebenden Hinweis-Toast, in der Prototyp-Grafik und beim Anheben verlinkter Leistungskarten (4 px, nur mit Maus).
- Listen mit Haarlinien (`--line`) statt Kästen; Nummern in Fraunces und `--accent-display`.

## Buttons, Links, Fokus

- **`.btn`**: Pille, Manrope 650, 1rem, Mindesthöhe 3.25rem (52 px), Innenabstand 0.85rem 1.5rem. Beim Drücken `translateY(1px) scale(0.985)`.
  - `--primary`: Fläche `--color-accent-fill` (Nachtblau), Hover `--color-accent-fill-hover`, Schrift `--color-on-accent`, Rand `--color-accent-border`. Im dunklen Footer wird der Button so zur hellen Kontur.
  - `--ghost`: Rand `--color-line-strong`, beim Hover läuft Dunst von links ein (450 ms), Rand wird `--fg`. Nur auf hellem Grund; in der Abschlusskarte läuft Dunst tief ein.
  - `--small`: Mindesthöhe 2.625rem (42 px), Innenabstand 0.55rem 1.1rem, 0.9375rem.
  - Pfeil `.btn__icon` rückt bei Hover und Fokus 3 px nach rechts.
  - Während des Versands `aria-disabled="true"`: kein Hover-Wechsel, kein Drücken, `cursor: progress`.
  - Unter 30rem: Innenabstand seitlich 1.25rem, Buttons in `.btn-row` und im CTA-Band gestapelt und gleich breit.
- **Beschriftung:** Die Haupthandlung heißt überall „Potenzialgespräch vereinbaren“, in der Kopfzeile kurz „Potenzialgespräch“. Zusagen wie „unverbindlich“ stehen im Text daneben (`.btn-row__meta`), nicht im Button.
- **`.text-link`**: Manrope 650, Unterstrich 2px in `--accent-line` mit 0.35em Abstand; beim Hover 0.45em und Farbe `--accent-type`. Der Pfeil steht mit dem letzten Wort in `.nowrap`, damit er nie allein umbricht.
- **Links im Fließtext** (`.prose`, Formularhinweis, Terminbuchung): Schriftfarbe, Unterstrich in `--accent-line`. Footer-Links bekommen beim Hover eine Linie in `--accent-graphic`.
- **Fokus**: `outline: 2px solid var(--focus)` mit 3px Abstand; `--focus` ist Akzentschrift auf Hell und Morgenweiß auf Nachtblau. Buttons bekommen den Ring in `--fg`, damit er sich von der Fläche löst. Text- und Navigationslinks 6px Abstand. Felder einen Doppelring statt Outline. Verlinkte Karten einen Ring um die ganze Karte. Im Mobilmenü wird die Trennlinie zur Fokuslinie. Ein „Zum Inhalt springen“-Link erscheint beim ersten Tab.

## Platzhalter

Was fehlt, ist sichtbar markiert, damit nichts erfunden wirkt. Platzhalter bilden eine eigene Anmerkungsebene außerhalb der Markenfarben.

- **`.ph`**: Systemschrift Monospace, 0.75rem, 1px gestrichelter Rand in `--color-line-strong`, Grund 45 % Dunst tief, Schrift `--fg-muted`. `.ph--strong` mit durchgezogenem Rand markiert ganze Karten. Auf Nachtblau Rand `--line` und 6 % `--fg` als Grund.
- **Text** in eckigen Klammern: `[Platzhalter]` oder `[Platzhalter: was hier hingehört]`.
- **Platzhalter-Links** mit `data-placeholder="…"` zeigen einen Hinweis („… folgt. Im Prototyp ist das ein Platzhalter.“), statt ins Leere zu führen.
- **Bildplatzhalter `.photo`**: Rahmen in Dunst (auf getöntem Grund Morgenweiß), `--radius-l`, Format 4:3, `.photo--wide` 3:1 (unter 40rem 3:2). Innere Linie 16 px vom Rand, vier Schnittmarken als 12-px-Winkel in `--fg-muted`. Oben links das Format als `.ph` („Foto · 4:3“, für Screenreader „Platzhalter für ein Foto:“), mittig das Briefing `.photo__brief` in Fraunces kursiv: wer tut was, wo.
- **Porträt** `.person__portrait`: Bogenform in Dunst mit Horizontlinie, die Initiale in Fraunces kursiv steigt dahinter auf. Darunter der Hinweis „[Platzhalter] Porträtfoto“.
- **Kundenstimmen und Fallbeispiele** als Platzhalter-Karten, Avatar als gestrichelter Kreis. Inhalte nur mit Freigabe.

## Icons

- Raster 32 × 32 (`viewBox="0 0 32 32"`), gemeinsame Unterkante bei 26.
- Linie: `stroke-width: 1.5`, `stroke-linecap` und `stroke-linejoin: round`, keine Füllung, Farbe `--fg`.
- Akzent höchstens als eine kleine Fläche pro Icon (`…-icon-accent`, Fläche `--accent-graphic`). Keine Sonne im Icon.
- Darstellung 2.25rem (36 px), immer `aria-hidden="true"` und `focusable="false"`.
- Pfeile: Raster 16, Pfad `M3 8h9.5M8.5 4 12.5 8l-4 4`, Strich 1.7, `currentColor`; derselbe Pfeil in Buttons und Text-Links.

## Bewegung

| Token | Wert | Einsatz |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Einblenden, Linien, Hover |
| `--ease-sun` | `cubic-bezier(0.16, 0.84, 0.3, 1)` | Sonnen, Marker, aufsteigende Wörter |
| `--dur-calm` | 220ms | Farb- und Randwechsel bei Hover und Fokus |
| `--dur-reveal` | 600ms | Einblenden beim Scrollen |

- **Intro der Startseite** steht nach etwa 2 s: Horizontlinie ab 0,2 s, Sonne 1,4 s ab 0,45 s, Ringe und Skala bis 1,9 s, das Logo hebt seine Sonne ab 1,25 s einmal von der Linie. Der Sonnenaufgang wartet, bis der Horizont sichtbar ist.
- **Seitenköpfe:** Text blendet auf, die Linie zieht sich (1,2 s), die kleine Sonne geht auf (1,5 s ab 0,45 s).
- **Einblenden** (`data-reveal`): nur Elemente unterhalb des ersten Bildschirms, 0.75rem Weg, 600 ms; was gleichzeitig erscheint, gestaffelt um 70 ms, höchstens 210 ms. Ein Element mit Fokus ist sofort sichtbar.
- **Abschnittskopf:** Der Knoten geht auf (0,6 s ab 0,1 s), die Zeitlinie zieht sich von links (1,2 s ab 0,3 s).
- **Beim Scrollen:** Lesefortschritt mit kleiner Sonne, Hero-Sonne hebt sich um bis zu 44 px, Zeitlinie im Vorgehen füllt sich, die Haltungssonne steigt. Das ist der einzige Scroll-Moment einer großen Sonne.
- **Seitenwechsel** (View Transitions): Die Kopfzeile bleibt stehen, die alte Seite blendet in 200 ms aus, die neue in 460 ms ein. Die kleine Sonne gleitet in 900 ms zur Stelle der neuen Seite, der Marker in der Navigation folgt. Danach läuft kein Intro mehr.
- **Statisch** im Endzustand: Sonne im CTA-Band, Schlusslogo im Footer.
- **Reduzierte Bewegung:** `main.js` setzt dann keine Klasse `.motion` und verbirgt nichts zum Einblenden. Alle Animationen und Übergänge laufen 1 ms, Seitenwechsel ohne Übergang, Scroll-Effekte entfallen.

## Formularzustände

- **Feld** `.field`: Label als Versal-Label, Pflichtfeld-Stern in `--fg-muted` (für Screenreader im Hinweis erklärt). Eingabe mindestens 3.125rem hoch, 1px `--color-line-strong`, `--radius-s`, Grund `--color-field`. Hover: Rand `--fg`. Fokus: Doppelring aus 1px `--fg` und 5px Schein in 22 % `--focus`.
- **Fehler** erst nach dem ersten Absenden, danach bei jeder Eingabe neu geprüft: `aria-invalid="true"`, Rand 2px `--color-error`, darunter `.field__error` mit „!“-Zeichen, verknüpft über `aria-describedby`. Der Fokus springt ins erste fehlerhafte Feld.
- **Senden:** Button mit `aria-disabled`, Text „Einen Moment …“ und kleinem Halbkreis in Schriftfarbe als Ladezeichen. Der Ladezustand bleibt auch bei reduzierter Bewegung, er verhindert doppeltes Absenden.
- **Versandfehler:** `.form__status.is-error` mit Kante und „!“ in Fehlerrot, sofort angesagt (`role="alert"`). Eingaben bleiben erhalten.
- **Erfolg:** `.form.is-sent` blendet die Felder aus. Die Statusbox wird zur ruhigen Abschlusskarte mit Überschrift (bekommt den Fokus), dem weiteren Ablauf, „Termin direkt wählen“ und „Weitere Anfrage“.
- Zwei Felder nebeneinander erst ab 32rem Formularbreite. Auswahlfelder mit eigenem Winkel. Spam-Schutz über ein verstecktes Feld.

## Ränder

- **Fehlerseite** (`/404.html`): Seitenkopf mit `.page-head__horizon--dawn`. Die Sonne steht noch unter dem Horizont, nur ihr oberer Rand (0,16 d) ist zu sehen, die Fuge bleibt. Danach ein Button zur Startseite und die wichtigsten Ziele als Liste, kein CTA-Band.
- **Vorschaubilder** (`og/*.png`, 1200 × 630): von `tools/og.mjs` aus den Seiten erzeugt, Titel 80 px, Sonne 260 px mit Fuge, Linie und Skala 72 px über dem unteren Rand. `og/neutral.png` zeigt nur Logo und Horizont.
- **Druck:** A4 mit 16/15/18 mm Rand. Dunkle Flächen werden hell (Kontext-Tokens wie auf Morgenweiß), Buttons zu Konturen. Sonnen, Knoten und Marker behalten ihre Farbe (`print-color-adjust: exact`). Ohne Navigation, Formular, Kalender, Bildplatzhalter und Porträts, dafür mit Absenderzeile.
- **Browser-Bedienelemente:** `accent-color` Nachtblau, Scrollbalken in gedämpfter Tinte, automatisch ausgefüllte Felder ohne Hellblau oder Gelb.
- **Niedrige Laptop-Fenster** (ab 60rem Breite, bis 43.75rem Höhe): Hero-Titel höchstens `10.5vh`, Abstände von Hero und Seitenkopf gestrafft, damit Button und Sonne im ersten Bild stehen.

## Pflege

- **Gemeinsame Teile** stehen nur in `_partials/`. Nach jeder Änderung `python3 tools/sync.py` im Ordner `neuzeit-prototyp` ausführen. Die eingesetzten Blöcke in den Seiten nie direkt bearbeiten.
- **Neue Seite:** Eintrag in `SEITEN` in `tools/sync.py` (Titel, Beschreibung, Vorschaubild), Marken `<!-- @kopf -->` usw. in die Seite, Skript ausführen. Der Alternativtext des Vorschaubilds kommt aus `OG_SAETZE`.
- **Interne Seiten** (`"intern": True`, z. B. `styleguide.html`, `fallbeispiel.html`): immer `noindex`, nicht in der Sitemap, nicht in der Navigation. Eigene Stile für eine interne Seite in einer eigenen Datei, eingebunden am Anfang von `<main>`, weil `sync.py` den `<head>` überschreibt.
- **CSS:** neue Regeln direkt bei den zugehörigen bestehenden Regeln, erst ein vorhandenes Token suchen. Farben nur über Tokens (`var(--…)`), in Bausteinen über die Kontext-Tokens. Kommentare auf Deutsch und knapp.
- **Neue Bausteine** zuerst in `styleguide.html` mit den echten Klassen zeigen und hier festhalten.
- Kein Framework, kein Build-Schritt, kein Tracking, keine externen Dienste beim Laden.

## Bekannte Abweichungen

- Neben den Typo-Tokens gibt es freie Zwischengrößen, etwa `.proof__title` 1.3125rem, `.reg__title` 1.375rem, `.faq__question` `clamp(1.1875rem, 1.7vw, 1.4375rem)`, `.reason__title` ab 60rem `clamp(1.25rem, 1.6vw, 1.5rem)`, `.person__name` `clamp(2rem, 3.4vw, 2.75rem)` und die großen Ziffern `clamp(2.5rem, 5vw, 3.5rem)`. Neue Bausteine nutzen die Tokens.
- Kalender-Icon (Terminbuchung) und Hinweis-Icon (Leistungen) haben Strich 1.4 statt 1.5, das Hinweis-Icon steht im 16er-Raster in `--accent-type`.
