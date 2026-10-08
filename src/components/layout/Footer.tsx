import { site } from "@/content/site";

/** Minimal footer, ink on coral. Legal/privacy links are added when those pages exist. */
export function Footer() {
  return (
    <footer className="site-footer pb-8 text-[13px] font-medium">
      <div className="wrap">
        © {new Date().getFullYear()} {site.parent}. {site.name}.
      </div>
    </footer>
  );
}
