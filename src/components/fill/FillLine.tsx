import Image from "next/image";

/**
 * The liquid and everything that crosses its surface (docs/DESIGN_SYSTEM.md §3-7).
 * Render inside `.liquid` (the element whose top edge is the fill line).
 *
 * Layers, bottom to top: coral field + capillary rise -> OFFICIAL droplet (with the
 * halftone halo behind it) -> liquid veil. The droplet image is never altered:
 * it is the official asset, unrecoloured, undistorted, static. The veil is the same
 * coral at 60%, below the surface only, so the submerged half is seen through the liquid.
 *
 * Decorative: all of it is hidden from assistive technology.
 */
export function FillLine() {
  return (
    <>
      <div aria-hidden="true" className="fill-field fill-motion" />

      {/* Capillary rise: the surface climbs the droplet's edges, like water against a surface */}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none" className="cap cap-l fill-motion">
        <path d="M0 57 C60 57 88 36 100 0 L100 100 L0 100 Z" fill="var(--color-coral)" />
      </svg>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none" className="cap cap-r fill-motion">
        <path d="M100 57 C40 57 12 36 0 0 L0 100 L100 100 Z" fill="var(--color-coral)" />
      </svg>

      <div aria-hidden="true" className="drop-box">
        {/* Print halo in the air above the surface; the signup ring is revealed after a successful signup */}
        <Image src="/images/glowj-halo.svg" alt="" width={2052} height={1290} unoptimized className="halo halo-in" />
        <Image src="/images/glowj-halo-ring.svg" alt="" width={2052} height={1290} unoptimized className="halo halo-ring" />
        <Image src="/images/glowj-droplet.webp" alt="" width={1000} height={1259} priority unoptimized className="drop-img" />
      </div>

      <div aria-hidden="true" className="fill-veil fill-motion" />
    </>
  );
}
