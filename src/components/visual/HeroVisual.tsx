import Image from "next/image";
import { GlowDroplet } from "@/components/visual/GlowDroplet";

const BOTTLE_SRC = "/images/glowj-bottle.webp";

/**
 * Hero visual: the real GlowJ bottle (approved mockup, shown untouched) with
 * the living droplet device beside it, as if lifted off the label. Both stand
 * on one clear, fresh surface. The only effect on the bottle is a slow pass of
 * light over its silhouette; its shape, label and liquid are never redrawn.
 * Decorative light and shadow are aria-hidden.
 */
export function HeroVisual({ bottleAlt }: { bottleAlt: string }) {
  return (
    <div className="relative isolate aspect-[100/124] w-full">
      {/* Fresh light behind the pair: lets the clear bottle and translucent drop read */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[50%] -z-10 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(closest-side,var(--color-liquid-deep),var(--color-liquid)_55%,transparent)] opacity-70"
      />

      {/* The living droplet, behind and to the right */}
      <div className="absolute -bottom-[2%] -right-[3%] z-0 w-[46%]">
        <GlowDroplet className="h-auto w-full overflow-visible" />
      </div>

      {/* Surface: contact shadow and pink light cast through the liquid */}
      <div aria-hidden="true" className="absolute bottom-[0.3%] left-[8%] z-10 h-[2.6%] w-[44%] rounded-[50%] bg-ink/30 blur-md" />
      <div aria-hidden="true" className="absolute bottom-0 left-[30%] z-10 h-[2.2%] w-[30%] rounded-[50%] bg-brand/50 blur-md" />

      {/* The bottle, in front */}
      <div className="absolute bottom-[1.2%] left-[10%] z-20 h-[96%]">
        <Image
          src={BOTTLE_SRC}
          alt={bottleAlt}
          width={586}
          height={1492}
          priority
          unoptimized
          className="h-full w-auto drop-shadow-[0_18px_22px_rgb(53_25_43/0.12)]"
        />
        <div
          aria-hidden="true"
          className="bottle-sheen absolute inset-0"
          style={{ WebkitMaskImage: `url(${BOTTLE_SRC})`, maskImage: `url(${BOTTLE_SRC})` }}
        />
      </div>
    </div>
  );
}
