// Nimmt film.html Bild für Bild mit Playwright auf und setzt das Video mit ffmpeg zusammen.
//   node render.mjs                      ganzer Film nach operation-jackpot.mp4
//   node render.mjs --bilder 12.5,80     nur Standbilder dieser Sekunden nach build/bilder/
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const HIER = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(HIER, "../..");  // Repo-Wurzel, damit die Schriften aus neuzeit-prototyp/fonts laden
const TYPEN = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".wav": "audio/wav" };

const server = createServer(async (req, res) => {
  const datei = path.join(WURZEL, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!datei.startsWith(WURZEL)) { res.writeHead(403).end(); return; }
  try {
    const inhalt = await readFile(datei);
    res.writeHead(200, { "content-type": TYPEN[path.extname(datei)] || "application/octet-stream" }).end(inhalt);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/spass/operation-jackpot/film.html?render`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", e => { console.error("Fehler im Film:", e.message); process.exitCode = 1; });
await page.goto(url);
await page.evaluate(() => window.bereit);
const { fps, dauer } = await page.evaluate(() => ({ fps: TIMELINE.fps, dauer: TIMELINE.dauer }));

const bild = t => page.evaluate(t => { renderFrame(t); return document.getElementById("c").toDataURL("image/jpeg", 0.93); }, t)
  .then(d => Buffer.from(d.split(",")[1], "base64"));

const arg = process.argv.indexOf("--bilder");
if (arg > 0) {
  await mkdir(path.join(HIER, "build/bilder"), { recursive: true });
  for (const t of process.argv[arg + 1].split(",").map(Number)) {
    await writeFile(path.join(HIER, `build/bilder/t${t.toFixed(2)}.jpg`), await bild(t));
  }
} else {
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-i", path.join(HIER, "build/ton.wav"), "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", path.join(HIER, "operation-jackpot.mp4")],
    { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.ceil(dauer * fps);
  for (let i = 0; i < n; i++) {
    const daten = await bild(i / fps);
    if (!ff.stdin.write(daten)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % (fps * 10) === 0) console.log(`${(i / fps).toFixed(0)} s von ${dauer.toFixed(0)} s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  console.log("Fertig: operation-jackpot.mp4");
}
await browser.close();
server.close();
