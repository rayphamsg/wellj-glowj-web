import { cx } from "@/lib/cx";

type AssetPlaceholderProps = {
  /** What is missing, e.g. "Hero photograph". */
  label: string;
  className?: string;
};

/**
 * Visibly marks a spot where an approved asset has not been provided yet.
 * Replace usages with the real asset; never ship this as final.
 */
export function AssetPlaceholder({ label, className }: AssetPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cx("flex items-center justify-center border-2 border-dashed border-ink p-4 text-center text-xs font-bold uppercase", className)}
    >
      Placeholder: {label}
    </div>
  );
}
