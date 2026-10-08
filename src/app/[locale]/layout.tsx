import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import { notFound } from "next/navigation";
import { indexable } from "@/config/seo";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALES, OG_LOCALE } from "@/lib/i18n/locales";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/seo";
import "../globals.css";

// Be Vietnam Pro for everything (drawn for Vietnamese; stacked diacritics stay clean):
// Bold (700) headline and labels, SemiBold moments, Medium body, Regular consent.
const body = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-face",
  display: "swap",
});

// The ONE exception: Fraunces SemiBold Italic, used only for the headline's coral accent word
// ("tươi." / "Glow."). Beauty x hydration comes from the contrast with the bold sans.
const accent = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["600"],
  style: ["italic"],
  variable: "--font-accent-face",
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
  themeColor: "#f7faf9", // air (mineral white)
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${body.variable} ${accent.variable}`}>
      <body>{children}</body>
    </html>
  );
}
