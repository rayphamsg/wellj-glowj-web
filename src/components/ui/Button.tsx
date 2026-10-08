import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-2xl px-6 text-base font-bold transition duration-500 ease-flow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-contrast shadow-glow hover:brightness-105",
  secondary: "border border-line bg-surface text-ink hover:bg-blush/40",
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
