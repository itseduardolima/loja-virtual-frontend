'use client'

import { ShoppingBag, SearchX, CloudOff, RefreshCw } from 'lucide-react'

/** Bloco shimmer reutilizado nos skeletons (gradiente cinza + pulse). */
const SK = 'animate-pulse rounded-[8px] bg-gradient-to-r from-[#ECEDF2] via-[#F6F7FA] to-[#ECEDF2]'

/**
 * A1 · Carregando — grid de 5 KPIs (h-[74px]) + card de tabela com barras shimmer.
 * Largura fluida; ocupa o espaço da página.
 */
export function OrdersLoadingState() {
  return (
    <div className="w-full rounded-[16px] border border-nxborder bg-nxbg p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* KPIs */}
      <div className="mb-[14px] grid grid-cols-5 gap-[10px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${SK} h-[74px]`} />
        ))}
      </div>

      {/* Card de tabela */}
      <div className="flex flex-col gap-[14px] rounded-[14px] border border-nxborder bg-white p-[14px]">
        <div className={`${SK} h-[14px] w-[30%]`} />
        <div className={`${SK} h-[12px]`} />
        <div className={`${SK} h-[12px]`} />
        <div className={`${SK} h-[12px] w-[80%]`} />
        <div className={`${SK} h-[12px]`} />
      </div>
    </div>
  )
}

interface OrdersEmptyStateProps {
  onPromote?: () => void
}

/** A2 · Vazio absoluto — nenhum pedido ainda. */
export function OrdersEmptyState({ onPromote }: OrdersEmptyStateProps) {
  return (
    <div className="rounded-[16px] border border-nxborder bg-white px-[24px] py-[48px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mx-auto mb-[16px] flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-nxbg">
        <ShoppingBag size={34} className="text-nxi3" />
      </div>
      <div className="text-[18px] font-extrabold text-nxi1">Nenhum pedido ainda</div>
      <div className="mt-[6px] text-[13px] font-semibold leading-[1.5] text-nxi3">
        Quando sua loja receber o primeiro pedido, ele aparece aqui em tempo real.
      </div>
      {onPromote && (
        <button
          type="button"
          onClick={onPromote}
          className="mt-[18px] h-[40px] rounded-[11px] bg-nxp px-[18px] text-[13px] font-extrabold text-white transition-colors hover:bg-nxp/90"
        >
          Divulgar minha loja
        </button>
      )}
    </div>
  )
}

interface OrdersFilteredEmptyStateProps {
  onClear: () => void
}

/** A3 · Vazio filtrado — busca/status/período sem resultados. */
export function OrdersFilteredEmptyState({ onClear }: OrdersFilteredEmptyStateProps) {
  return (
    <div className="rounded-[16px] border border-nxborder bg-white px-[24px] py-[48px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mx-auto mb-[14px] flex h-[56px] w-[56px] items-center justify-center rounded-[14px] bg-nxbg">
        <SearchX size={26} className="text-nxi3" />
      </div>
      <div className="text-[17px] font-extrabold text-nxi1">Nenhum pedido encontrado</div>
      <div className="mt-[5px] text-[13px] font-semibold text-nxi3">
        Tente ajustar a busca, o status ou o período.
      </div>
      <button
        type="button"
        onClick={onClear}
        className="mt-[16px] h-[38px] rounded-[11px] border border-nxborder bg-white px-[16px] text-[13px] font-extrabold text-nxp transition-colors hover:bg-nxbg"
      >
        Limpar filtros
      </button>
    </div>
  )
}

interface OrdersErrorStateProps {
  onRetry: () => void
}

/** A4 · Erro ao carregar. */
export function OrdersErrorState({ onRetry }: OrdersErrorStateProps) {
  return (
    <div className="rounded-[16px] border border-nxborder bg-white px-[24px] py-[48px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="mx-auto mb-[14px] flex h-[56px] w-[56px] items-center justify-center rounded-[14px] bg-[#FBE9EE]">
        <CloudOff size={26} className="text-nxd" />
      </div>
      <div className="text-[17px] font-extrabold text-nxi1">Não foi possível carregar</div>
      <div className="mt-[5px] text-[13px] font-semibold text-nxi3">
        Verifique sua conexão e tente novamente.
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-[16px] inline-flex h-[38px] items-center gap-[7px] rounded-[11px] bg-nxp px-[16px] text-[13px] font-extrabold text-white transition-colors hover:bg-nxp/90"
      >
        <RefreshCw size={14} className="text-white" />
        Tentar novamente
      </button>
    </div>
  )
}
