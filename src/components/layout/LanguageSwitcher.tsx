import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { otherLocale, type Locale } from "@/lib/i18n/locales";

/** "VI / EN" as plain text: the current language in bold, the other a link. No pill, no border. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const target = otherLocale(locale);
  const order: Locale[] = ["vi", "en"];
  return (
    <nav aria-label="Language" className="flex items-center text-sm font-semibold">
      {order.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span aria-hidden="true">/</span>}
          {code === locale ? (
            <span aria-current="true" className="inline-flex min-h-11 min-w-11 items-center justify-center font-black">
              {code.toUpperCase()}
            </span>
          ) : (
            <Link
              href={`/${target}`}
              hrefLang={target}
              lang={target}
              aria-label={getDictionary(locale).header.languageSwitchLabel}
              className="inline-flex min-h-11 min-w-11 items-center justify-center hover:underline hover:underline-offset-4"
            >
              {code.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
