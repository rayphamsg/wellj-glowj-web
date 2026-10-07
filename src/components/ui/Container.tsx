import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/** Centered, padded content width. Mobile-first gutters. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
