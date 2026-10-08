import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/sections/SignupForm";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "@/components/visual/HeroVisual";
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
  const { home, signup, bottleAlt } = getDictionary(locale);
  const headline = splitHeadline(home.headline, home.headlineAccent);

  return (
    <section>
      <Container className="grid items-center gap-6 pb-16 pt-2 lg:min-h-[calc(100dvh-8rem)] lg:grid-cols-12 lg:gap-10 lg:py-10">
        <div className="motion-reveal order-1 mx-auto w-48 sm:w-60 lg:order-2 lg:col-span-5 lg:w-full lg:max-w-[25rem]" style={order(0)}>
          <HeroVisual bottleAlt={bottleAlt} />
        </div>

        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="motion-reveal flex items-center gap-3 text-eyebrow font-semibold uppercase text-brand-strong" style={order(1)}>
            <span aria-hidden="true" className="h-px w-8 bg-brand-strong" />
            {home.eyebrow}
          </p>

          <h1 className="motion-reveal mt-4 max-w-3xl text-balance font-display text-display font-extrabold" style={order(2)}>
            {headline.before}
            {headline.accent && <em className="font-accent font-medium italic text-glow-strong">{headline.accent}</em>}
            {headline.after}
          </h1>

          {/* Category is the product definition: part of the main hierarchy, not form helper text. */}
          <p
            className="motion-reveal mt-5 inline-flex items-center gap-2.5 rounded-full bg-plum py-2 pl-3.5 pr-4 text-base font-semibold text-paper sm:text-lg"
            style={order(3)}
          >
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
            {home.category}
          </p>

          <div className="motion-reveal mt-5 max-w-xl space-y-3" style={order(4)}>
            <p className="text-pretty text-lg font-normal text-ink sm:text-xl">{home.support.moments.join(" ")}</p>
            <p className="text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed">{home.support.body}</p>
          </div>

          {isEnabled("waitlist") && (
            <div className="motion-reveal surface-card mt-7 max-w-xl rounded-card p-4 sm:p-5" style={order(5)}>
              <SignupForm channel="zalo" locale={locale} placement="hero" {...signup} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
