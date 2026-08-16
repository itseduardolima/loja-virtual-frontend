'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStoreMonogram } from '@/lib/storefront'

interface PlpHeroProps {
  slug: string
  /** nome da loja — só para o monograma decorativo (marca d'água) */
  storeName?: string | null
  /** nicho da loja — mantido na assinatura por compatibilidade; o hero mercantilizado não exibe badge de nicho */
  niche?: { name: string; slug: string } | null
  title: string
  resultCount: number
  search?: string
}

/** Hero mercantilizado da PLP: breadcrumb, título display, contagem em destaque. */
export function PlpHero({ slug, storeName, title, resultCount, search }: PlpHeroProps) {
  const monogram = getStoreMonogram(storeName)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-nxsurf via-nxsurf to-store/[0.08]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-20 select-none font-integral text-[220px] leading-none text-store/[0.06] sm:text-[280px]"
      >
        {monogram}
      </div>

      <div className="relative mx-auto max-w-store px-4 py-8 md:px-10 md:py-11">
        <nav className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-nxi3">
          <Link href={`/loja/${slug}`} className="transition-colors hover:text-nxi1">
            Início
          </Link>
          <ChevronRight size={12} />
          <span className="text-store-ink">{title}</span>
        </nav>

        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="break-words font-integral text-[36px] leading-[0.98] tracking-[-0.03em] text-nxi1 sm:text-[48px]">
              {title}
            </h1>
            {search && (
              <p className="mt-3 text-[14px] text-nxi2">
                Resultados para <b className="text-nxi1">“{search}”</b>
              </p>
            )}
          </div>

          <div className="flex-none sm:text-right">
            <span className="font-integral text-[30px] leading-none tracking-[-0.02em] text-store-ink sm:text-[34px]">
              {resultCount}
            </span>
            <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-nxi3">
              {resultCount === 1 ? 'produto' : 'produtos'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
