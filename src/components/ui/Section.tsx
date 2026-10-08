import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/** Vertical rhythm wrapper that every page section sits in. */
export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cx("py-section", className)} {...props} />;
}
