import type { Metadata, Viewport } from "next";
import { Montserrat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RefractionField } from "@/components/visual/RefractionField";
import { indexable } from "@/config/seo";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALES, OG_LOCALE } from "@/lib/i18n/locales";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/seo";
import "../globals.css";

// Heavy geometric sans for headlines (the voice of the label type); clean sans for body and UI;
// serif italic only for the single headline accent. All cover Vietnamese.
const display = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-display-face",
  display: "swap",
});
const accent = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-accent-face",
  display: "swap",
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-body-face",
  display: "swap",
});

type LayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };

// Only /vi and /en exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: `%s | ${site.name}` },
    description: meta.description,
    applicationName: site.name,
    alternates: { canonical: absoluteUrl(localePath(locale)), languages: languageAlternates() },
    openGraph: {
      type: "website",
      siteName: site.fullName,
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(localePath(locale)),
      locale: OG_LOCALE[locale],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    robots: { index: indexable, follow: indexable },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf4", // paper (label cream)
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${display.variable} ${accent.variable} ${body.variable}`}>
      <body className="relative isolate flex min-h-dvh flex-col overflow-x-clip">
        <RefractionField />
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
