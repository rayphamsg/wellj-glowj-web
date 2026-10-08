import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/sections/SignupForm";
import { Container } from "@/components/ui/Container";
import { GlowDroplet } from "@/components/visual/GlowDroplet";
import { isEnabled } from "@/config/features";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

/** Staggers the slow reveal: later elements start a little after earlier ones. */
const order = (n: number) => ({ "--reveal-order": n }) as CSSProperties;

/** Splits the headline so the accent can be set in the italic display face. */
function splitHeadline(headline: string, accent: string) {
  const at = headline.indexOf(accent);
  if (at < 0) return { before: headline, accent: "", after: "" };
  return { before: headline.slice(0, at), accent, after: headline.slice(at + accent.length) };
}

/**
 * Stage 1 Coming Soon. One focused hero: eyebrow, headline, short support, and
 * the Zalo signup. Mobile first (droplet above copy); two columns from lg.
 * The droplet is abstract brand artwork, not a product image.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home, signup } = getDictionary(locale);
  const headline = splitHeadline(home.headline, home.headlineAccent);

  return (
    <section>
      <Container className="grid items-center gap-6 pb-16 pt-2 lg:min-h-[calc(100dvh-8rem)] lg:grid-cols-12 lg:gap-10 lg:py-10">
        <div className="motion-reveal order-1 mx-auto w-44 sm:w-56 lg:order-2 lg:col-span-5 lg:w-full lg:max-w-md" style={order(0)}>
          <GlowDroplet className="h-auto w-full overflow-visible" />
        </div>

        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="motion-reveal flex items-center gap-3 text-eyebrow font-semibold uppercase text-brand-strong" style={order(1)}>
            <span aria-hidden="true" className="h-px w-8 bg-brand-strong" />
            {home.eyebrow}
          </p>

          <h1 className="motion-reveal mt-5 max-w-3xl text-balance font-display text-display font-light" style={order(2)}>
            {headline.before}
            {headline.accent && <em className="font-normal italic text-glow-strong">{headline.accent}</em>}
            {headline.after}
          </h1>

          <div className="motion-reveal mt-6 max-w-xl space-y-3" style={order(3)}>
            <p className="font-display text-lead italic text-ink">{home.support.moments.join(" ")}</p>
            <p className="text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed">{home.support.body}</p>
          </div>

          {isEnabled("waitlist") && (
            <div className="motion-reveal surface-glass mt-8 max-w-xl rounded-card p-5 sm:p-6" style={order(4)}>
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                {home.category}
              </p>
              <SignupForm channel="zalo" locale={locale} placement="hero" {...signup} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
