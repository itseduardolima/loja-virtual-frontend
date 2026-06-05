'use client'

import { Plus, Tag, ShoppingCart, Clock, Search } from 'lucide-react'
import { ConfirmDialog } from '@/components'
import { cn } from '@/lib/utils'
import { useAdminPlanCouponsPage, FILTERS } from './useAdminPlanCouponsPage'
import { KpiCard }      from './_components/KpiCard'
import { SkeletonTable } from './_components/SkeletonTable'
import { EmptyState }   from './_components/EmptyState'
import { CouponRow }    from './_components/CouponRow'

const COLS = ['Código', 'Desconto', 'Ciclo', 'Duração', 'Usos', 'Expira', 'Planos', 'Status', '']

export default function AdminPlanCouponsPage() {
  const {
    search, setSearch,
    activeFilter, setActiveFilter,
    confirmDelete, setConfirmDelete,
    isLoading,
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
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Cupons de Plano</h1>
          <p className="mt-0.5 text-[13px] text-nxi2">Gerencie cupons de desconto para assinaturas.</p>
        </div>
        <button
          onClick={goToCreate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-nxp px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-nxp/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo cupom
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Cupons ativos"  value={stats.active}    icon={Tag}          iconCls="bg-nxp/10 text-nxp" />
        <KpiCard label="Usos totais"    value={stats.totalUses} icon={ShoppingCart}  iconCls="bg-green-100 text-green-600" />
        <KpiCard label="Expirados"      value={stats.expired}   icon={Clock}         iconCls="bg-amber-100 text-amber-600" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-nxborder bg-white px-4 py-3 shadow-sm">
        <div className="relative flex-none">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nxi3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por código…"
            className="h-9 w-56 rounded-xl border border-nxborder bg-nxbg pl-9 pr-3 text-[13px] text-nxi1 placeholder:text-nxi3 focus:outline-none focus:ring-2 focus:ring-nxp/30"
          />
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold tabular-nums transition',
                activeFilter === f.key
                  ? 'border-nxp/30 bg-nxp/10 text-nxp'
                  : 'border-nxborder bg-white text-nxi2 hover:border-nxi3 hover:text-nxi1',
              )}
            >
              {f.label}
              <span className={cn('rounded-full px-1.5 text-[10.5px]',
                activeFilter === f.key ? 'bg-nxp/20' : 'bg-black/[0.06]',
              )}>
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
        <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-sm">
          {coupons.length === 0 ? (
            <EmptyState hasFilter={hasFilter} onCreateClick={goToCreate} />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-nxborder">
                  {COLS.map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-nxi3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <CouponRow
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={() => goToEdit(coupon.id)}
                    onDelete={() => setConfirmDelete(coupon)}
                  />
                ))}
              </tbody>
            </table>
          )}
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
