import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { otherLocale, type Locale } from "@/lib/i18n/locales";

/** Links to the same page in the other language. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const target = otherLocale(locale);
  return (
    <Link
      href={`/${target}`}
      hrefLang={target}
      lang={target}
      className="inline-flex min-h-11 items-center rounded-xl border border-line bg-surface/70 px-4 text-sm font-medium text-ink transition duration-500 ease-flow hover:bg-liquid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
    >
      {getDictionary(locale).header.languageSwitchLabel}
    </Link>
  );
}
