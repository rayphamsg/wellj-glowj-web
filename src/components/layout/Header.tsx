import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n/locales";

/** Minimal shell. Final header (logo, navigation) comes with the approved design. */
export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-line">
      <Container className="flex h-14 items-center justify-between">
        {/* PENDING: replace the text with the real GlowJ logo asset. */}
        <Link href={`/${locale}`} className="font-semibold">
          {site.name}
        </Link>
        <LanguageSwitcher locale={locale} />
      </Container>
    </header>
  );
}
