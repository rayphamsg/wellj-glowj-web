import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Wordmark } from "@/components/layout/Wordmark";
import type { Locale } from "@/lib/i18n/locales";

/** Quiet header: wordmark and language switch only, no navigation at Coming Soon. */
export function Header({ locale }: { locale: Locale }) {
  return (
    <header>
      <Container className="flex h-[4.5rem] items-center justify-between">
        <Link href={`/${locale}`} className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-strong">
          <Wordmark className="h-12 w-auto" />
        </Link>
        <LanguageSwitcher locale={locale} />
      </Container>
    </header>
  );
}
