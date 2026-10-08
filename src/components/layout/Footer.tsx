import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

/** Minimal footer. Legal/privacy links are added when the pages exist. */
export function Footer() {
  return (
    <footer className="py-8 text-xs text-muted">
      <Container>
        © {new Date().getFullYear()} {site.parent}. {site.name}.
      </Container>
    </footer>
  );
}
