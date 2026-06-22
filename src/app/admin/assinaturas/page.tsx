'use client'

import {
  Search,
  ChevronDown,
  Receipt,
  SearchX,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials, avatarHueFor } from '@/lib/vendor'
import { format, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AdminSubscription } from '@/types/admin'
import { useAssinaturasPage } from './useAssinaturasPage'

// ─── helpers ──────────────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} />
}

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status === 'active')
    return {
      color: '#2E6B4E',
      background: 'rgba(63,138,102,0.08)',
      boxShadow: 'inset 0 0 0 1px rgba(63,138,102,0.18)',
    }
  if (status === 'pending')
    return {
      color: '#8A6A1E',
      background: 'rgba(232,163,61,0.08)',
      boxShadow: 'inset 0 0 0 1px rgba(232,163,61,0.18)',
    }
  if (status === 'expired')
    return {
      color: '#C13A2E',
      background: 'rgba(193,58,46,0.08)',
      boxShadow: 'inset 0 0 0 1px rgba(193,58,46,0.18)',
    }
  return {
    color: '#8A8CA3',
    background: 'rgba(138,140,163,0.1)',
    boxShadow: 'inset 0 0 0 1px rgba(138,140,163,0.2)',
  }
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativa',
  pending: 'Pendente',
  expired: 'Expirada',
  canceled: 'Cancelada',
}

function expiryBadge(row: AdminSubscription): { label: string; style: React.CSSProperties } | null {
  if (row.status !== 'active' || !row.current_period_end) return null
  const days = differenceInCalendarDays(new Date(row.current_period_end), new Date())
  if (days < 0) return null
  if (days === 0)
    return {
      label: 'Vence hoje',
      style: {
        color: '#C13A2E',
        background: 'rgba(193,58,46,0.08)',
        boxShadow: 'inset 0 0 0 1px rgba(193,58,46,0.18)',
      },
    }
  if (days <= 7)
    return {
      label: `Vence em ${days}d`,
      style: {
        color: '#8A6A1E',
        background: 'rgba(232,163,61,0.08)',
        boxShadow: 'inset 0 0 0 1px rgba(232,163,61,0.18)',
      },
    }
  return null
}

const GRID = 'grid grid-cols-[1.5fr_1.8fr_1.3fr_1.2fr_1.8fr] gap-3 items-center'

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
      <div>Status</div>
      <div>Alerta</div>
      <div>Período</div>
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
      <Sk className="h-5 w-[72px] rounded-full" />
      <Sk className="h-5 w-[60px] rounded-full" />
      <Sk className="h-3 w-[85%]" />
    </div>
  )
}

function SubRow({ sub, statusMap }: { sub: AdminSubscription; statusMap: Record<string, { label: string }> }) {
  const statusLabel = statusMap[sub.status]?.label ?? STATUS_LABELS[sub.status] ?? sub.status
  const expiry = expiryBadge(sub)
  const period =
    sub.current_period_start
      ? `${format(new Date(sub.current_period_start), 'dd/MM/yy', { locale: ptBR })} – ${format(new Date(sub.current_period_end), 'dd/MM/yy', { locale: ptBR })}`
      : '—'

  return (
    <div className={cn(GRID, 'border-t border-[#F0F1F5] px-[18px] py-[13px] bg-white hover:bg-[#FAFAFE] transition-colors')}>
      <div className="flex min-w-0 items-center gap-[10px]">
        <span
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] text-[12px] font-extrabold text-white"
          style={{ background: avatarHueFor(sub.user?.name ?? '') }}
        >
          {getInitials(sub.user?.name ?? '')}
        </span>
        <span className="truncate text-[13px] font-bold text-nxi1">{sub.user?.name ?? '—'}</span>
      </div>
      <div className="truncate text-[13px] font-semibold text-nxi1">{sub.plan?.name ?? '—'}</div>
      <div>
        <span
          className="inline-flex items-center rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.04em]"
          style={statusBadgeStyle(sub.status)}
        >
          {statusLabel}
        </span>
      </div>
      <div>
        {expiry ? (
          <span
            className="inline-flex items-center rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.04em]"
            style={expiry.style}
          >
            {expiry.label}
          </span>
        ) : (
          <span className="text-[12px] text-nxi3">—</span>
        )}
      </div>
      <div className="text-[12.5px] font-semibold text-nxi2">{period}</div>
    </div>
  )
}

function ListEmpty({ hasFilter, onClear }: { hasFilter: boolean; onClear: () => void }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
        <SearchX size={44} className="text-nxi3" />
        <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
          Nenhuma assinatura corresponde aos filtros
        </p>
        <p className="mt-1 text-[13px] font-semibold text-nxi2">Ajuste a busca ou o status.</p>
        <button
          type="button"
          onClick={onClear}
          className="mt-[14px] flex items-center gap-[7px] rounded-[9px] border border-nxborder bg-white px-4 h-[38px] text-[13px] font-bold text-nxi2"
        >
          Limpar filtros
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <Receipt size={44} className="text-nxi3" />
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
        Nenhuma assinatura encontrada
      </p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Ainda não há assinaturas cadastradas na plataforma.
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
        Não foi possível buscar as assinaturas da plataforma.
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
        Mostrando {start}–{end} de {total} assinaturas
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

export default function AdminAssinaturasPage() {
  const {
    subs,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusMap,
    handleSync,
    isSyncing,
    hasActiveFilters,
    clearFilters,
  } = useAssinaturasPage()

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Assinaturas</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
            Visão geral de todas as assinaturas
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isLoading && meta != null && (
            <span className="flex items-center gap-[6px] h-[30px] rounded-full border border-nxborder bg-white px-3 text-[12px] font-extrabold text-nxi2">
              <Receipt size={14} />
              {meta.total} assinaturas
            </span>
          )}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-[7px] rounded-[9px] border border-nxborder bg-white h-[30px] px-3 text-[12px] font-bold text-nxi2 disabled:opacity-60 hover:bg-nxbg transition-colors"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Sincronizando…' : 'Sincronizar'}
          </button>
        </div>
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
        <div className="relative">
          <select
            value={statusFilter || 'all'}
            onChange={(e) => {
              setStatusFilter(e.target.value === 'all' ? '' : e.target.value)
              setPage(1)
            }}
            className="h-[40px] cursor-pointer appearance-none rounded-[10px] border border-nxborder bg-white pl-3 pr-8 text-[13px] font-bold text-nxi1 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativa</option>
            <option value="pending">Pendente</option>
            <option value="expired">Expirada</option>
            <option value="canceled">Cancelada</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-nxi3"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <TableHeader />
            {isLoading ? (
              [0, 1, 2, 3].map((i) => <SkRow key={i} borderTop={i > 0} />)
            ) : isError ? (
              <ListError onRetry={() => refetch()} />
            ) : subs.length === 0 ? (
              <ListEmpty hasFilter={hasActiveFilters} onClear={clearFilters} />
            ) : (
              subs.map((sub) => (
                <SubRow key={sub.id} sub={sub} statusMap={statusMap} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && meta && meta.lastPage > 1 && subs.length > 0 && (
        <TablePagination
          currentPage={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          perPage={meta.perPage}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
