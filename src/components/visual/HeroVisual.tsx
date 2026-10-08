import Image from "next/image";
import type { CSSProperties } from "react";

const DROPLET_SRC = "/images/glowj-droplet.webp";

/**
 * Hero visual: the OFFICIAL GlowJ droplet (brand-assets/official), shown
 * unaltered, as the primary brand device. It is never redrawn, distorted or
 * recoloured. The hydration feeling is built AROUND it, with light and water:
 * clear cool light behind, a refracted band of light and a drifting caustic
 * clipped to the droplet's own silhouette, soft depth shading, a rippled
 * reflection in clear water, slow ripples, and a restrained coral glow.
 *
 * No bottle or packaging appears here (Stage 1). Decorative effects are
 * aria-hidden; the droplet carries no alt text because the logo names the brand.
 */
export function HeroVisual() {
  return (
    <div className="relative isolate w-full" style={{ "--droplet": `url(${DROPLET_SRC})` } as CSSProperties}>
      {/* Water ripple distortion for the reflection (static when reduced motion is requested) */}
      <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
        <defs>
          <filter id="glow-water" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.010 0.07" numOctaves="2" seed="4" result="noise">
              <animate attributeName="baseFrequency" dur="18s" values="0.010 0.07;0.016 0.1;0.010 0.07" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Clear, cool light behind: freshness, and contrast for the translucent body */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[44%] -z-10 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 [background:radial-gradient(closest-side,var(--color-clear),transparent)]"
      />

      {/* The official droplet + light that lives inside its silhouette */}
      <div className="motion-float relative">
        <Image
          src={DROPLET_SRC}
          alt=""
          width={1000}
          height={1259}
          priority
          unoptimized
          className="h-auto w-full [filter:drop-shadow(0_0_1px_rgb(255_255_255/0.9))_drop-shadow(0_26px_34px_rgb(239_70_80/0.2))]"
        />
        {/* Depth: light from the upper left, deeper toward the lower right */}
        <div
          aria-hidden="true"
          className="droplet-fx absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 24% 22%, rgb(255 255 255 / 0.32), transparent 60%), radial-gradient(90% 80% at 88% 96%, rgb(110 12 28 / 0.28), transparent 62%)",
          }}
        />
        {/* Refracted light passing slowly through the liquid body */}
        <div
          aria-hidden="true"
          className="droplet-fx droplet-refract absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(104deg, transparent 38%, rgb(226 244 249 / 0.7) 50%, transparent 62%)",
            backgroundPosition: "100% 0",
            backgroundSize: "300% 100%",
          }}
        />
        {/* Light pooling at the base */}
        <div aria-hidden="true" className="droplet-fx absolute inset-0 overflow-hidden">
          <div className="droplet-caustic absolute bottom-[3%] left-[12%] h-[11%] w-[76%] rounded-[50%] [background:radial-gradient(closest-side,rgb(255_246_230/0.85),transparent)]" />
        </div>
        {/* A soft glint on the upper-left shoulder */}
        <div
          aria-hidden="true"
          className="droplet-fx absolute inset-0"
          style={{ background: "radial-gradient(9% 7% at 24% 40%, rgb(255 255 255 / 0.55), transparent 100%)" }}
        />
      </div>

      {/* Clear water beneath: reflection, ripples, soft shadow and coral light */}
      <div aria-hidden="true" className="relative mt-[1.5%] aspect-[100/24] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={DROPLET_SRC}
            alt=""
            width={1000}
            height={1259}
            unoptimized
            className="droplet-reflection absolute left-0 top-0 h-auto w-full"
          />
        </div>
        <svg focusable="false" viewBox="0 0 100 24" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <ellipse cx="50" cy="2.5" rx="30" ry="2" fill="#35192b" opacity="0.16" />
          <ellipse cx="54" cy="3" rx="24" ry="1.8" fill="#ef4650" opacity="0.3" />
          <g fill="none" stroke="#ffffff" strokeWidth="0.45">
            {[0, 3, 6].map((d) => (
              <ellipse key={d} className="motion-ripple" cx="50" cy="3.5" rx="40" ry="3.6" opacity="0" style={{ animationDelay: `-${d}s` }} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
