import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Wordmark } from "@/components/layout/Wordmark";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Header: the official logo and the language switch, always on air, never sticky
 * (a sticky header would put the coral J on coral). 64px on mobile, 80px on desktop.
 */
export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="site-header">
      <div className="wrap flex h-full items-center justify-between">
        <Link href={`/${locale}`} className="block">
          <Wordmark className="h-11 w-auto lg:h-14" />
        </Link>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
