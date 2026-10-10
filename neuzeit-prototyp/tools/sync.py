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
"""

import json
import pathlib
import re
import sys
from html import escape

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
        "og": "start",
    },
    "datenschutz.html": {
        "seite": "datenschutz",
        "pfad": "datenschutz.html",
        "titel": "Datenschutzerklärung · Neuzeit",
        "og_titel": "Datenschutzerklärung",
        "beschreibung": "Wie Neuzeit mit Ihren Daten umgeht: keine Cookies, kein Tracking, "
                        "Kontaktformular und Terminbuchung nur auf Ihren Wunsch.",
        "og": "start",
    },
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
        "url": BASIS_URL + seite["pfad"],
        "basis": BASIS_URL,
        "og": seite["og"],
        "og_alt": escape("neuzeit-Logo mit dem Satz: " + seite["og_titel"]),
        "robots": "index, follow" if INDEXIERBAR else "noindex",
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
        neu = f"{tiefe}<!-- @{marke} -->\n{einruecken(inhalt, tiefe)}\n{tiefe}<!-- /@{marke} -->"
        html = html[: treffer.start()] + neu + html[treffer.end():]
    pfad.write_text(html, "utf-8")


def sitemap():
    eintraege = "\n".join(
        f"  <url><loc>{BASIS_URL + s['pfad']}</loc></url>" for s in SEITEN.values()
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
