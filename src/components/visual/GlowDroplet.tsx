/**
 * GlowJ brand device (concept): a droplet of liquid light. Faceted, but the
 * facets are soft and translucent so it reads as hydration with volume, not a
 * gemstone. Slightly asymmetric and leaning, with refracted light drifting
 * through it, ripples that travel to one side, and thin flow lines behind.
 *
 * Abstract artwork, NOT a product render and not a bottle. Stands in until
 * approved product photography exists. Decorative only (aria-hidden).
 * Motion classes live in globals.css and are disabled for reduced motion.
 */
const DROP = "M226 28 C214 62 96 196 92 306 C90 380 144 436 214 436 C290 436 346 384 340 304 C335 214 244 70 226 28 Z";

type FacetProps = { points: string; fill: string; opacity: number };
const Facet = ({ points, fill, opacity }: FacetProps) => <polygon points={points} fill={fill} fillOpacity={opacity} />;

const STREAMS = [
  { d: "M-30 400 C120 360 260 410 490 270", duration: "19s", delay: "0s" },
  { d: "M-20 330 C130 300 270 340 480 200", duration: "23s", delay: "-8s" },
  { d: "M10 455 C160 432 300 456 470 366", duration: "17s", delay: "-4s" },
];

export function GlowDroplet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 520" role="presentation" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <clipPath id="gd-clip">
          <path d={DROP} />
        </clipPath>
        <linearGradient id="gd-body" x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#f9d3c8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f27b68" stopOpacity="0.68" />
        </linearGradient>
        {/* Volume: bright on the light side, deeper toward the far edge */}
        <linearGradient id="gd-volume" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fffdf9" stopOpacity="0" />
          <stop offset="1" stopColor="#b63a27" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="gd-inner" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6a291" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f6a291" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gd-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fffdf9" stopOpacity="0.9" />
          <stop offset="0.75" stopColor="#f2ddb9" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fffdf9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gd-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="1" />
          <stop offset="0.6" stopColor="#fffdf9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f27b68" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="gd-stream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2ddb9" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f6a291" stopOpacity="0.7" />
          <stop offset="1" stopColor="#f2ddb9" stopOpacity="0" />
        </linearGradient>
        <filter id="gd-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id="gd-facet-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <path id="gd-mini" d="M0 -24 C-2 -20 -18 2 -17 16 C-16 27 -8 34 1 34 C10 34 18 27 17 15 C16 2 2 -20 0 -24 Z" />
      </defs>

      {/* Thin flow lines: a slow current passing behind the droplet */}
      <g fill="none" stroke="url(#gd-stream)" strokeWidth="1.5" strokeLinecap="round">
        {STREAMS.map((s) => (
          <path key={s.d} d={s.d} pathLength={640} className="motion-stream" style={{ animationDuration: s.duration, animationDelay: s.delay }} />
        ))}
      </g>

      {/* Ripples, tilted and drifting to one side, with coral light on the surface */}
      <g transform="rotate(-5 232 466)">
        <g fill="none" stroke="#f27b68" strokeWidth="1.25">
          {[0, 2.7, 5.4].map((delay, i) => (
            <ellipse
              key={delay}
              className="motion-ripple"
              cx={232 + i * 6}
              cy="466"
              rx={150 - i * 14}
              ry={17 - i}
              opacity="0.35"
              style={{ animationDelay: `-${delay}s` }}
            />
          ))}
        </g>
        <ellipse cx="244" cy="466" rx="100" ry="12" fill="#f27b68" opacity="0.4" filter="url(#gd-soft)" />
      </g>

      <g className="motion-float">
        {/* Body: translucent, with volume */}
        <path d={DROP} fill="url(#gd-body)" />
        <path d={DROP} fill="url(#gd-volume)" />

        <g clipPath="url(#gd-clip)">
          {/* Inner glow shifting within the liquid */}
          <g className="motion-inner">
            <ellipse cx="196" cy="352" rx="130" ry="96" fill="url(#gd-inner)" />
          </g>

          {/* Soft, irregular facets: blurred so transitions melt into each other */}
          <g filter="url(#gd-facet-blur)">
            <Facet points="226,10 206,150 140,246 70,300 70,0" fill="#fffdf9" opacity={0.4} />
            <Facet points="226,10 360,300 300,240 246,150" fill="#f2ddb9" opacity={0.3} />
            <Facet points="206,150 246,150 300,240 252,262" fill="#f9d3c8" opacity={0.3} />
            <Facet points="140,246 252,262 214,350" fill="#fffdf9" opacity={0.14} />
            <Facet points="140,246 214,350 160,450 60,450 60,300" fill="#f6a291" opacity={0.38} />
            <Facet points="252,262 300,240 360,300 360,450 250,450 214,350" fill="#f27b68" opacity={0.42} />
            <Facet points="214,350 250,450 160,450" fill="#fffdf9" opacity={0.16} />
          </g>

          {/* Refracted light drifting diagonally through the volume */}
          <g className="motion-sheen">
            <path d="M80 332 C150 288 232 302 340 248 L356 288 C250 334 170 332 92 376 Z" fill="url(#gd-band)" opacity="0.55" />
            <path d="M118 412 C190 382 262 394 334 350 L338 364 C264 408 192 404 126 434 Z" fill="url(#gd-band)" opacity="0.4" />
          </g>
        </g>

        {/* Faint facet edges only; the volume does the work */}
        <g clipPath="url(#gd-clip)" fill="none" stroke="#fffdf9" strokeOpacity="0.4" strokeWidth="1" strokeLinejoin="round">
          <path d="M226 28 L206 150 L140 246 L214 350" />
          <path d="M206 150 L252 262 L300 240 M252 262 L214 350 L250 440" />
        </g>

        {/* Rim and specular light */}
        <path d={DROP} fill="none" stroke="url(#gd-rim)" strokeWidth="2.5" />
        <path d="M118 292 C112 242 134 190 178 140" fill="none" stroke="#fffdf9" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.85" />
        <path d="M306 384 C296 404 278 418 256 426" fill="none" stroke="#fffdf9" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.5" />
        <circle cx="186" cy="120" r="3.5" fill="#fffdf9" opacity="0.9" />
      </g>

      {/* Satellite droplets trail off in the direction of the flow */}
      <g className="motion-float" style={{ animationDelay: "-3s", animationDuration: "11s" }}>
        <use href="#gd-mini" transform="translate(378 166) rotate(-14) scale(0.8)" fill="#f9d3c8" fillOpacity="0.7" stroke="#fffdf9" strokeWidth="1.5" />
      </g>
      <g className="motion-float" style={{ animationDelay: "-6s", animationDuration: "13s" }}>
        <use href="#gd-mini" transform="translate(414 236) rotate(-18) scale(0.36)" fill="#f2ddb9" fillOpacity="0.85" stroke="#fffdf9" strokeWidth="2.5" />
      </g>
      <g className="motion-float" style={{ animationDelay: "-9s", animationDuration: "12s" }}>
        <use href="#gd-mini" transform="translate(64 262) rotate(-10) scale(0.42)" fill="#f2ddb9" fillOpacity="0.85" stroke="#fffdf9" strokeWidth="2.2" />
      </g>
    </svg>
  );
}
