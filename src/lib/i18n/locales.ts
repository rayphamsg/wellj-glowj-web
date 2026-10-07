/** Plain-TypeScript i18n: no library. Only these locales have routes. */
export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Used for the temporary `/` redirect and the hreflang x-default. */
export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };

/** The other language, for the language switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === "vi" ? "en" : "vi";
}
