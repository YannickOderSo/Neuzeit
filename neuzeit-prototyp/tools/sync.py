#!/usr/bin/env python3
"""Gemeinsame Teile in alle Seiten einsetzen.

Der Kopfbereich (<head>), die Kopfzeile und der Footer stehen nur einmal im
Ordner _partials/. Dieses Skript setzt sie in jede Seite zwischen die Marken

    <!-- @kopf -->      … <!-- /@kopf -->
    <!-- @kopfzeile --> … <!-- /@kopfzeile -->
    <!-- @fusszeile --> … <!-- /@fusszeile -->
    <!-- @cta -->       … <!-- /@cta -->        (nur wo gewünscht)

ein und schreibt sitemap.xml neu. Danach sind alle Seiten wieder ganz normale
statische Dateien: Sie lassen sich ohne Build-Schritt im Browser öffnen.

Aufruf aus dem Ordner neuzeit-prototyp:

    python3 tools/sync.py

Platzhalter in den Teilen:
    {{name}}          Wert aus SEITEN bzw. allgemeine Werte unten
    {{aktuell:start}} wird zu aria-current="page", wenn die Seite gemeint ist
    {{> datei}}       fügt eine Datei aus _partials/ ein (z. B. das Logo)

Die Fehlerseite liegt als 404.html im Hauptordner des Repos, weil GitHub Pages
sie dort für jede unbekannte Adresse ausliefert. Sie bekommt ein <base> mit dem
Pfad aus BASIS_URL, damit Stile, Schriften und Links in jeder Tiefe stimmen.
"""

import json
import pathlib
import re
import sys
from html import escape
from urllib.parse import urljoin, urlparse

ORDNER = pathlib.Path(__file__).resolve().parent.parent
TEILE = ORDNER / "_partials"

# Adresse der veröffentlichten Seite. Bei eigener Domain hier ändern.
BASIS_URL = "https://yannickoderso.github.io/Neuzeit/neuzeit-prototyp/"

# Solange der Prototyp Platzhalter enthält, sollen Suchmaschinen ihn nicht
# aufnehmen. Zum Livegang auf True setzen und das Skript erneut ausführen.
INDEXIERBAR = False

SEITEN = {
    "index.html": {
        "seite": "start",
        "pfad": "",
        "titel": "Neuzeit · Change-Management für den Mittelstand",
        "og_titel": "Wandel, den Ihre Leute mittragen.",
        "beschreibung": "Neuzeit begleitet den Mittelstand durch digitalen und strukturellen Wandel: "
                        "Software-Einführung, Restrukturierung, Compliance. Mit Ihren Leuten.",
        "og": "start",
    },
    "leistungen.html": {
        "seite": "leistungen",
        "pfad": "leistungen.html",
        "titel": "Leistungen im Change-Management · Neuzeit",
        "og_titel": "Drei Wege durch den Wandel.",
        "beschreibung": "Digitaler Wandel und Nutzerakzeptanz, strukturelle Transformation, Compliance "
                        "als Change-Prozess: So begleitet Neuzeit den Mittelstand durch Veränderung.",
        "og": "leistungen",
    },
    "ueber-uns.html": {
        "seite": "ueber-uns",
        "pfad": "ueber-uns.html",
        "titel": "Über uns: Yannick und Aurel · Neuzeit",
        "og_titel": "Zwei Blickwinkel. Ein gemeinsamer Weg.",
        "beschreibung": "Betriebswirtschaft trifft Kommunikationspsychologie: Yannick und Aurel verbinden "
                        "Mittelstandsökonomie, Change-Management und klickbare Prototypen.",
        "og": "ueber-uns",
    },
    "kontakt.html": {
        "seite": "kontakt",
        "pfad": "kontakt.html",
        "titel": "Potenzialgespräch vereinbaren · Neuzeit",
        "og_titel": "Lassen Sie uns sprechen.",
        "beschreibung": "Vereinbaren Sie ein unverbindliches Potenzialgespräch. Erzählen Sie uns, was in "
                        "Ihrem Unternehmen ansteht. Wir sagen ehrlich, wie wir helfen können.",
        "og": "kontakt",
    },
    "impressum.html": {
        "seite": "impressum",
        "pfad": "impressum.html",
        "titel": "Impressum · Neuzeit",
        "og_titel": "Impressum",
        "beschreibung": "Impressum von Neuzeit, Change-Management für den Mittelstand.",
        "og": "neutral",
    },
    "datenschutz.html": {
        "seite": "datenschutz",
        "pfad": "datenschutz.html",
        "titel": "Datenschutzerklärung · Neuzeit",
        "og_titel": "Datenschutzerklärung",
        "beschreibung": "Wie Neuzeit mit Ihren Daten umgeht: kein Tracking, keine eigenen Cookies. "
                        "Kontaktformular und Terminkalender nur auf Ihren Wunsch.",
        "og": "neutral",
    },
    # Interne Seiten: nicht in Navigation und Sitemap, nie indexierbar
    "styleguide.html": {
        "seite": "styleguide",
        "pfad": "styleguide.html",
        "titel": "Gestaltungssystem · Neuzeit",
        "og_titel": "Gestaltungssystem",
        "beschreibung": "Farben, Schrift, Bausteine und Regeln des Neuzeit-Auftritts auf einen Blick.",
        "og": "neutral",
        "intern": True,
    },
    "fallbeispiel.html": {
        "seite": "fallbeispiel",
        "pfad": "fallbeispiel.html",
        "titel": "Fallbeispiel (Vorlage) · Neuzeit",
        "og_titel": "Fallbeispiel",
        "beschreibung": "Vorlage für Fallbeispiele von Neuzeit: Ausgangslage, Vorgehen und Ergebnis.",
        "og": "neutral",
        "intern": True,
    },
    # Fehlerseite im Hauptordner des Repos, mit <base> (siehe oben)
    "../404.html": {
        "seite": "fehler",
        "pfad": "../404.html",
        "titel": "Seite nicht gefunden · Neuzeit",
        "og_titel": "Seite nicht gefunden",
        "beschreibung": "Diese Adresse gibt es bei Neuzeit nicht oder nicht mehr.",
        "og": "neutral",
        "intern": True,
        "base": True,
    },
}

