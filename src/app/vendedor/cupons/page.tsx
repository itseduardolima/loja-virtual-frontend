'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ErrorState, ConfirmDialog } from '@/components'
import { Plus, Tag, ShoppingCart, Clock, Search, Edit, Trash2, MoreHorizontal, Play, Pause } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCuponsPage, type Coupon, isExpired, isExhausted } from './useCuponsPage'
import LoadingPage from '@/components/Layout/LoadingPage'
import FeatureLocked from '@/components/Layout/FeatureLocked'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatPrice } from '@/lib/utils'

type DisplayStatus = 'active' | 'paused' | 'expired' | 'exhausted'

function getCouponDisplayStatus(c: Coupon): DisplayStatus {
  if (c.status === 0) return 'paused'
  if (isExpired(c.expires_at)) return 'expired'
  if (isExhausted(c)) return 'exhausted'
  return 'active'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ValidityCell({ expires_at }: { expires_at: string | null }) {
  if (!expires_at) {
    return (
      <div>
        <div className="text-[12.5px] text-nxi2">—</div>
        <div className="mt-0.5 font-mono text-[11px] text-nxi3">Sem expiração</div>
      </div>
    )
  }
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

function UsesCell({ used, max }: { used: number; max: number | null }) {
  const pct = max ? Math.min(100, (used / max) * 100) : 0
  return (
    <div className="flex min-w-[120px] items-center gap-2.5">
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

const STATUS_CONFIG: Record<DisplayStatus, { label: string; cls: string }> = {
  active:    { label: 'Ativo',    cls: 'bg-green-50 text-green-700' },
  paused:    { label: 'Pausado',  cls: 'bg-amber-50 text-amber-700' },
  expired:   { label: 'Expirado', cls: 'bg-nxbg text-nxi2 border border-nxborder' },
  exhausted: { label: 'Esgotado', cls: 'bg-red-50 text-red-600' },
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

function TypeChip({ type }: { type: 'percent' | 'fixed' }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
      type === 'percent' ? 'bg-green-50 text-green-700' : 'bg-nxp/10 text-nxp',
    )}>
      {type === 'percent' ? '% desconto' : 'R$ fixo'}
    </span>
  )
}

function KpiCard({ label, value, icon: Icon, iconCls }: {
  label: string; value: number | string; icon: React.ElementType; iconCls: string
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

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-nxborder">
            {['Código', 'Tipo', 'Valor', 'Usos', 'Validade', 'Status', ''].map(h => (
              <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-nxi3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-nxborder last:border-0">
              <td className="px-4 py-4"><div className="h-6 w-28 rounded-lg bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-5 w-22 rounded-full bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-nxbg" /></td>
              <td className="px-4 py-4"><div className="h-8 w-20 rounded bg-nxbg" /></td>
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
        <text x="32" y="54" fontFamily="monospace" fontSize="11" fill="#8A93A8" fontWeight="600">15%</text>
        <text x="72" y="46" fontFamily="monospace" fontSize="9" fill="#DDE0E8" fontWeight="600">CÓDIGO</text>
        <rect x="72" y="50" width="48" height="8" rx="2" fill="#ECEEF3" />
      </svg>
      <h3 className="text-[17px] font-bold text-nxi1">
        {hasFilter ? 'Nenhum cupom encontrado' : 'Você ainda não criou cupons'}
      </h3>
      <p className="max-w-xs text-[13px] text-nxi2">
        {hasFilter
          ? 'Tente ajustar o filtro ou a busca.'
          : 'Crie cupons de desconto para campanhas, fidelizar clientes ou impulsionar vendas.'}
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

function CouponRow({ coupon, onEdit, onToggle, onDelete, isToggling }: {
  coupon: Coupon
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
  isToggling: boolean
}) {
  const status = getCouponDisplayStatus(coupon)
  const valueStr = coupon.type === 'percent'
    ? `${parseFloat(coupon.value)}%`
    : formatPrice(parseFloat(coupon.value))

  return (
    <tr className="border-b border-nxborder transition-colors last:border-0 hover:bg-nxbg/50">
      <td className="px-4 py-3.5">
        <span className="rounded-lg border border-nxborder bg-nxbg px-2.5 py-1 font-mono text-[12px] font-semibold text-nxi1 tracking-wide">
          {coupon.code}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <TypeChip type={coupon.type} />
      </td>
      <td className="px-4 py-3.5 font-semibold tabular-nums text-[13px] text-nxi1">
        {valueStr}
      </td>
      <td className="px-4 py-3.5">
        <UsesCell used={coupon.used_count} max={coupon.max_uses} />
      </td>
      <td className="px-4 py-3.5">
        <ValidityCell expires_at={coupon.expires_at} />
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
              onClick={onToggle}
              disabled={isToggling}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-nxi1 transition hover:bg-nxbg disabled:opacity-50"
            >
              {coupon.status === 1
                ? <><Pause className="h-3.5 w-3.5 text-nxi3" /> Pausar</>
                : <><Play className="h-3.5 w-3.5 text-nxi3" /> Ativar</>
              }
            </button>
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </button>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  )
}

const FILTERS = [
  { key: 'all',     label: 'Todos' },
  { key: 'active',  label: 'Ativos' },
  { key: 'paused',  label: 'Pausados' },
  { key: 'expired', label: 'Expirados' },
] as const

export default function CuponsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { features, isLoading: isLoadingFeatures } = usePlanFeatures()

  const {
    coupons,
    isLoading,
    error,
    stats,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    deleteDialogOpen,
    setDeleteDialogOpen,
    couponToDelete,
    handleDeleteConfirm,
    isDeleting,
    handleEdit,
    handleDeleteClick,
    handleToggleStatus,
    toggleStatusMutation,
  } = useCuponsPage({ enabled: features.feature_coupons })

  if (authLoading || isLoadingFeatures) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado para gerenciar cupons" />

  if (!features.feature_coupons) {
    return (
      <FeatureLocked
        title="Cupons de desconto não está no seu plano"
        description="Faça upgrade para criar cupons percentuais ou fixos com expiração e limite de uso."
        feature="feature_coupons"
      />
    )
  }

  if (error) return <ErrorState message="Erro ao carregar cupons" />

  const filterCounts = {
    all:     stats.total,
    active:  stats.active,
    paused:  stats.paused,
    expired: stats.expired,
  }

  const hasFilter = !!search.trim() || activeFilter !== 'all'

  return (
    <div className="mx-auto max-w-[1380px] space-y-5 py-4 md:py-6 lg:py-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-nxi1">Cupons</h1>
          <p className="mt-1 text-[13.5px] text-nxi2">Crie e gerencie códigos promocionais da sua loja.</p>
        </div>
        <button
          onClick={() => router.push('/vendedor/cupons/criar')}
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
            className="h-9 w-64 rounded-xl border border-nxborder bg-nxbg pl-9 pr-3 text-[13px] text-nxi1 placeholder:text-nxi3 focus:outline-none focus:ring-2 focus:ring-nxp/30"
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
              onCreateClick={() => router.push('/vendedor/cupons/criar')}
            />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-nxborder">
                  {['Código', 'Tipo', 'Valor', 'Usos', 'Validade', 'Status', ''].map(h => (
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
                    onEdit={() => handleEdit(coupon)}
                    onToggle={() => handleToggleStatus(coupon)}
                    onDelete={() => handleDeleteClick(coupon)}
                    isToggling={toggleStatusMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Cupom"
        description={`Tem certeza que deseja excluir o cupom "${couponToDelete?.code}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
