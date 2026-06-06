'use client'

interface PlpLoadMoreProps {
  shown: number
  total: number
  isFetching: boolean
  error?: string | null
  onLoadMore: () => void
}

/** Barra de progresso + botão "Carregar mais" (paginação incremental da PLP). */
export function PlpLoadMore({ shown, total, isFetching, error, onLoadMore }: PlpLoadMoreProps) {
  const pct = total > 0 ? Math.min(100, (shown / total) * 100) : 100

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="h-1 w-44 overflow-hidden rounded-full bg-nxbg">
        <div
          className="h-full rounded-full bg-nxp transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[12px] text-nxi3">
        Mostrando <b className="text-nxi1">{shown}</b> de {total}
      </p>
      {error && <p className="text-[12px] text-nxd">{error}</p>}
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isFetching}
        className="rounded-full border border-nxborder px-8 py-3 text-[13px] font-bold text-nxi1 transition-colors hover:border-nxp hover:text-nxp disabled:opacity-60"
      >
        {isFetching ? 'Carregando...' : 'Carregar mais'}
      </button>
    </div>
  )
}
