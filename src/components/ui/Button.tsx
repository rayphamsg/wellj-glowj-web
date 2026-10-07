import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-contrast hover:opacity-90",
  secondary: "border border-line bg-paper text-ink hover:bg-line/40",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cx(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant };

/** A link that looks like a button (for Zalo / Messenger / external CTAs). */
export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={cx(base, variants[variant], className)} {...props} />;
}
