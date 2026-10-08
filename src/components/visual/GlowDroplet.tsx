import { J_PATH } from "@/components/brand/logo-paths";

/**
 * The GlowJ droplet, as on the product label, adapted for the screen.
 *
 * Geometry is the label's, in label coordinates (measured, not redrawn): a
 * round bead (centre 177,475, r 142) whose top tucks under the J with a cream
 * gap; three coral nodes with white rings (two high, one low); the same 13
 * white edge lines; a staggered halftone dot grid; peach-to-coral gradient.
 *
 * Digital adaptation (the symbol itself does not change): water-like
 * translucency and depth, a rim of light, refracted caustic, halftone dots
 * that catch a slow band of light, light travelling along the lines between
 * the nodes, breathing nodes, a few condensation beads, and a bead forming at
 * the base that drops onto a clear surface. Slow and reduced-motion safe.
 *
 * The lower hook of the J is drawn above, flat in the label coral and fading
 * upward, so the bead keeps its relationship to the J exactly as on the label.
 * Decorative (aria-hidden).
 */
const CX = 177;
const CY = 475;
const R = 142;

const A = [98, 400.8] as const;
const B = [256, 400.8] as const;
const C = [177, 552] as const;

const LINES: Array<{ d: string; delay: string }> = [
  { d: `M${A} L${B}`, delay: "0s" },
  { d: `M${A} L${C}`, delay: "1.2s" },
  { d: `M${B} L${C}`, delay: "2.4s" },
  { d: `M${A} L125 348`, delay: "3.6s" },
  { d: `M${A} L66 378`, delay: "4.8s" },
  { d: `M${B} L229 348`, delay: "6s" },
  { d: `M${B} L288 378`, delay: "7.2s" },
  { d: `M${A} L48 538`, delay: "1.8s" },
  { d: `M${B} L306 538`, delay: "3s" },
  { d: `M48 538 L${C}`, delay: "4.2s" },
  { d: `M306 538 L${C}`, delay: "5.4s" },
  { d: `M${C} L98 594`, delay: "6.6s" },
  { d: `M${C} L256 594`, delay: "7.8s" },
];

const BEADS: Array<[number, number, number]> = [
  [86, 436, 4.2],
  [120, 372, 3],
  [74, 488, 2.6],
  [231, 372, 3.4],
  [268, 452, 2.8],
  [150, 436, 2.2],
];

const SURFACE_Y = 672;

