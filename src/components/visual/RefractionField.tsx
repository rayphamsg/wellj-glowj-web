/**
 * Clean, luminous light behind the page: a fresh pale liquid light (taken from
 * the drink's own colour) where the light comes from, a restrained coral glow that reads as light cast through the
 * liquid (not a blush wash), and a little champagne warmth. Cream stays the
 * dominant field. Decorative only (aria-hidden). Pure CSS, slow drift.
 */
export function RefractionField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="motion-drift absolute -left-[20%] -top-[25%] size-[85vmax] rounded-full opacity-60 blur-3xl [background:radial-gradient(closest-side,var(--color-liquid-deep),transparent)] lg:size-[65vmax]"
        style={{ animationDuration: "30s" }}
      />
      <div
        className="motion-drift absolute -bottom-[10%] -right-[25%] size-[70vmax] rounded-full opacity-35 blur-3xl [background:radial-gradient(closest-side,var(--color-glow),transparent)] lg:-right-[8%] lg:size-[48vmax]"
        style={{ animationDuration: "34s", animationDelay: "-11s" }}
      />
      <div
        className="motion-drift absolute -bottom-[25%] -left-[20%] size-[60vmax] rounded-full opacity-50 blur-3xl [background:radial-gradient(closest-side,var(--color-champagne),transparent)]"
        style={{ animationDuration: "40s", animationDelay: "-19s" }}
      />
    </div>
  );
}
