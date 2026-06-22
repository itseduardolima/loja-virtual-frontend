'use client'

import {
  Plus,
  Tag,
  ShoppingCart,
  Clock,
  Search,
  SearchX,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { ConfirmDialog } from '@/components'
import { cn } from '@/lib/utils'
import { useAdminPlanCouponsPage, FILTERS, GRID } from './useAdminPlanCouponsPage'
import { KpiCard } from './_components/KpiCard'
import { SkeletonTable } from './_components/SkeletonTable'
import { CouponRow } from './_components/CouponRow'

// ─── table chrome ─────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div
      className={cn(
        GRID,
        'bg-[#FBFBFD] px-[18px] py-3 text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3',
      )}
    >
      <div>Código</div>
      <div>Desconto</div>
      <div>Ciclo</div>
      <div>Duração</div>
      <div>Usos</div>
      <div>Expira</div>
      <div>Planos</div>
      <div>Status</div>
      <div />
    </div>
  )
}

function ListEmpty({
  hasFilter,
  onCreateClick,
}: {
  hasFilter: boolean
  onCreateClick: () => void
}) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
        <SearchX size={44} className="text-nxi3" />
        <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
          Nenhum cupom corresponde aos filtros
        </p>
        <p className="mt-1 text-[13px] font-semibold text-nxi2">
          Ajuste a busca ou o filtro de status.
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <Tag size={44} className="text-nxi3" />
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Nenhum cupom de plano criado</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Crie cupons de desconto para campanhas de assinatura.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-[14px] flex items-center gap-[7px] rounded-[9px] bg-nxp px-4 h-[38px] text-[13px] font-bold text-white hover:bg-nxp/90 transition-colors"
      >
        <Plus size={14} />
        Criar primeiro cupom
      </button>
    </div>
  )
}

function ListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(193,58,46,0.08)]">
        <AlertCircle size={24} className="text-[#C13A2E]" />
      </span>
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Erro ao carregar os cupons</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Não foi possível buscar os cupons de plano.
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

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminPlanCouponsPage() {
  const {
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    confirmDelete,
    setConfirmDelete,
    isLoading,
    isError,
    refetch,
    coupons,
    stats,
    filterCounts,
    hasFilter,
    handleDelete,
    goToCreate,
    goToEdit,
  } = useAdminPlanCouponsPage()

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
            Cupons de Plano
          </h1>
          <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
            Gerencie cupons de desconto para assinaturas.
          </p>
        </div>
        <button
          onClick={goToCreate}
          className="flex items-center gap-[7px] rounded-[9px] bg-nxp h-[30px] px-3 text-[12px] font-bold text-white hover:bg-nxp/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo cupom
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          label="Cupons ativos"
          value={stats.active}
          icon={Tag}
          iconCls="bg-[rgba(42,45,124,0.08)] text-nxp"
        />
        <KpiCard
          label="Usos totais"
          value={stats.totalUses}
          icon={ShoppingCart}
          iconCls="bg-[rgba(63,138,102,0.10)] text-nxs"
        />
        <KpiCard
          label="Expirados"
          value={stats.expired}
          icon={Clock}
          iconCls="bg-[rgba(232,163,61,0.10)] text-nxw"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nxi3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código…"
            className="h-[40px] w-56 rounded-[10px] border border-nxborder bg-white pl-9 pr-3 text-[13px] font-semibold text-nxi1 placeholder:text-nxi3 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          />
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold tabular-nums transition',
                activeFilter === f.key
                  ? 'border-[rgba(42,45,124,0.3)] bg-[rgba(42,45,124,0.08)] text-nxp'
                  : 'border-nxborder bg-white text-nxi2 hover:border-nxi3 hover:text-nxi1',
              )}
            >
              {f.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10.5px]',
                  activeFilter === f.key ? 'bg-[rgba(42,45,124,0.15)]' : 'bg-black/[0.06]',
                )}
              >
                {filterCounts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <TableHeader />
              {isError ? (
                <ListError onRetry={() => refetch()} />
              ) : coupons.length === 0 ? (
                <ListEmpty hasFilter={hasFilter} onCreateClick={goToCreate} />
              ) : (
                coupons.map((coupon) => (
                  <CouponRow
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={() => goToEdit(coupon.id)}
                    onDelete={() => setConfirmDelete(coupon)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Desativar cupom"
        description={`Tem certeza que deseja desativar o cupom "${confirmDelete?.code}"?`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