# Satz auf dem jeweiligen Vorschaubild (og/<name>.png), für den Alternativtext.
# og/neutral.png zeigt nur Logo und Horizont. tools/og.mjs erzeugt die Bilder.
OG_SAETZE = {
    "start": "Wandel, den Ihre Leute mittragen.",
    "leistungen": "Drei Wege durch den Wandel.",
    "ueber-uns": "Zwei Blickwinkel. Ein gemeinsamer Weg.",
    "kontakt": "Lassen Sie uns sprechen.",
}

BEREICHE = {
    "kopf": "kopf.html",
    "kopfzeile": "kopfzeile.html",
    "fusszeile": "fusszeile.html",
    "cta": "cta.html",          # optional: nur Seiten mit dieser Marke
}
OPTIONAL = {"cta"}


def jsonld(seite):
    """Strukturierte Daten nur auf der Startseite und nur mit gesicherten Angaben."""
    if seite["seite"] != "start":
        return ""
    daten = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Neuzeit",
        "url": BASIS_URL,
        "logo": BASIS_URL + "logo/avatar.png",
        "description": "Change-Management für den Mittelstand: digitaler und struktureller Wandel, "
                       "Nutzerakzeptanz neuer Software und Compliance als Change-Prozess.",
    }
    return '<script type="application/ld+json">' + json.dumps(daten, ensure_ascii=False) + "</script>"


def werte(seite):
    return {
        "titel": escape(seite["titel"]),
        "og_titel": escape(seite["og_titel"]),
        "beschreibung": escape(seite["beschreibung"]),
        "url": urljoin(BASIS_URL, seite["pfad"]),
        "basis": BASIS_URL,
        "og": seite["og"],
        "og_alt": escape("neuzeit-Logo mit dem Satz: " + OG_SAETZE[seite["og"]]
                         if seite["og"] in OG_SAETZE else "neuzeit-Logo"),
        "robots": "index, follow" if INDEXIERBAR and not seite.get("intern") else "noindex",
        "jsonld": jsonld(seite),
    }


def fuellen(text, seite):
    text = re.sub(r"\{\{>\s*([\w.-]+)\s*\}\}", lambda m: (TEILE / m.group(1)).read_text("utf-8").strip(), text)
    text = re.sub(
        r"\{\{aktuell:([\w-]+)\}\}",
        lambda m: ' aria-current="page"' if m.group(1) == seite["seite"] else "",
        text,
    )
    w = werte(seite)

    def ersetzen(m):
        name = m.group(1)
        if name not in w:
            sys.exit(f"Unbekannter Platzhalter {{{{{name}}}}}")
        return w[name]

    return re.sub(r"\{\{(\w+)\}\}", ersetzen, text)


def einruecken(text, tiefe):
    zeilen = [z.rstrip() for z in text.strip("\n").split("\n")]
    while zeilen and not zeilen[-1]:
        zeilen.pop()
    return "\n".join((tiefe + z) if z else "" for z in zeilen)


def seite_aktualisieren(datei, seite):
    pfad = ORDNER / datei
    html = pfad.read_text("utf-8")
    for marke, teil in BEREICHE.items():
        muster = re.compile(r"([ \t]*)<!-- @" + marke + r" -->.*?<!-- /@" + marke + r" -->", re.S)
        treffer = muster.search(html)
        if not treffer:
            if marke in OPTIONAL:
                continue
            sys.exit(f"{datei}: Marke <!-- @{marke} --> fehlt")
        tiefe = treffer.group(1)
        inhalt = fuellen((TEILE / teil).read_text("utf-8"), seite)
        if marke == "kopf" and seite.get("base"):
            basis = f'<base href="{urlparse(BASIS_URL).path}">'
            inhalt = inhalt.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + basis, 1)
        neu = f"{tiefe}<!-- @{marke} -->\n{einruecken(inhalt, tiefe)}\n{tiefe}<!-- /@{marke} -->"
        html = html[: treffer.start()] + neu + html[treffer.end():]
    pfad.write_text(html, "utf-8")


def sitemap():
    eintraege = "\n".join(
        f"  <url><loc>{urljoin(BASIS_URL, s['pfad'])}</loc></url>" for s in SEITEN.values() if not s.get("intern")
    )
    (ORDNER / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{eintraege}\n</urlset>\n",
        "utf-8",
    )


def main():
    for datei, seite in SEITEN.items():
        seite_aktualisieren(datei, seite)
        print("aktualisiert:", datei)
    sitemap()
    print("aktualisiert: sitemap.xml")


if __name__ == "__main__":
    main()
