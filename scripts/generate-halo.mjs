// Generates the halftone halo (docs/DESIGN_SYSTEM.md §7) as two static SVGs:
//   public/images/glowj-halo.svg       the halo
//   public/images/glowj-halo-ring.svg  one extra ring, revealed after a signup
//
// Print logic, not particles: dots sit on the official droplet's own staggered
// lattice (same pitch, same phase), are all official coral, and shrink with
// distance from the droplet. Nothing is random. Units: droplet width = 1000.
//
// Run: node scripts/generate-halo.mjs   (output is committed; the build never runs this)
import { writeFileSync } from "node:fs";

const H = 1259; // droplet height in the same units
const LINE = 0.58 * H; // fill line, in droplet units from its top
const PITCH = 40.8; // official droplet halftone: horizontal pitch
const ROW = 20.05; // official droplet halftone: row spacing (staggered, half-pitch offset)
const ORIGIN = [519.6, 814.0]; // a real dot of the official droplet (lattice phase)
const R0 = 5.3; // official dot radius
const CENTER = [500, 0.37 * H]; // the droplet's dry upper part
const D0 = 470; // dots keep full size out to here (about the droplet's own radius)
const RMAX = 0.75 * H; // halo radius (spec: 0.75 x droplet height)
const RING_R = RMAX + 2 * PITCH; // the signup ring sits just outside the halo
const MIN_X = -250; // the halo never reaches into the text column: nothing further than 0.25 droplet-widths left of the droplet

// Silhouette of the official droplet (convex outline measured from its alpha).
const OUTLINE = [
  [494, 25], [479, 46], [394, 131], [330, 215], [256, 299], [183, 383], [118, 467], [73, 551], [42, 635],
  [26, 747], [32, 860], [59, 944], [88, 1000], [144, 1084], [255, 1168], [398, 1224], [599, 1224],
  [744, 1168], [850, 1084], [914, 1000], [951, 916], [971, 832], [976, 747], [958, 635], [930, 551],
  [883, 467], [817, 383], [745, 299], [672, 215], [606, 131], [514, 46],
];

function inside(poly, x, y, margin) {
  // Point in polygon, expanded by a margin by testing a ring of offsets.
  const test = (px, py) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  if (test(x, y)) return true;
  for (let a = 0; a < 8; a++) {
    if (test(x + margin * Math.cos((a * Math.PI) / 4), y + margin * Math.sin((a * Math.PI) / 4))) return true;
  }
  return false;
}

const half = PITCH / 2;
const x0 = CENTER[0] - RING_R;
const y0 = CENTER[1] - RING_R;
const vbW = 2 * RING_R;
const vbH = LINE - y0;

const halo = new Map(); // quantised radius -> [points]
const ring = [];
const rows = Math.ceil(RING_R / ROW) + 2;

for (let j = -rows - 20; j <= rows + 40; j++) {
  const y = ORIGIN[1] + j * ROW;
  if (y < y0 || y > LINE - R0) continue;
  const parity = ((j % 2) + 2) % 2;
  const startX = ORIGIN[0] + parity * half;
  const kMin = Math.floor((x0 - startX) / PITCH) - 1;
  const kMax = Math.ceil((x0 + vbW - startX) / PITCH) + 1;
  for (let k = kMin; k <= kMax; k++) {
    const x = startX + k * PITCH;
    const d = Math.hypot(x - CENTER[0], y - CENTER[1]);
    if (d > RING_R || x < MIN_X || inside(OUTLINE, x, y, 14)) continue;
    if (d <= RMAX) {
      const t = Math.min(1, Math.max(0, (d - D0) / (RMAX - D0)));
      const r = R0 * Math.pow(1 - t, 2);
      if (r < 1.0) continue;
      const q = Math.round(r / 0.4) * 0.4;
      if (!halo.has(q)) halo.set(q, []);
      halo.get(q).push([x, y]);
    } else {
      ring.push([x, y]);
    }
  }
}

const f = (n) => Number(n.toFixed(1));
function svg(groups) {
  const paths = groups
    .map(([r, pts]) => {
      const d = pts.map(([x, y]) => `M${f(x)} ${f(y)}h0`).join("");
      return `<path d="${d}" stroke-width="${f(2 * r)}"/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${f(vbW)}" height="${f(vbH)}" viewBox="${f(x0)} ${f(y0)} ${f(vbW)} ${f(vbH)}" ` +
    `fill="none" stroke="#EF4650" stroke-linecap="round">${paths}</svg>\n`
  );
}

writeFileSync("public/images/glowj-halo.svg", svg([...halo.entries()].sort((a, b) => a[0] - b[0])));
writeFileSync("public/images/glowj-halo-ring.svg", svg([[R0 * 0.45, ring]]));
const dots = [...halo.values()].reduce((n, p) => n + p.length, 0);
console.log(`halo: ${dots} dots in ${halo.size} sizes, ring: ${ring.length} dots`);
console.log(`viewBox ${f(x0)} ${f(y0)} ${f(vbW)} ${f(vbH)}  (CSS: left ${f(x0 / 1000)}, top ${f(y0 / 1000)}, width ${f(vbW / 1000)} x droplet width)`);
