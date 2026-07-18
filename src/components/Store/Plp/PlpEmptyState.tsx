'use client'

import { Search } from 'lucide-react'
import { StoreButton, storeButtonClass } from '../ui'

interface PlpEmptyStateProps {
  /** limpa só os filtros aplicados (mantém a busca, se houver) */
  onClearFilters: () => void
  /** limpa filtros e busca — volta a mostrar toda a loja */
  onViewAll: () => void
}

/** Estado vazio da PLP quando nenhum produto bate com os filtros/busca. */
export function PlpEmptyState({ onClearFilters, onViewAll }: PlpEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-store/[0.08] text-store">
        <Search size={36} strokeWidth={1.7} />
      </div>
      <h2 className="mt-6 font-integral text-[24px] tracking-[-0.02em] text-nxi1 sm:text-[28px]">
        Nenhum produto encontrado
      </h2>
      <p className="mt-3 max-w-[38ch] text-[14.5px] leading-relaxed text-nxi2">
        Não encontramos produtos com esses filtros. Tente ajustar os critérios ou explorar toda a
        loja.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <StoreButton variant="primary" size="lg" onClick={onClearFilters}>
          Limpar filtros
        </StoreButton>
        <button
          type="button"
          onClick={onViewAll}
          className={storeButtonClass({ variant: 'outline', size: 'lg' })}
        >
          Ver todos os produtos
        </button>
      </div>
    </div>
  )
}
