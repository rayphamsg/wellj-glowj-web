/**
 * Clean, luminous light behind the page: clear cool water light where the
 * light comes from, faint slow shafts of light, a restrained coral glow low on
 * the right and a little champagne warmth. Cream stays the dominant field.
 * Decorative only (aria-hidden). Pure CSS, slow drift.
 */
export function RefractionField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="motion-drift absolute -left-[20%] -top-[25%] size-[85vmax] rounded-full opacity-95 blur-3xl [background:radial-gradient(closest-side,var(--color-clear),transparent)] lg:size-[65vmax]"
        style={{ animationDuration: "30s" }}
      />
      <div
        className="motion-drift absolute -top-[10%] right-[18%] h-[95%] w-24 -rotate-[16deg] opacity-60 blur-2xl [background:linear-gradient(to_bottom,var(--color-clear),transparent)] lg:w-32"
        style={{ animationDuration: "36s", animationDelay: "-6s" }}
      />
      <div
        className="motion-drift absolute -bottom-[10%] -right-[25%] size-[70vmax] rounded-full opacity-30 blur-3xl [background:radial-gradient(closest-side,var(--color-glow),transparent)] lg:-right-[8%] lg:size-[48vmax]"
        style={{ animationDuration: "34s", animationDelay: "-11s" }}
      />
      <div
        className="motion-drift absolute -bottom-[25%] -left-[20%] size-[60vmax] rounded-full opacity-45 blur-3xl [background:radial-gradient(closest-side,var(--color-champagne),transparent)]"
        style={{ animationDuration: "40s", animationDelay: "-19s" }}
      />
    </div>
  );
}
