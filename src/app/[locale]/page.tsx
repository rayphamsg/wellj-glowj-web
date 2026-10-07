import { notFound } from "next/navigation";
import { SignupForm } from "@/components/sections/SignupForm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { stage } from "@/config/stage";
import { isEnabled } from "@/config/features";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

/**
 * TECHNICAL FOUNDATION PAGE ONLY. The real Coming Soon design and copy are
 * PENDING MARKETING DIRECTOR APPROVAL. Do not design this page until then.
 * It exists to prove routing, locale metadata and the lead-capture pipeline.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home, signup } = getDictionary(locale);

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-semibold">{home.heading}</h1>
        <p className="mt-2 text-muted">{home.body}</p>
        <p className="mt-2 text-xs text-muted">Foundation only. Stage: {stage}.</p>
        {isEnabled("waitlist") && (
          <div className="mt-8 max-w-xl">
            <SignupForm channel="zalo" locale={locale} placement="foundation" {...signup} />
          </div>
        )}
      </Container>
    </Section>
  );
}
