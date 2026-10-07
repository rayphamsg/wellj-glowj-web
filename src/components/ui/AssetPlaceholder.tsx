import { cx } from "@/lib/cx";

type AssetPlaceholderProps = {
  /** What is missing, e.g. "Logo" or "Hero product photo". */
  label: string;
  className?: string;
};

/**
 * Visibly marks a spot where a real brand asset has not been provided yet.
 * Replace usages with the real asset; never ship this as final.
 */
export function AssetPlaceholder({ label, className }: AssetPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cx(
        "flex items-center justify-center border border-dashed border-muted bg-line/40 p-4 text-center text-xs font-medium uppercase tracking-wide text-muted",
        className,
      )}
    >
      Placeholder: {label}
    </div>
  );
}
