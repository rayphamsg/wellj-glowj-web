import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

/** Minimal shell. Final footer (links, legal, social) comes with the approved design. */
export function Footer({ note }: { note: string }) {
  return (
    <footer className="border-t border-line py-6 text-sm text-muted">
      <Container>
        © {new Date().getFullYear()} {site.parent}. {site.name}. {note}
      </Container>
    </footer>
  );
}
