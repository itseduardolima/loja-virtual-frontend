'use client'

// PreviewCard — espelha o ProductPreview de aside.jsx: card de pré-visualização
// da vitrine com capa, badges Destaque/-X%, nome do nicho, nome, preço/promo
// e swatches de cores. Adapta a assinatura do contrato (props discretas).
import Image from 'next/image'
import { Eye, Image as ImageIcon, Star } from 'lucide-react'
import { formatBRL, getColorHex } from './data'
import { NxBadge, Swatch } from './primitives'

export function PreviewCard({
  name,
  price,
  promoPrice,
  featured,
  nicheName,
  colors,
  coverUrl,
}: {
  name?: string
  price?: number
  promoPrice?: number | null
  featured?: boolean
  nicheName?: string | null
  colors: string[]
  coverUrl?: string | null
}) {
  const hasPromo = promoPrice != null && promoPrice > 0
  const off = hasPromo && price && price > 0 ? Math.round((1 - promoPrice / price) * 100) : 0

  return (
    <div className="rounded-2xl border border-nxborder bg-white p-3 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-nxi3">
          Pré-visualização
        </span>
        <span className="flex items-center gap-1 text-[10.5px] font-semibold text-nxi3">
          <Eye size={12} /> vitrine
        </span>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/3] min-h-[150px] overflow-hidden rounded-xl border border-nxborder bg-nxbg">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={name || 'Capa do produto'}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-nxi3">
              <ImageIcon size={24} />
              <span className="font-[ui-monospace,monospace] text-[10px]">capa do produto</span>
            </div>
          )}
        </div>
        {featured && (
          <span className="absolute left-2 top-2">
            <NxBadge tone="nxp" icon={Star}>
              Destaque
            </NxBadge>
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-2 top-2">
            <NxBadge tone="nxa">-{off}%</NxBadge>
          </span>
        )}
      </div>

      <div className="px-1 pt-3">
        {nicheName && (
          <span className="text-[10.5px] font-bold uppercase tracking-[0.05em] text-nxp">
            {nicheName}
          </span>
        )}
        <h4 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-nxi1">
          {name || 'Nome do produto'}
        </h4>
        <div className="mt-1.5 flex items-baseline gap-2">
          {hasPromo ? (
            <>
              <span className="text-[18px] font-extrabold tracking-[-0.02em] text-nxi1">
                {formatBRL(promoPrice)}
              </span>
              <span className="text-[12.5px] font-medium text-nxi3 line-through">
                {formatBRL(price)}
              </span>
            </>
          ) : (
            <span className="text-[18px] font-extrabold tracking-[-0.02em] text-nxi1">
              {price ? formatBRL(price) : 'R$ —'}
            </span>
          )}
        </div>
        {colors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {colors.slice(0, 6).map((c) => (
              <Swatch key={c} hex={getColorHex(c)} size={16} />
            ))}
            {colors.length > 6 && (
              <span className="text-[11px] font-semibold text-nxi3">+{colors.length - 6}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
