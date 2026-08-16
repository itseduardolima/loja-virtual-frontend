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
    <div className="mt-10 flex flex-col items-center gap-3.5">
      <div className="h-[5px] w-full max-w-[240px] overflow-hidden rounded-full bg-nxborder">
        <div
          className="h-full rounded-full bg-store transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-nxi3">
        Mostrando <span className="text-nxi1">{shown}</span> de {total}
      </p>
      {error && <p className="text-[12px] text-nxd">{error}</p>}
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isFetching}
        className="h-12 rounded-full border-[1.5px] border-store px-8 text-[14px] font-bold text-store-ink transition-colors hover:bg-store/[0.08] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
      >
        {isFetching ? 'Carregando…' : 'Carregar mais'}
      </button>
    </div>
  )
}
