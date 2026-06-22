'use client'

import {
  Search,
  RotateCcw,
  SearchX,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { getInitials, avatarHueFor } from '@/lib/vendor'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AdminRefund } from '@/types/admin'
import { ConfirmDialog } from '@/components'
import { useEstornosPage } from './useEstornosPage'

// ─── helpers ──────────────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} />
}

const GRID = 'grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_96px] gap-3 items-center'

function TableHeader() {
  return (
    <div
      className={cn(
        GRID,
        'bg-[#FBFBFD] px-[18px] py-3 text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3',
      )}
    >
      <div>Usuário</div>
      <div>Plano</div>
      <div>Valor</div>
      <div>Método</div>
      <div>Data</div>
      <div className="text-center">Ações</div>
    </div>
  )
}

function SkRow({ borderTop = true }: { borderTop?: boolean }) {
  return (
    <div className={cn(GRID, 'px-[18px] py-[13px]', borderTop && 'border-t border-[#F0F1F5]')}>
      <div className="flex items-center gap-[10px]">
        <Sk className="h-8 w-8 rounded-[9px]" />
        <Sk className="h-[13px] w-[60%]" />
      </div>
      <Sk className="h-3 w-[75%]" />
      <Sk className="h-3 w-[65%]" />
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-3 w-[60%]" />
      <div className="flex justify-center gap-2">
        <Sk className="h-8 w-8 rounded-[9px]" />
        <Sk className="h-8 w-8 rounded-[9px]" />
      </div>
    </div>
  )
}

function RefundRow({
  refund,
  methodMap,
  onApprove,
  onReject,
}: {
  refund: AdminRefund
  methodMap: Record<string, string>
  onApprove: () => void
  onReject: () => void
}) {
  const date = refund.updated_at
    ? format(new Date(refund.updated_at), 'dd/MM/yyyy', { locale: ptBR })
    : '—'

  return (
    <div className={cn(GRID, 'border-t border-[#F0F1F5] px-[18px] py-[13px] bg-white hover:bg-[#FAFAFE] transition-colors')}>
      <div className="flex min-w-0 items-center gap-[10px]">
        <span
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] text-[12px] font-extrabold text-white"
          style={{ background: avatarHueFor(refund.subscription?.user?.name ?? '') }}
        >
          {getInitials(refund.subscription?.user?.name ?? '')}
        </span>
        <span className="truncate text-[13px] font-bold text-nxi1">
          {refund.subscription?.user?.name ?? '—'}
        </span>
      </div>
      <div className="truncate text-[13px] font-semibold text-nxi2">
        {refund.subscription?.plan?.name ?? '—'}
      </div>
      <div className="text-[13px] font-bold text-nxi1">{formatPrice(refund.amount)}</div>
      <div className="text-[13px] font-semibold text-nxi2">
        {methodMap[refund.payment_method] ?? refund.payment_method}
      </div>
      <div className="text-[13px] font-semibold text-nxi2">{date}</div>
      <div className="flex items-center justify-center gap-[6px]">
        <button
          type="button"
          onClick={onApprove}
          title="Aprovar estorno"
          className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-nxborder bg-white transition-colors hover:bg-[rgba(63,138,102,0.06)]"
        >
          <CheckCircle2 size={16} className="text-[#3F8A66]" />
        </button>
        <button
          type="button"
          onClick={onReject}
          title="Rejeitar estorno"
          className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-nxborder bg-white transition-colors hover:bg-[rgba(193,58,46,0.06)]"
        >
          <XCircle size={16} className="text-[#C13A2E]" />
        </button>
      </div>
    </div>
  )
}

function ListEmpty({ hasSearch }: { hasSearch: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
        <SearchX size={44} className="text-nxi3" />
        <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
          Nenhum estorno corresponde à busca
        </p>
        <p className="mt-1 text-[13px] font-semibold text-nxi2">Tente outro nome ou e-mail.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <RotateCcw size={44} className="text-nxi3" />
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Nenhum estorno pendente</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Não há pedidos de estorno aguardando revisão.
      </p>
    </div>
  )
}

function ListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(193,58,46,0.08)]">
        <AlertCircle size={24} className="text-[#C13A2E]" />
      </span>
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Erro ao carregar a lista</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Não foi possível buscar os pedidos de estorno.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-[14px] flex items-center gap-[7px] rounded-[9px] bg-nxp px-4 h-[38px] text-[13px] font-bold text-white"
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  )
}

function TablePagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
}: {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (p: number) => void
}) {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, total)

  const pages: number[] = []
  let from = Math.max(1, currentPage - 1)
  let to = Math.min(lastPage, currentPage + 1)
  if (to - from < 2) {
    if (from === 1) to = Math.min(lastPage, 3)
    else from = Math.max(1, to - 2)
  }
  for (let p = from; p <= to; p++) pages.push(p)

  const btn = 'flex h-[38px] w-[38px] items-center justify-center rounded-[9px] text-[13px] font-bold'

  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] font-semibold text-nxi3">
        Mostrando {start}–{end} de {total} estornos
      </span>
      <div className="flex gap-[6px]">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(btn, 'border border-nxborder bg-white text-nxi2 disabled:opacity-40')}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              btn,
              p === currentPage ? 'bg-nxp text-white' : 'border border-nxborder bg-white text-nxi2',
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={cn(btn, 'border border-nxborder bg-white text-nxi2 disabled:opacity-40')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminEstornosPage() {
  const {
    refunds,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
    confirmAction,
    setConfirmAction,
    handleAction,
    methodMap,
  } = useEstornosPage()

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Estornos</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
            Pedidos de estorno aguardando revisão
          </p>
        </div>
        {!isLoading && meta != null && (
          <span className="flex shrink-0 items-center gap-[6px] h-[30px] rounded-full border border-nxborder bg-white px-3 text-[12px] font-extrabold text-nxi2">
            <RotateCcw size={14} />
            {meta.total} estornos
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[360px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nxi3"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar por usuário…"
            className="h-[40px] w-full rounded-[10px] border border-nxborder bg-white pl-9 pr-3 text-[13px] font-semibold text-nxi1 placeholder:text-nxi3 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <TableHeader />
            {isLoading ? (
              [0, 1, 2, 3].map((i) => <SkRow key={i} borderTop={i > 0} />)
            ) : isError ? (
              <ListError onRetry={() => refetch()} />
            ) : refunds.length === 0 ? (
              <ListEmpty hasSearch={!!search} />
            ) : (
              refunds.map((refund) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                  methodMap={methodMap}
                  onApprove={() => setConfirmAction({ refund, action: 'approve' })}
                  onReject={() => setConfirmAction({ refund, action: 'reject' })}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && meta && meta.lastPage > 1 && refunds.length > 0 && (
        <TablePagination
          currentPage={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          perPage={meta.perPage}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={confirmAction?.action === 'approve' ? 'Aprovar Estorno' : 'Rejeitar Estorno'}
        description={
          confirmAction?.action === 'approve'
            ? `Confirma a aprovação do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`
            : `Confirma a rejeição do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`
        }
        onConfirm={handleAction}
        variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'}
      />
    </div>
  )
}
