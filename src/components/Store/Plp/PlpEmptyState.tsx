'use client'

import { PackageSearch } from 'lucide-react'

interface PlpEmptyStateProps {
  onClear: () => void
}

/** Estado vazio da PLP quando nenhum produto bate com os filtros/busca. */
export function PlpEmptyState({ onClear }: PlpEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-nxborder bg-nxbg/40 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-nxi3 shadow-sm">
        <PackageSearch size={28} />
      </div>
      <h3 className="mt-4 text-[16px] font-extrabold tracking-tight text-nxi1">
        Nenhum produto encontrado
      </h3>
      <p className="mt-1.5 max-w-[34ch] text-[13px] text-nxi3">
        Tente ajustar os filtros ou o termo de busca.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full bg-nxp px-5 py-2.5 text-[12.5px] font-bold text-white"
      >
        Limpar filtros
      </button>
    </div>
  )
}
