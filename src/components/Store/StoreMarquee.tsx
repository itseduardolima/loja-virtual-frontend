'use client'

interface StoreMarqueeProps {
  items: string[]
}

/** Faixa de promessas derivadas dos dados reais da loja. Some com menos de 3 itens. */
export function StoreMarquee({ items }: StoreMarqueeProps) {
  if (items.length < 3) return null
  const row = [...items, ...items]
  return (
    <div className="edge-fade-x group mt-10 overflow-hidden bg-coal py-3.5">
      <div className="nx-marquee flex w-max items-center group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 pr-6 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/70"
          >
            {item}
            <span aria-hidden className="text-store">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
