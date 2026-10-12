#!/usr/bin/env node
/* Vorschaubilder für geteilte Links (og/*.png, 1200 × 630 px) erzeugen.

   Kicker, Titel und die Lage der Sonne kommen aus der jeweiligen Seite,
   Schrift, Farben und Horizont aus styles.css. Ändert sich ein Titel oder
   eine Farbe, genügt ein neuer Durchlauf, und Vorschau und Seite stimmen
   wieder überein. og/neutral.png zeigt nur Logo und Horizont.

   Aufruf aus dem Ordner neuzeit-prototyp:

       node tools/og.mjs

   Braucht Playwright mit Chromium (einmalig: npm install playwright und
   npx playwright install chromium). Liegt Playwright woanders, den Pfad in
   PLAYWRIGHT_MODULE angeben. Danach python3 tools/sync.py ausführen, falls
   sich ein Titel geändert hat: Der Alternativtext steht in OG_SAETZE. */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORDNER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const BILDER = [
  { name: "start", seite: "index.html", titel: ".hero__words", sonne: "76%" },
  { name: "leistungen", seite: "leistungen.html" },
  { name: "ueber-uns", seite: "ueber-uns.html" },
  { name: "kontakt", seite: "kontakt.html" },
  { name: "neutral" },
];

let chromium;
try {
  ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright"));
} catch {
  console.error("Playwright fehlt: npm install playwright && npx playwright install chromium");
  process.exit(1);
}

/* kleiner Server, damit Schriften und Stile wie auf der Website laden */
const TYPEN = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const server = http.createServer((anfrage, antwort) => {
  let datei;
  try {
    datei = path.join(ORDNER, decodeURIComponent(new URL(anfrage.url, "http://x").pathname));
  } catch {
    datei = "";
  }
  const relativ = path.relative(ORDNER, datei);
  if (!datei || relativ.startsWith("..") || path.isAbsolute(relativ) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) {
    antwort.writeHead(404).end();
    return;
  }
  antwort.writeHead(200, { "Content-Type": TYPEN[path.extname(datei)] || "application/octet-stream" });
  fs.createReadStream(datei).pipe(antwort);
});
await new Promise((fertig) => server.listen(0, "127.0.0.1", fertig));
const basis = `http://127.0.0.1:${server.address().port}/`;

/* Sätze aus tools/sync.py, nur zum Abgleich mit dem Alternativtext */
const sync = fs.readFileSync(path.join(ORDNER, "tools/sync.py"), "utf8");
const block = sync.slice(sync.indexOf("OG_SAETZE = {"));
const saetze = Object.fromEntries([...block.slice(0, block.indexOf("}")).matchAll(/"([\w-]+)":\s*"([^"]*)"/g)].map((m) => [m[1], m[2]]));

const logo = fs.readFileSync(path.join(ORDNER, "_partials/logo-kopf.svg"), "utf8");
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
let warnungen = 0;

for (const bild of BILDER) {
  let daten = { kicker: "", titel: "", text: "", sonne: bild.sonne || "" };
  if (bild.seite) {
    await seite.goto(basis + bild.seite);
    daten = await seite.evaluate(({ titel, sonne }) => {
      const h1 = document.querySelector(titel || ".page-head__title");
      const horizont = document.querySelector(".page-head__horizon");
      return {
        kicker: document.querySelector("main .kicker").textContent.trim(),
        titel: h1.innerHTML,
        text: (document.querySelector("h1 .visually-hidden") || h1).textContent.replace(/\s+/g, " ").trim(),
        sonne: sonne || (horizont && horizont.style.getPropertyValue("--sun-x").trim()) || "70%",
      };
    }, { titel: bild.titel, sonne: bild.sonne });
    if (saetze[bild.name] !== daten.text) {
      warnungen++;
      console.warn(`Achtung ${bild.name}: Titel „${daten.text}“, in OG_SAETZE steht „${saetze[bild.name]}“`);
    }
  }

  await seite.goto(basis + "tools/og.html");
  await seite.evaluate(({ daten, neutral, logo }) => {
    const og = document.querySelector("[data-og]");
    og.classList.toggle("og--neutral", neutral);
    og.querySelector("[data-logo]").innerHTML = logo;
    og.querySelector("[data-kicker]").textContent = daten.kicker;
    og.querySelector("[data-titel]").innerHTML = daten.titel;
    og.querySelector(".page-head__horizon").style.setProperty("--sun-x", daten.sonne);
  }, { daten, neutral: !bild.seite, logo });
  await seite.evaluate(() => document.fonts.ready);

  /* Der Titel darf die Sonne nicht berühren: notfalls kleiner setzen */
  await seite.evaluate(() => {
    const titel = document.querySelector("[data-titel]");
    const sonne = document.querySelector(".page-head__sun").getBoundingClientRect();
    let groesse = parseFloat(getComputedStyle(titel).fontSize);
    const stoesst = () => {
      const r = titel.getBoundingClientRect();
      return r.bottom > sonne.top - 24 && r.left < sonne.right && r.right > sonne.left;
    };
    while (titel.textContent && stoesst() && groesse > 56) {
      groesse -= 4;
      titel.style.fontSize = groesse + "px";
    }
    /* Chromium setzt Inline-Blöcke (.ln) nach dem Verkleinern nicht immer neu:
       Inhalt einmal frisch einsetzen */
    titel.innerHTML = titel.innerHTML;
  });

  await seite.screenshot({ path: path.join(ORDNER, "og", bild.name + ".png") });
  console.log("erzeugt: og/" + bild.name + ".png");
}

await browser.close();
server.close();
if (warnungen) process.exitCode = 1;
