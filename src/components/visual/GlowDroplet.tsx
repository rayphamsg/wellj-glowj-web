/**
 * GlowJ brand device (concept): a faceted droplet, half gem and half water,
 * with refracted coral and champagne light and slow ripples beneath it.
 *
 * This is abstract artwork, NOT a product render and not a bottle. It stands in
 * until approved product photography exists. Decorative only (aria-hidden).
 * Motion classes are defined in globals.css and disabled for reduced motion.
 */
const DROP = "M200 30 C200 30 80 190 80 300 C80 372 133 424 200 424 C267 424 320 372 320 300 C320 190 200 30 200 30 Z";

type FacetProps = { points: string; fill: string; opacity: number };
const Facet = ({ points, fill, opacity }: FacetProps) => <polygon points={points} fill={fill} fillOpacity={opacity} />;

export function GlowDroplet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" role="presentation" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <clipPath id="glow-drop-clip">
          <path d={DROP} />
        </clipPath>
        <linearGradient id="glow-drop-body" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#f9d3c8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f27b68" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="glow-drop-core" cx="0.5" cy="0.78" r="0.5">
          <stop offset="0" stopColor="#f6a291" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f6a291" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="glow-drop-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffdf9" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f2ddb9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fffdf9" stopOpacity="0" />
        </linearGradient>
        <filter id="glow-drop-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <path id="glow-drop-mini" d="M0 -24 C0 -24 -17 0 -17 15 C-17 26 -9 34 0 34 C9 34 17 26 17 15 C17 0 0 -24 0 -24 Z" />
      </defs>

      {/* Ripples spreading from beneath the droplet */}
      <g fill="none" stroke="#f27b68" strokeWidth="1.25">
        {[0, 3, 6].map((delay) => (
          <ellipse
            key={delay}
            className="motion-ripple"
            cx="200"
            cy="452"
            rx="150"
            ry="20"
            opacity="0.35"
            style={{ animationDelay: `-${delay}s` }}
          />
        ))}
      </g>
      {/* Coral light cast onto the surface */}
      <ellipse cx="200" cy="452" rx="92" ry="12" fill="#f27b68" opacity="0.45" filter="url(#glow-drop-soft)" />

      <g className="motion-float">
        {/* Body */}
        <path d={DROP} fill="url(#glow-drop-body)" />
        <path d={DROP} fill="url(#glow-drop-core)" />

        {/* Gem facets, clipped to the droplet */}
        <g clipPath="url(#glow-drop-clip)">
          <Facet points="200,0 200,170 128,250 40,330 40,0" fill="#fffdf9" opacity={0.6} />
          <Facet points="200,0 360,0 360,330 272,250 200,170" fill="#f2ddb9" opacity={0.5} />
          <Facet points="128,250 200,170 200,340" fill="#fffdf9" opacity={0.22} />
          <Facet points="272,250 200,170 200,340" fill="#f9d3c8" opacity={0.4} />
          <Facet points="128,250 200,340 150,450 40,450 40,330" fill="#f6a291" opacity={0.42} />
          <Facet points="272,250 200,340 250,450 360,450 360,330" fill="#f27b68" opacity={0.55} />
          <Facet points="200,340 150,450 200,450" fill="#fffdf9" opacity={0.3} />
          <Facet points="200,340 250,450 200,450" fill="#d9503c" opacity={0.5} />
          {/* Refracted champagne light sweeping slowly across the facets */}
          <g className="motion-sheen">
            <polygon points="150,0 205,0 120,450 65,450" fill="url(#glow-drop-streak)" opacity="0.55" />
          </g>
        </g>

        {/* Facet edges: thin, luminous */}
        <g clipPath="url(#glow-drop-clip)" fill="none" stroke="#fffdf9" strokeOpacity="0.75" strokeWidth="1" strokeLinejoin="round">
          <path d="M200 30 L200 170 L128 250 L200 340 L272 250 L200 170" />
          <path d="M128 250 L40 330 M272 250 L360 330 M200 340 L150 450 M200 340 L250 450 M200 340 L200 450" />
        </g>

        {/* Rim + specular highlight */}
        <path d={DROP} fill="none" stroke="#fffdf9" strokeWidth="2" strokeOpacity="0.9" />
        <path d={DROP} fill="none" stroke="#f27b68" strokeWidth="0.75" strokeOpacity="0.5" />
        <path d="M112 262 C110 222 128 180 158 138" fill="none" stroke="#fffdf9" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="168" cy="118" r="4" fill="#fffdf9" opacity="0.95" />
      </g>

      {/* Small satellite droplets for depth */}
      <g className="motion-float" style={{ animationDelay: "-3s", animationDuration: "11s" }}>
        <use href="#glow-drop-mini" transform="translate(336 150) scale(0.9)" fill="#f9d3c8" fillOpacity="0.85" stroke="#fffdf9" strokeWidth="1.5" />
      </g>
      <g className="motion-float" style={{ animationDelay: "-6s", animationDuration: "13s" }}>
        <use href="#glow-drop-mini" transform="translate(60 230) scale(0.5)" fill="#f2ddb9" fillOpacity="0.9" stroke="#fffdf9" strokeWidth="2" />
      </g>
    </svg>
  );
}
