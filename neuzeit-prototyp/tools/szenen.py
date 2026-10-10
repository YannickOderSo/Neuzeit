"""Abstrakte Personen-Szenen im Stil des Logos, Platzhalter bis echte Fotos vorliegen.

Aufruf: python3 tools/szenen.py workshop start   (Szene, eindeutige Kennung)
Die Ausgabe ist ein SVG zum Einsetzen in .photo__frame.
"""
import sys

def r(v): return f"{v:.1f}".rstrip('0').rstrip('.')

def figure(cx, w, base, alt=False, i=0, lift=0):
    """Büste wie ein Personen-Symbol: runde Schultern, Kopf mit kleiner Fuge."""
    b = base - lift          # weiter hinten stehende Figuren enden höher
    h = w * 0.66             # Körperhöhe bis zur Linie
    rr = w * 0.5             # Schultern: oben ganz rund
    y0 = b - h
    head = w * 0.25
    gap = w * 0.055
    hy = y0 - gap - head
    x1, x2 = cx - w/2, cx + w/2
    body = (f"M{r(x1)} {r(base)}V{r(y0+rr)}A{r(rr)} {r(rr)} 0 0 1 {r(x2)} {r(y0+rr)}V{r(base)}Z")
    cls = "scene__fig scene__fig--alt" if alt == 1 else ("scene__fig scene__fig--light" if alt == 2 else "scene__fig")
    return (f'<g class="{cls}" style="--i:{i}"><path d="{body}"/>'
            f'<circle cx="{r(cx)}" cy="{r(hy)}" r="{r(head)}"/></g>')

def sun(cx, rad, base, gap):
    yb = base - gap
    return (f'<path class="scene__sun" d="M{r(cx-rad)} {r(yb)}A{r(rad)} {r(rad)} 0 0 1 {r(cx+rad)} {r(yb)}Z"/>')

def scene(name, W, H, base, sun_spec, figs, extra="", uid="a", label=""):
    out = [f'<svg class="scene scene--{name}" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">',
           f'<defs><clipPath id="scene-sky-{uid}"><rect x="0" y="0" width="{W}" height="{base}"/></clipPath></defs>',
           f'<g clip-path="url(#scene-sky-{uid})">',
           f'<g class="scene__rise scene__rise--sun">{sun(*sun_spec)}</g>' if sun_spec else '',
           extra,
           '<g class="scene__people">' + "".join(figure(f[0], f[1], base, f[2] if len(f) > 2 else 0, k, f[3] if len(f) > 3 else 0) for k, f in enumerate(figs)) + '</g>',
           '</g>',
           f'<line class="scene__line" x1="0" y1="{base+0.5}" x2="{W}" y2="{base+0.5}"/>',
           '</svg>']
    return "".join(x for x in out if x)

def board(x, y, w, h, notes, base):
    s = [f'<g class="scene__rise scene__rise--board">'
         f'<path class="scene__stand" d="M{x+w*0.18} {y+h}L{x+w*0.12} {base}M{x+w*0.82} {y+h}L{x+w*0.88} {base}"/>'
         f'<rect class="scene__board" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/>']
    for (nx, ny, acc) in notes:
        s.append(f'<rect class="scene__note{" scene__note--accent" if acc else ""}" x="{x+nx}" y="{y+ny}" width="34" height="34" rx="3"/>')
    s.append('</g>')
    return "".join(s)

def screen(x, y, w, h, base):
    return (f'<g class="scene__rise scene__rise--board">'
            f'<path class="scene__stand" d="M{x+w/2} {y+h}V{base}M{x+w/2-40} {base-1}H{x+w/2+40}"/>'
            f'<rect class="scene__board" x="{x}" y="{y}" width="{w}" height="{h}" rx="8"/>'
            f'<rect class="scene__ui" x="{x+18}" y="{y+18}" width="{w*0.38}" height="10" rx="5"/>'
            f'<rect class="scene__ui" x="{x+18}" y="{y+40}" width="{w-36}" height="{h*0.34}" rx="5"/>'
            f'<rect class="scene__ui scene__ui--accent" x="{x+w-18-70}" y="{y+h-36}" width="70" height="18" rx="9"/>'
            '</g>')

if __name__ == "__main__":
    which = sys.argv[1]
    uid = sys.argv[2] if len(sys.argv) > 2 else "a"
    if which == "workshop":   # Startseite, breit
        print(scene("workshop", 1200, 520, 470, (820, 200, 470, 12),
            [(470, 120, 2, 34), (690, 116, 0, 40), (930, 124, 2, 30),
             (360, 150, 1), (580, 160, 0), (810, 170, 1), (1040, 150, 0)],
            extra=board(50, 150, 300, 200, [(24, 24, True), (70, 24, False), (116, 24, False), (24, 72, False), (70, 72, True), (162, 24, False), (116, 72, False)], 470),
            uid=uid))
    elif which == "schulung":  # Digitaler Wandel
        print(scene("schulung", 800, 600, 520, (330, 170, 520, 10),
            [(250, 210, 1), (470, 230, 0)],
            extra=screen(520, 170, 240, 170, 520), uid=uid))
    elif which == "struktur":  # Strukturelle Transformation
        print(scene("struktur", 800, 600, 520, (170, 140, 520, 10),
            [(330, 128, 2, 30), (520, 132, 0, 34),
             (190, 170, 1), (410, 180, 0), (630, 170, 1)],
            extra=board(400, 110, 330, 210, [(24, 24, False), (24, 72, True), (24, 120, False), (110, 48, False), (110, 96, False), (196, 24, True), (196, 72, False), (196, 120, False), (276, 72, False)], 520), uid=uid))
    elif which == "compliance":
        print(scene("compliance", 800, 600, 520, (400, 190, 520, 10),
            [(150, 150, 1), (300, 170, 0), (500, 170, 2), (650, 150, 1)],
            uid=uid))
