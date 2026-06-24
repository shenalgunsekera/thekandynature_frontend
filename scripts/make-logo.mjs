// Generates the "The Heights Retreat" wordmark as downloadable SVG + PNG files.
// Peaks-and-moon mark + a single-font serif wordmark (three words, "Heights"
// in amber). Two colour variants + a preview on the site's charcoal background.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "logo");

const logoSVG = ({ text, accent }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 200" width="2080" height="400">
  <g fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="miter">
    <path d="M24 150 L72 66 L104 110 L142 50 L190 150"/>
  </g>
  <circle cx="152" cy="38" r="11" fill="${accent}"/>
  <line x1="18" y1="150" x2="196" y2="150" stroke="${accent}" stroke-width="3" opacity="0.45"/>
  <text x="236" y="128" font-family="Georgia, 'Times New Roman', serif" font-size="80" letter-spacing="1" fill="${text}">The <tspan fill="${accent}">Heights</tspan> Retreat</text>
</svg>`;

const variants = {
  "on-dark": { text: "#f4f1ea", accent: "#e8b15a" },
  "on-light": { text: "#16221a", accent: "#c98f3a" },
};

await mkdir(OUT, { recursive: true });

for (const [name, v] of Object.entries(variants)) {
  const svg = logoSVG(v);
  await writeFile(path.join(OUT, `heights-retreat-${name}.svg`), svg, "utf8");
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, `heights-retreat-${name}.png`));
  console.log(`  ok  heights-retreat-${name}.svg + .png`);
}

const inner = logoSVG(variants["on-dark"]).replace(/<svg[^>]*>/, "").replace("</svg>", "");
const preview = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 280" width="2080" height="560">
  <rect width="1040" height="280" fill="#0c0d10"/>
  <g transform="translate(0,40)">${inner}</g>
</svg>`;
await sharp(Buffer.from(preview)).png().toFile(path.join(OUT, "heights-retreat-preview.png"));
console.log("  ok  heights-retreat-preview.png");
console.log("Done. Logo files in public/logo/");
