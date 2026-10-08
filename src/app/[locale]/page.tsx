import { notFound } from "next/navigation";
import { FillLine } from "@/components/fill/FillLine";
import { Headline } from "@/components/fill/Headline";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SignupForm } from "@/components/sections/SignupForm";
import { isEnabled } from "@/config/features";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

/**
 * Stage 1 Coming Soon: "The Fill Line" (docs/DESIGN_SYSTEM.md).
 * Air above (type), coral liquid below (form, moments, body), and the official
 * droplet crossing the surface. Order of the DOM is the reading order.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home, signup } = getDictionary(locale);

  return (
    <div className="stage">
      <Header locale={locale} />

      <main id="main">
        {/* AIR */}
        <div className="air-zone">
          <div className="wrap">
            <p className="flex items-center text-[13px] font-semibold uppercase tracking-[0.2em]">
              <span aria-hidden="true" className="mr-3 inline-block h-[2px] w-6 bg-ink" />
              {home.eyebrow}
            </p>

            <div className="mt-4 lg:max-w-[820px]">
              <Headline headline={home.headline} accent={home.headlineAccent} lines={home.headlineLines} />
            </div>

            {/* The category is the product definition: it sits with the headline, in the air. */}
            <p className="mt-6 flex max-w-[66%] flex-col items-start gap-2 text-[17px] font-bold leading-snug md:max-w-[56%] md:flex-row md:items-center md:gap-3 md:text-[19px] lg:mt-8 lg:max-w-none lg:text-[22px]">
              <span aria-hidden="true" className="h-[3px] w-10 shrink-0 bg-ink" />
              {home.category}
            </p>
          </div>
        </div>

        {/* LIQUID: everything below the fill line is ink on coral */}
        <div className="liquid">
          <FillLine />

          <div className="liquid-content wrap">
            <div className="md:max-w-[58%] lg:max-w-[600px]">
              {isEnabled("waitlist") && <SignupForm channel="zalo" locale={locale} placement="hero" {...signup} />}

              <p className="mt-10 text-[19px] font-semibold leading-[1.3] lg:text-[22px]">
                {home.support.moments.map((moment) => (
                  <span key={moment} className="block">
                    {moment}
                  </span>
                ))}
              </p>

              <p className="mt-6 max-w-[46ch] text-base font-medium leading-[1.55] lg:text-lg">{home.support.body}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
