import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/**
 * The CTA: a flat ink block with air text. Square corners, no shadow, no colour wash.
 * Hover underlines; press moves it 2px down.
 */
export function Button({ className, type = "button", ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex min-h-14 items-center justify-center bg-ink px-6 text-[17px] font-bold text-air hover:underline hover:underline-offset-4 active:translate-y-0.5 disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
