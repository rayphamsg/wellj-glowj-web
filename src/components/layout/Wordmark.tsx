import { site } from "@/content/site";

/**
 * Typographic wordmark with the signature coral J.
 * PLACEHOLDER LOGO: replace with the approved logo asset when provided.
 */
export function Wordmark({ className }: { className?: string }) {
  const lead = site.name.slice(0, -1);
  const initial = site.name.slice(-1);
  return (
    <span className={className} aria-label={site.name}>
      <span aria-hidden="true" className="font-display text-2xl font-medium tracking-tight">
        {lead}
        <span className="text-glow-strong">{initial}</span>
      </span>
    </span>
  );
}
