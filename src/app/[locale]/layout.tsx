import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { indexable } from "@/config/seo";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, LOCALES, OG_LOCALE } from "@/lib/i18n/locales";
import { absoluteUrl, languageAlternates, localePath } from "@/lib/seo";
import "../globals.css";

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
  themeColor: "#ffffff", // PENDING: brand colour
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col">
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer note={dictionary.footer.note} />
      </body>
    </html>
  );
}
