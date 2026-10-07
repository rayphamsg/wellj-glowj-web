import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/** Vertical rhythm wrapper that every page section sits in. */
export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cx("py-12 sm:py-16 lg:py-24", className)} {...props} />;
}
