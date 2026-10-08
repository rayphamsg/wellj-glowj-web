import { site } from "@/content/site";
import { GLOW_BOUNDS, GLOW_PATH, J_BOUNDS, J_PATH } from "@/components/brand/logo-paths";

/**
 * GlowJ logo: the "glow" wordmark and coral J, vectorised from the official
 * label artwork (not redrawn). The label stacks "glow" over the J; this is the
 * inline arrangement for a header, with the J set to the wordmark's ascender
 * height. Replace with the official horizontal lockup if one is supplied.
 */
const SCALE = (GLOW_BOUNDS.baseline - GLOW_BOUNDS.top) / (J_BOUNDS.y1 - J_BOUNDS.y0);
const J_LEFT = GLOW_BOUNDS.x1 + 12;
const J_TRANSFORM = `translate(${J_LEFT - J_BOUNDS.x0 * SCALE} ${GLOW_BOUNDS.top - J_BOUNDS.y0 * SCALE}) scale(${SCALE})`;
const VIEW_BOX = `${GLOW_BOUNDS.x0 - 3} ${GLOW_BOUNDS.top - 4} ${J_LEFT + (J_BOUNDS.x1 - J_BOUNDS.x0) * SCALE - GLOW_BOUNDS.x0 + 6} ${149 - GLOW_BOUNDS.top + 8}`;

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox={VIEW_BOX} role="img" aria-label={site.name} className={className}>
      <path d={GLOW_PATH} fill="var(--color-wordmark)" fillRule="evenodd" />
      <path d={J_PATH} fill="var(--color-brand)" fillRule="evenodd" transform={J_TRANSFORM} />
    </svg>
  );
}
