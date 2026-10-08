import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
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

// Editorial display serif for headlines; clean sans for body and UI. Both cover Vietnamese.
const display = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
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
  themeColor: "#fbf6ef", // paper (cream)
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
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
