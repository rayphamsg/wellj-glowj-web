/**
 * Soft diffusion of coral, champagne and blush light behind the hero.
 * Decorative only (aria-hidden). Pure CSS: slow drift, no JavaScript.
 * Colours come from tokens; blobs are blurred so nothing reads as a hard shape.
 */
export function RefractionField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="motion-drift absolute -right-[25%] -top-[18%] size-[85vmax] rounded-full opacity-40 blur-3xl [background:radial-gradient(closest-side,var(--color-glow),transparent)] lg:-right-[10%] lg:size-[60vmax]"
        style={{ animationDuration: "26s" }}
      />
      <div
        className="motion-drift absolute -bottom-[30%] -left-[30%] size-[80vmax] rounded-full opacity-60 blur-3xl [background:radial-gradient(closest-side,var(--color-champagne),transparent)] lg:size-[55vmax]"
        style={{ animationDuration: "32s", animationDelay: "-9s" }}
      />
      <div
        className="motion-drift absolute left-[10%] top-[30%] size-[50vmax] rounded-full opacity-30 blur-3xl [background:radial-gradient(closest-side,var(--color-blush),transparent)] lg:left-[30%]"
        style={{ animationDuration: "38s", animationDelay: "-17s" }}
      />
    </div>
  );
}
