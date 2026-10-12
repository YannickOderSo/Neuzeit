# Schriften

Selbst ausgeliefert, damit beim Laden keine Verbindung zu Google entsteht.

| Datei | Schrift | Quelle | Lizenz |
| --- | --- | --- | --- |
| `fraunces.woff2`, `fraunces-italic.woff2` | Fraunces (aufrecht, kursiv) | github.com/undercasetype/Fraunces | SIL OFL 1.1, `OFL-Fraunces.txt` |
| `manrope.woff2` | Manrope | github.com/sharanda/manrope | SIL OFL 1.1, `OFL-Manrope.txt` |

Manrope ist unverändert (variabel, wght 200–800).

## Fraunces: festgelegt

Beide Fraunces-Dateien sind mit fontTools auf das Schriftbild der Wortmarke
(`logo/LOGO.md`) festgelegt. Das halbiert die Dateien (aufrecht 121 → 60 KB,
kursiv 150 → 73 KB).

- **SOFT 30, WONK 0** fest eingebaut: weiche Kanten, ruhige Formen. Die ruhigen
  Formen (aufrecht h, m, n, s, ñ, &; kursiv b, d, h, k, l, v, w, &) stehen direkt
  in der Zeichentabelle. Die Achsen SOFT und WONK gibt es nicht mehr.
- **wght 300–500**: Die Seite nutzt für Fraunces 330 bis 450, die Wortmarke
  (`logo/LOGO.md`) 470 und 480. In `styles.css` steht deshalb
  `font-weight: 300 500`. Fetter als 500 geht nicht mehr.
- **opsz 9–144** bleibt variabel: Fraunces passt die Formen der Schriftgröße an.
- Alle Zeichen bleiben erhalten (kein Subsetting).

Wiederholen im Hauptordner des Repos (braucht `pip install fonttools brotli`).
Die vollständigen Dateien liegen in der Git-Geschichte (Commit `9e4cc40`):

```sh
cd neuzeit-prototyp && python3 - <<'PY'
import io, subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

for name in ("fraunces", "fraunces-italic"):
    voll = subprocess.run(["git", "show", f"9e4cc40:neuzeit-prototyp/fonts/{name}.woff2"],
                          capture_output=True, check=True).stdout
    font = TTFont(io.BytesIO(voll), recalcTimestamp=False)
    # WONK 0 = ruhige Formen. fontTools lässt beim Festlegen sonst in großen
    # Größen die eingerollten Formen stehen, deshalb die Ersetzung vorher fest
    # in die Zeichentabelle schreiben.
    gsub = font["GSUB"].table
    achsen = [a.axisTag for a in font["fvar"].axes]
    ersatz = {}
    for rec in gsub.FeatureVariations.FeatureVariationRecord:
        if [achsen[c.AxisIndex] for c in rec.ConditionSet.ConditionTable] == ["WONK"]:
            for sub in rec.FeatureTableSubstitution.SubstitutionRecord:
                for i in sub.Feature.LookupListIndex:
                    for st in gsub.LookupList.Lookup[i].SubTable:
                        ersatz.update(st.mapping)
    for tabelle in font["cmap"].tables:
        tabelle.cmap = {cp: ersatz.get(g, g) for cp, g in tabelle.cmap.items()}
    del gsub.FeatureVariations
    gsub.Version = 0x00010000
    font = instancer.instantiateVariableFont(font, {"SOFT": 30, "WONK": 0, "wght": (300, 500)})
    font.flavor = "woff2"
    font.save(f"fonts/{name}.woff2")
PY
```

Der kürzere Aufruf `fonttools varLib.instancer … SOFT=30 WONK=0 wght=300:500`
reicht nicht: Damit kommen ab etwa 22 px die eingerollten Formen (z. B. beim &)
zurück.

## Ersatzschriften

Bis die Webschriften geladen sind, zeigt die Seite Systemschriften, die in
`styles.css` (`@font-face` „Manrope Ersatz“ und „Fraunces Ersatz“) auf die Maße
der Webschriften gebracht sind: Manrope über Arial/Helvetica/Liberation Sans,
Fraunces über Times New Roman/Liberation Serif. Ändern sich Schriften oder
Überschriften stark, die Werte dort neu abstimmen.
