/**
 * Generates PWA icons for the Roadmap app.
 * Design: bold white "R" on teal (#00695C) background, orange (#F05A1A) underline accent.
 * Rounded corners at ~22% radius (112px on 512, 42px on 192).
 *
 * Run: node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "../public/icons");
mkdirSync(iconsDir, { recursive: true });

function buildSvg(size) {
  const rx = Math.round(size * 0.219);
  const fontSize = Math.round(size * 0.56);
  const cx = size / 2;
  const cy = size / 2;

  const accentW = Math.round(size * 0.313);
  const accentH = Math.round(size * 0.027);
  const accentX = cx - accentW / 2;
  const accentY = Math.round(cy + fontSize * 0.38);
  const accentRx = Math.round(accentH / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="#00695C"/>
  <text
    x="${cx}"
    y="${cy}"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="900"
    fill="#FFFFFF"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="-4"
  >R</text>
  <rect
    x="${accentX}"
    y="${accentY}"
    width="${accentW}"
    height="${accentH}"
    rx="${accentRx}"
    fill="#F05A1A"
  />
</svg>`;
}

async function generate(size, outFile) {
  const svg = buildSvg(size);
  const buf = await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(outFile, buf);
  console.log(`✓ ${outFile}  (${(buf.length / 1024).toFixed(1)} KB)`);
}

await generate(512, path.join(iconsDir, "icon-512.png"));
await generate(192, path.join(iconsDir, "icon-192.png"));

writeFileSync(path.join(iconsDir, "icon.svg"), buildSvg(512));
console.log("✓ icon.svg updated");
console.log("\nAll icons regenerated.");