export function GlowDroplet({ className }: { className?: string }) {
  return (
    <svg viewBox="20 226 314 474" role="presentation" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <clipPath id="gd-circle">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
        {/* The J's underside cuts a cream gap into the top of the bead, as on the label */}
        <mask id="gd-gap" maskUnits="userSpaceOnUse" x="0" y="300" width="360" height="400">
          <rect x="0" y="300" width="360" height="400" fill="#fff" />
          <path d={J_PATH} fill="#000" stroke="#000" strokeWidth="13" strokeLinejoin="round" fillRule="evenodd" />
        </mask>
        {/* Water body: clear and light at the top, deep coral below */}
        <linearGradient id="gd-body" x1="0" y1="333" x2="0" y2="617" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff3ea" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#fcc6b6" stopOpacity="0.78" />
          <stop offset="0.65" stopColor="#f78d7e" stopOpacity="0.92" />
          <stop offset="1" stopColor="#ec5a52" stopOpacity="0.98" />
        </linearGradient>
        {/* Depth: light from upper left, deeper toward lower right */}
        <radialGradient id="gd-depth" cx="130" cy="415" r="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#8d231f" stopOpacity="0.34" />
        </radialGradient>
        <linearGradient id="gd-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
        {/* Halftone: staggered dots, as printed */}
        <pattern id="gd-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.85" fill="#8f3224" />
          <circle cx="9" cy="9" r="1.85" fill="#8f3224" />
        </pattern>
        <pattern id="gd-dots-lit" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#fffaf0" />
          <circle cx="9" cy="9" r="2" fill="#fffaf0" />
        </pattern>
        <linearGradient id="gd-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="gd-shimmer" maskUnits="userSpaceOnUse" x="20" y="322" width="314" height="320">
          <g transform="rotate(20 177 475)">
            <g className="motion-shimmer">
              <rect x="-170" y="300" width="130" height="380" fill="url(#gd-band)" />
            </g>
          </g>
        </mask>
        <linearGradient id="gd-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcc6b6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f46a60" stopOpacity="0.98" />
        </linearGradient>
        <linearGradient id="gd-j-fade" x1="0" y1="226" x2="0" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="gd-j-mask" maskUnits="userSpaceOnUse" x="0" y="210" width="360" height="160">
          <rect x="0" y="210" width="360" height="160" fill="url(#gd-j-fade)" />
        </mask>
        <filter id="gd-blur" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="gd-blur-sm" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Clear surface beneath: shadow, cast coral light, one slow ripple at a time */}
      <ellipse cx="170" cy={SURFACE_Y} rx="104" ry="9" fill="#35192b" opacity="0.2" filter="url(#gd-blur)" />
      <ellipse cx="200" cy={SURFACE_Y + 2} rx="84" ry="8" fill="#f46a60" opacity="0.5" filter="url(#gd-blur)" />
      <g fill="none" stroke="#ffffff" strokeWidth="1.6">
        <ellipse className="motion-surface-ripple" cx={CX} cy={SURFACE_Y} rx="96" ry="9" opacity="0" />
        <ellipse className="motion-surface-ripple" cx={CX} cy={SURFACE_Y} rx="96" ry="9" opacity="0" style={{ animationDelay: "0.6s" }} />
      </g>

      {/* A bead forms at the base and drops to the surface */}
      <g className="motion-drip">
        <path
          d={`M${CX} 618 C${CX - 1} 621 ${CX - 8} 631 ${CX - 8} 638 C${CX - 8} 644 ${CX - 4} 648 ${CX} 648 C${CX + 4} 648 ${CX + 8} 644 ${CX + 8} 638 C${CX + 8} 631 ${CX + 1} 621 ${CX} 618 Z`}
          fill="url(#gd-drop)"
          stroke="#ffffff"
          strokeWidth="1.4"
        />
        <ellipse cx={CX - 3} cy="637" rx="1.6" ry="3.4" fill="#ffffff" opacity="0.85" />
      </g>

      <g className="motion-float">
        {/* The J's lower hook, as on the label */}
        <g mask="url(#gd-j-mask)">
          <path d={J_PATH} fill="var(--color-brand)" fillRule="evenodd" />
        </g>
        <g mask="url(#gd-gap)">
          <g clipPath="url(#gd-circle)">
            {/* Body, halftone and depth */}
            <circle cx={CX} cy={CY} r={R} fill="url(#gd-body)" />
            <rect x="20" y="322" width="314" height="320" fill="url(#gd-dots)" opacity="0.4" />
            <rect x="20" y="322" width="314" height="320" fill="url(#gd-dots-lit)" mask="url(#gd-shimmer)" opacity="0.95" />
            <circle cx={CX} cy={CY} r={R} fill="url(#gd-depth)" />

            {/* Refracted light pooling at the base, drifting slowly */}
            <g className="motion-sheen">
              <ellipse cx="190" cy="598" rx="56" ry="7" fill="#fff0cf" opacity="0.5" filter="url(#gd-blur-sm)" />
            </g>

            {/* The label's white line network */}
            <g fill="none" strokeLinecap="round">
              <g stroke="#ffffff" strokeOpacity="0.8" strokeWidth="4.8">
                {LINES.map((l) => (
                  <path key={l.d} d={l.d} />
                ))}
              </g>
              {/* Light travelling between the nodes */}
              <g stroke="#ffffff" strokeWidth="4.8">
                {LINES.map((l) => (
                  <path key={l.d} d={l.d} pathLength={100} className="motion-pulse" style={{ animationDelay: l.delay }} />
                ))}
              </g>
            </g>

            {/* Nodes */}
            {[A, B].map(([x, y]) => (
              <g key={x}>
                <circle className="motion-node" cx={x} cy={y} r="16" fill="#ffffff" opacity="0" />
                <circle cx={x} cy={y} r="13.4" fill="none" stroke="#ffffff" strokeWidth="5" />
                <circle cx={x} cy={y} r="11" fill="#f46a60" />
                <circle cx={x - 3} cy={y - 3.5} r="3" fill="#ffffff" opacity="0.45" />
              </g>
            ))}
            <g>
              <circle className="motion-node" cx={C[0]} cy={C[1]} r="18" fill="#ffffff" opacity="0" style={{ animationDelay: "-2s" }} />
              <circle cx={C[0]} cy={C[1]} r="15" fill="none" stroke="#ffffff" strokeWidth="5" />
              <circle cx={C[0]} cy={C[1]} r="12.5" fill="#f46a60" />
              <circle cx={C[0] - 3.5} cy={C[1] - 4} r="3.4" fill="#ffffff" opacity="0.45" />
            </g>
          </g>

          {/* Rim and specular light */}
          <circle cx={CX} cy={CY} r={R - 1} fill="none" stroke="url(#gd-rim)" strokeWidth="2.4" />
          <path d="M61 408 A134 134 0 0 1 114 357" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M268 568 A134 134 0 0 1 226 596" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.45" />
          <circle cx="130" cy="362" r="3" fill="#ffffff" opacity="0.9" />

          {/* Condensation: cold, fresh */}
          {BEADS.map(([x, y, r]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r={r} fill="#ffffff" fillOpacity="0.28" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="0.9" />
              <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#ffffff" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
