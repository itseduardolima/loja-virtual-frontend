'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getNicheIcon } from '@/components/ProductForm'

interface PlpHeroProps {
  slug: string
  /** nicho da loja — dirige badge e ícone (null = loja sem nicho) */
  niche: { name: string; slug: string } | null
  title: string
  resultCount: number
  search?: string
}

/** Faixa de título da PLP: breadcrumb + badge de nicho + contagem de resultados */
export function PlpHero({ slug, niche, title, resultCount, search }: PlpHeroProps) {
  const NicheIcon = niche ? getNicheIcon(niche.slug) : null

  return (
    <div className="border-b border-nxborder bg-nxbg/50">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-10">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-nxi3">
          <Link href={`/loja/${slug}`} className="hover:text-nxp">
            Início
          </Link>
          <ChevronRight size={12} />
          <span className="text-nxi2">Produtos</span>
        </div>

        <div className="mt-2">
          {niche && NicheIcon && (
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-nxp/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-nxp">
                <NicheIcon size={12} /> {niche.name}
              </span>
            </div>
          )}
          <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1 sm:text-[32px]">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] text-nxi2">
            <b className="text-nxi1">{resultCount}</b>{' '}
            {resultCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
            {search && <> para “{search}”</>}
          </p>
        </div>
      </div>
    </div>
  )
}
