import Image from "next/image";
import type { Dictionary } from "@/content/types";

type ZaloContinuationProps = {
  copy: Dictionary["home"]["zalo"];
  /** The real Zalo Official Account link (site.social.zalo). */
  href: string;
  /** Path of the real QR image of that same link (site.social.zaloQr). A QR is never generated or faked. */
  qrSrc: string;
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const Badge = () => (
  <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center border-2 border-ink text-[9px] font-bold tracking-[0.08em]">
    ZALO
  </span>
);

/**
 * The optional Zalo step after a successful signup (same structure as the working IronJ flow).
 * Entering a number does not follow the Zalo Official Account, so this only offers to continue there:
 * the lead is already stored before it appears. It fades in about 0.7s after the confirmation
 * (.zalo-reveal in globals.css; instant with reduced motion).
 *
 * Desktop (lg and up): a short row with the QR. Below it (phone, tablet): one tappable row, no QR.
 *
 * It needs BOTH the real link and the real QR. The page renders it only when site.social.zalo and
 * site.social.zaloQr are both set; until then nothing about Zalo is shown (no placeholder, no disabled button).
 */
export function ZaloContinuation({ copy, href, qrSrc }: ZaloContinuationProps) {
  const open = (
    <>
      {copy.open} <Arrow />
    </>
  );

  return (
    <div className="zalo-reveal mt-5">
      {/* Desktop: QR */}
      <div className="hidden border-t-2 border-ink pt-5 lg:grid lg:grid-cols-[6rem_1fr] lg:gap-5">
        <div className="size-24 bg-air">
          <Image src={qrSrc} alt={copy.qrAlt} width={96} height={96} unoptimized className="size-full" />
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[17px] font-bold">{copy.title}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">{copy.optional}</span>
          </div>
          <p className="text-[15px] font-medium leading-snug">{copy.scanHint}</p>
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 text-base font-bold underline underline-offset-4">
            {open}
          </a>
        </div>
      </div>

      {/* Phone and tablet: open Zalo directly */}
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-4 border-2 border-ink px-4 lg:hidden">
        <Badge />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[17px] font-bold leading-tight">{copy.open}</span>
          <span className="text-[13px] font-medium leading-tight">{copy.optional}</span>
        </span>
        <Arrow />
      </a>
    </div>
  );
}
