'use client'

import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Plus,
  Pencil,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, formatBRL } from '@/lib/utils'
import type { AdminPlan } from '@/types/admin'
import { ConfirmDialog } from '@/components'
import { usePlanosPage } from './usePlanosPage'

// ─── helpers ──────────────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} />
}

const GRID = 'grid grid-cols-[2.5fr_1.2fr_1.2fr_1.3fr_1fr_64px] gap-3 items-center'

function TableHeader() {
  return (
    <div
      className={cn(
        GRID,
        'bg-[#FBFBFD] px-[18px] py-3 text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3',
      )}
    >
      <div>Nome</div>
      <div>Mensal</div>
      <div>Anual</div>
      <div>Máx. produtos</div>
      <div>Status</div>
      <div className="text-center">Editar</div>
    </div>
  )
}

function SkRow({ borderTop = true }: { borderTop?: boolean }) {
  return (
    <div className={cn(GRID, 'px-[18px] py-[13px]', borderTop && 'border-t border-[#F0F1F5]')}>
      <div className="flex flex-col gap-[5px]">
        <Sk className="h-[13px] w-[65%]" />
        <Sk className="h-3 w-[50%]" />
      </div>
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-3 w-[55%]" />
      <Sk className="h-5 w-[60px] rounded-full" />
      <div className="flex justify-center">
        <Sk className="h-8 w-8 rounded-[9px]" />
      </div>
    </div>
  )
}

function PlanRow({
  plan,
  onEdit,
}: {
  plan: AdminPlan
  onEdit: () => void
}) {
  const isActive = plan.status === 1

  return (
    <div className={cn(GRID, 'border-t border-[#F0F1F5] px-[18px] py-[13px] bg-white hover:bg-[#FAFAFE] transition-colors')}>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-nxi1">{plan.name}</p>
        {plan.description && (
          <p className="truncate text-[11.5px] font-semibold text-nxi3">{plan.description}</p>
        )}
      </div>
      <div className="text-[13px] font-semibold text-nxi2">
        {formatBRL(Number(plan.price_monthly))}
      </div>
      <div className="text-[13px] font-semibold text-nxi2">
        {plan.price_yearly != null ? formatBRL(Number(plan.price_yearly)) : '—'}
      </div>
      <div className="text-[13px] font-semibold text-nxi2">
        {plan.max_products ?? 'Ilimitado'}
      </div>
      <div>
        <span
          className="inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.04em]"
          style={
            isActive
              ? {
                  color: '#2E6B4E',
                  background: 'rgba(63,138,102,0.08)',
                  boxShadow: 'inset 0 0 0 1px rgba(63,138,102,0.18)',
                }
              : {
                  color: '#8A8CA3',
                  background: 'rgba(138,140,163,0.1)',
                  boxShadow: 'inset 0 0 0 1px rgba(138,140,163,0.2)',
                }
          }
        >
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: isActive ? '#2E6B4E' : '#8A8CA3' }}
          />
          {isActive ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onEdit}
          title="Editar plano"
          className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-nxborder bg-white transition-colors hover:bg-nxbg"
        >
          <Pencil size={14} className="text-nxp" />
        </button>
      </div>
    </div>
  )
}

function ListEmpty() {
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <CreditCard size={44} className="text-nxi3" />
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Nenhum plano encontrado</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">Crie um plano para começar.</p>
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
        Não foi possível buscar os planos.
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
        Mostrando {start}–{end} de {total} planos
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

export default function AdminPlanosPage() {
  const router = useRouter()
  const {
    plans,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    confirmDelete,
    setConfirmDelete,
    handleDelete,
  } = usePlanosPage()

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Planos</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
            Gerencie os planos de assinatura
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isLoading && meta != null && (
            <span className="flex items-center gap-[6px] h-[30px] rounded-full border border-nxborder bg-white px-3 text-[12px] font-extrabold text-nxi2">
              <CreditCard size={14} />
              {meta.total} planos
            </span>
          )}
          <button
            type="button"
            onClick={() => router.push('/admin/planos/criar')}
            className="flex items-center gap-[7px] rounded-[9px] bg-nxp h-[30px] px-3 text-[12px] font-bold text-white hover:bg-nxp/90 transition-colors"
          >
            <Plus size={14} />
            Novo plano
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <TableHeader />
            {isLoading ? (
              [0, 1, 2, 3].map((i) => <SkRow key={i} borderTop={i > 0} />)
            ) : isError ? (
              <ListError onRetry={() => refetch()} />
            ) : plans.length === 0 ? (
              <ListEmpty />
            ) : (
              plans.map((plan) => (
                <PlanRow
                  key={plan.id}
                  plan={plan}
                  onEdit={() => router.push(`/admin/planos/editar/${plan.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && meta && meta.lastPage > 1 && plans.length > 0 && (
        <TablePagination
          currentPage={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          perPage={meta.perPage}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null)
        }}
        title="Desativar Plano"
        description={`Tem certeza que deseja desativar o plano "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
