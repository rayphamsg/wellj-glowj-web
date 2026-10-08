import { GlowJLogo } from "@/components/brand/GlowJLogo";

/** Header logo: the official GlowJ logo, unmodified. Sized by height only. */
export function Wordmark({ className }: { className?: string }) {
  return <GlowJLogo className={className} />;
}
