import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { otherLocale, type Locale } from "@/lib/i18n/locales";

/** Links to the same page in the other language. Unstyled until the design phase. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const target = otherLocale(locale);
  return (
    <Link href={`/${target}`} hrefLang={target} lang={target} className="text-sm underline">
      {getDictionary(locale).header.languageSwitchLabel}
    </Link>
  );
}
