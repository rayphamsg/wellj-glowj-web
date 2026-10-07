import { site } from "../content/site.ts";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./i18n/locales.ts";

/** Absolute canonical URL for a path, always on the apex domain. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

/** Path of the home page in a locale. */
export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

/** hreflang map: one entry per locale plus x-default pointing at the default locale. */
export function languageAlternates(path = ""): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of LOCALES) map[locale] = absoluteUrl(localePath(locale, path));
  map["x-default"] = absoluteUrl(localePath(DEFAULT_LOCALE, path));
  return map;
}

/** Sitemap entries for every locale version of every public page path. */
export function sitemapEntries(pagePaths: readonly string[] = [""]) {
  return pagePaths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
