'use client'

interface StoreMarqueeProps {
  items: string[]
}

/** Faixa de promessas derivadas dos dados reais da loja. Some com menos de 3 itens. */
export function StoreMarquee({ items }: StoreMarqueeProps) {
  if (items.length === 0) return null
  const row = [...items, ...items]
  return (
    <div className="mt-10 overflow-hidden border-y border-nxborder bg-nxbg/60 py-3">
      <div className="nx-marquee flex w-max">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-3 px-6 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-nxi3"
          >
            <span className="h-1 w-1 rounded-full bg-nxp/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
