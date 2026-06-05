'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Tag, ShoppingCart, Clock, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { ConfirmDialog } from '@/components'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { daysUntil, isExpired } from '@/lib/utils'
import { COUPON_STATUS, type StatusTone } from '@/lib/vendor'
import { useAdminPlanCoupons, useAdminDeletePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import { useToastContext } from '@/contexts/ToastContext'
import type { AdminPlanCoupon } from '@/types/admin'

// ─── helpers ─────────────────────────────────────────────────────────────────

const CYCLE_LABEL: Record<string, string> = {
  monthly: 'Mensal', yearly: 'Anual', both: 'Mensal e Anual',
}

function durationLabel(c: AdminPlanCoupon): string {
  if (c.duration_type === 'forever') return 'Vitalício'
  if (c.duration_type === 'once') return '1º pagamento'
  return `${c.duration_months} ${c.duration_months === 1 ? 'mês' : 'meses'}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

type DisplayStatus = 'active' | 'inactive' | 'expired'

function getStatus(c: AdminPlanCoupon): DisplayStatus {
  if (c.status === 0) return 'inactive'
  if (isExpired(c.expires_at)) return 'expired'
  return 'active'
}

const TONE_TO_CLS: Record<StatusTone, string> = {
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',
  neutral: 'bg-nxbg text-nxi2 border border-nxborder',
  primary: 'bg-nxp/10 text-nxp',
}

const STATUS_CONFIG: Record<DisplayStatus, { label: string; cls: string }> = {
  active:   { label: COUPON_STATUS.active.label,   cls: TONE_TO_CLS[COUPON_STATUS.active.tone] },
  inactive: { label: COUPON_STATUS.inactive.label, cls: TONE_TO_CLS[COUPON_STATUS.inactive.tone] },
  expired:  { label: COUPON_STATUS.expired.label,  cls: TONE_TO_CLS[COUPON_STATUS.expired.tone] },
}

// ─── sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, iconCls }: {
  label: string; value: number; icon: React.ElementType; iconCls: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-nxborder bg-white p-4 shadow-sm">
      <div>
        <p className="text-[12px] font-medium text-nxi3">{label}</p>
        <p className="mt-1 text-[26px] font-bold tracking-tight text-nxi1 tabular-nums">{value}</p>
      </div>
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', iconCls)}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
  )
}

function TypeChip({ type }: { type: 'percent' | 'fixed' }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
      type === 'percent' ? 'bg-green-50 text-green-700' : 'bg-nxp/10 text-nxp',
    )}>
      {type === 'percent' ? '% desconto' : 'R$ fixo'}
    </span>
  )
}

function StatusBadge({ status }: { status: DisplayStatus }) {
  const { label, cls } = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

function UsesCell({ used, max }: { used: number; max: number | null }) {
  const pct = max ? Math.min(100, (used / max) * 100) : 0
  return (
    <div className="flex min-w-[100px] items-center gap-2.5">
      <span className="font-mono text-[12.5px] font-medium text-nxi1 tabular-nums">
        {used}{max !== null ? ` / ${max}` : ''}
      </span>
      {max !== null && (
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-nxborder">
          <div
            className={cn('h-full rounded-full', pct >= 100 ? 'bg-green-500' : pct >= 80 ? 'bg-amber-400' : 'bg-nxp')}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

function ValidityCell({ expires_at }: { expires_at: string | null }) {
  if (!expires_at) return (
    <div>
      <div className="text-[12.5px] text-nxi2">—</div>
      <div className="mt-0.5 font-mono text-[11px] text-nxi3">Sem expiração</div>
    </div>
  )
  const days = daysUntil(expires_at)
  const expired = days <= 0
  const warn = !expired && days <= 30
  return (
    <div>
      <div className="text-[12.5px] text-nxi1">{fmtDate(expires_at)}</div>
      <div className={cn('mt-0.5 font-mono text-[11px]',
        expired ? 'text-red-500' : warn ? 'text-amber-600' : 'text-nxi3',
      )}>
        {expired ? 'Expirado' : `${days} dia${days !== 1 ? 's' : ''}`}
      </div>
    </div>
  )
}

function SkeletonTable() {
  const COLS = ['Código', 'Desconto', 'Ciclo', 'Duração', 'Usos', 'Expira', 'Planos', 'Status', '']
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-nxborder">
            {COLS.map(h => (
              <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-nxi3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-nxborder last:border-0">
              <td className="px-4 py-4"><div className="h-6 w-24 rounded-lg bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-5 w-20 rounded-full bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-16 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-8 w-20 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-6 w-16 rounded-full bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-6 w-6 rounded-lg bg-nxbg" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ hasFilter, onCreateClick }: { hasFilter: boolean; onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <svg className="mb-3" width="140" height="100" viewBox="0 0 140 100" fill="none">
        <path d="M14 30 H126 a4 4 0 0 1 4 4 v8 a6 6 0 0 0 0 12 v8 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 v-8 a6 6 0 0 0 0 -12 v-8 a4 4 0 0 1 4 -4 Z" stroke="#DDE0E8" strokeWidth="2" fill="#FBFAF7" />
        <line x1="58" y1="30" x2="58" y2="66" stroke="#DDE0E8" strokeWidth="2" strokeDasharray="3 3" />
        <text x="22" y="54" fontFamily="monospace" fontSize="11" fill="#8A93A8" fontWeight="600">PLANO</text>
        <text x="72" y="46" fontFamily="monospace" fontSize="9" fill="#DDE0E8" fontWeight="600">CÓDIGO</text>
        <rect x="72" y="50" width="48" height="8" rx="2" fill="#ECEEF3" />
      </svg>
      <h3 className="text-[17px] font-bold text-nxi1">
        {hasFilter ? 'Nenhum cupom encontrado' : 'Nenhum cupom de plano criado'}
      </h3>
      <p className="max-w-xs text-[13px] text-nxi2">
        {hasFilter
          ? 'Tente ajustar o filtro ou a busca.'
          : 'Crie cupons de desconto para campanhas de assinatura.'}
      </p>
      {!hasFilter && (
        <button
          onClick={onCreateClick}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-nxp px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Criar primeiro cupom
        </button>
      )}
    </div>
  )
}

function CouponRow({ coupon, onEdit, onDelete }: {
  coupon: AdminPlanCoupon
  onEdit: () => void
  onDelete: () => void
}) {
  const status = getStatus(coupon)
  const valueStr = coupon.discount_type === 'percent'
    ? `${Number(coupon.discount_value)}%`
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(coupon.discount_value))
  const plansLabel = coupon.plans.length === 0
    ? 'Todos'
    : coupon.plans.map(p => p.plan.name).join(', ')

  return (
    <tr className="border-b border-nxborder transition-colors last:border-0 hover:bg-nxbg/50">
      <td className="px-4 py-3.5">
        <span className="rounded-lg border border-nxborder bg-nxbg px-2.5 py-1 font-mono text-[12px] font-semibold tracking-wide text-nxi1">
          {coupon.code}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <TypeChip type={coupon.discount_type} />
          <span className="font-mono text-[12px] font-semibold tabular-nums text-nxi1">{valueStr}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-[12.5px] text-nxi2">
        {CYCLE_LABEL[coupon.applies_to_cycle] ?? coupon.applies_to_cycle}
      </td>
      <td className="px-4 py-3.5 text-[12.5px] text-nxi2">
        {durationLabel(coupon)}
      </td>
      <td className="px-4 py-3.5">
        <UsesCell used={coupon.used_count} max={coupon.max_uses} />
      </td>
      <td className="px-4 py-3.5">
        <ValidityCell expires_at={coupon.expires_at} />
      </td>
      <td className="px-4 py-3.5 max-w-[160px]">
        <span className="block truncate text-[12.5px] text-nxi2" title={plansLabel}>
          {plansLabel}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={status} />
      </td>
      <td className="px-4 py-3.5">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-nxi3 transition hover:bg-nxbg hover:text-nxi1">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1" align="end">
            <button
              onClick={onEdit}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-nxi1 transition hover:bg-nxbg"
            >
              <Edit className="h-3.5 w-3.5 text-nxi3" /> Editar
            </button>
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Desativar
            </button>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  )
}

const COLS = ['Código', 'Desconto', 'Ciclo', 'Duração', 'Usos', 'Expira', 'Planos', 'Status', '']

const FILTERS = [
  { key: 'all',      label: 'Todos' },
  { key: 'active',   label: 'Ativos' },
  { key: 'inactive', label: 'Inativos' },
  { key: 'expired',  label: 'Expirados' },
] as const

type FilterKey = typeof FILTERS[number]['key']

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminPlanCouponsPage() {
  const router = useRouter()
  const { success, error: toastError } = useToastContext()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [confirmDelete, setConfirmDelete] = useState<AdminPlanCoupon | null>(null)

  const { data, isLoading } = useAdminPlanCoupons({ page: 1, limit: 200 })
  const deleteMutation = useAdminDeletePlanCoupon()

  const allCoupons = data?.data ?? []

  // stats
  const stats = useMemo(() => ({
    active:    allCoupons.filter(c => getStatus(c) === 'active').length,
    totalUses: allCoupons.reduce((s, c) => s + (c.used_count ?? 0), 0),
    expired:   allCoupons.filter(c => getStatus(c) === 'expired').length,
  }), [allCoupons])

  // filter counts
  const filterCounts = useMemo(() => ({
    all:      allCoupons.length,
    active:   allCoupons.filter(c => getStatus(c) === 'active').length,
    inactive: allCoupons.filter(c => getStatus(c) === 'inactive').length,
    expired:  allCoupons.filter(c => getStatus(c) === 'expired').length,
  }), [allCoupons])

  // filtered list
  const coupons = useMemo(() => {
    let list = [...allCoupons]
    if (search.trim()) {
      const q = search.trim().toUpperCase()
      list = list.filter(c => c.code.includes(q) || (c.description ?? '').toUpperCase().includes(q))
    }
    if (activeFilter !== 'all') list = list.filter(c => getStatus(c) === activeFilter)
    return list
  }, [allCoupons, search, activeFilter])

  const hasFilter = !!search.trim() || activeFilter !== 'all'

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteMutation.mutateAsync(confirmDelete.id)
      success('Cupom desativado')
      setConfirmDelete(null)
    } catch {
      toastError('Erro ao desativar cupom')
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Cupons de Plano</h1>
          <p className="mt-0.5 text-[13px] text-nxi2">Gerencie cupons de desconto para assinaturas.</p>
        </div>
        <button
          onClick={() => router.push('/admin/cupons-plano/criar')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-nxp px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-nxp/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo cupom
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Cupons ativos"  value={stats.active}    icon={Tag}         iconCls="bg-nxp/10 text-nxp" />
        <KpiCard label="Usos totais"    value={stats.totalUses} icon={ShoppingCart} iconCls="bg-green-100 text-green-600" />
        <KpiCard label="Expirados"      value={stats.expired}   icon={Clock}        iconCls="bg-amber-100 text-amber-600" />
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
            <EmptyState
              hasFilter={hasFilter}
              onCreateClick={() => router.push('/admin/cupons-plano/criar')}
            />
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
                    onEdit={() => router.push(`/admin/cupons-plano/editar/${coupon.id}`)}
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
