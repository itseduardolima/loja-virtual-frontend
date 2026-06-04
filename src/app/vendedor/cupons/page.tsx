'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ErrorState, ConfirmDialog } from '@/components'
import {
  ListPageHeader,
  KpiStrip,
  StatusTabs,
  SearchField,
  TableCard,
  TableToolbar,
  TableEmptyState,
  RowActionsMenu,
  thClass,
  type KpiItem,
  type StatusTab,
  type RowAction,
} from '@/components/VendorList'
import { NxButton, NxBadge } from '@/components/ProductForm/primitives'
import {
  Plus,
  Tag,
  ShoppingCart,
  Clock,
  Pencil,
  Trash2,
  Play,
  Pause,
  BadgePercent,
  CheckCircle2,
  CircleSlash,
  LucideIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCuponsPage, type Coupon, type CouponFilter, isExpired, isExhausted } from './useCuponsPage'
import LoadingPage from '@/components/Layout/LoadingPage'
import FeatureLocked from '@/components/Layout/FeatureLocked'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { cn, formatPrice } from '@/lib/utils'

type DisplayStatus = 'active' | 'paused' | 'expired' | 'exhausted'

const STATUS: Record<DisplayStatus, { tone: 'nxs' | 'nxw' | 'nxi3' | 'nxd'; label: string; icon: LucideIcon }> = {
  active: { tone: 'nxs', label: 'Ativo', icon: CheckCircle2 },
  paused: { tone: 'nxw', label: 'Pausado', icon: Pause },
  expired: { tone: 'nxi3', label: 'Expirado', icon: Clock },
  exhausted: { tone: 'nxd', label: 'Esgotado', icon: CircleSlash },
}

function getCouponDisplayStatus(c: Coupon): DisplayStatus {
  if (c.status === 0) return 'paused'
  if (isExpired(c.expires_at)) return 'expired'
  if (isExhausted(c)) return 'exhausted'
  return 'active'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ValidityCell({ expires_at }: { expires_at: string | null }) {
  if (!expires_at) {
    return <span className="text-[12.5px] text-nxi3">Sem expiração</span>
  }
  const days = daysUntil(expires_at)
  const expired = days <= 0
  const warn = !expired && days <= 30
  return (
    <div>
      <div className="text-[12.5px] font-medium text-nxi1">{fmtDate(expires_at)}</div>
      <div
        className={cn(
          'mt-0.5 text-[11px] font-medium',
          expired ? 'text-nxd' : warn ? 'text-[#9a6a16]' : 'text-nxi3',
        )}
      >
        {expired ? 'Expirado' : `${days} dia${days !== 1 ? 's' : ''}`}
      </div>
    </div>
  )
}

function UsesCell({ used, max }: { used: number; max: number | null }) {
  const pct = max ? Math.min(100, (used / max) * 100) : 0
  return (
    <div className="flex min-w-[120px] items-center gap-2.5">
      <span className="text-[12.5px] font-bold tabular-nums text-nxi1">
        {used}
        {max !== null ? ` / ${max}` : ''}
      </span>
      {max !== null && (
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-nxborder">
          <div
            className={cn(
              'h-full rounded-full',
              pct >= 100 ? 'bg-nxd' : pct >= 80 ? 'bg-nxw' : 'bg-nxp',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

const FILTER_TO_STATS: Record<CouponFilter, 'total' | 'active' | 'paused' | 'expired'> = {
  all: 'total',
  active: 'active',
  paused: 'paused',
  expired: 'expired',
}

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

  if (isLoading) return <LoadingPage />
  if (error) return <ErrorState message="Erro ao carregar cupons" />

  const kpis: KpiItem[] = [
    { label: 'Cupons ativos', value: stats.active, icon: Tag, tone: 'nxp' },
    { label: 'Usos totais', value: stats.totalUses, icon: ShoppingCart, tone: 'nxs' },
    { label: 'Expirados', value: stats.expired, icon: Clock, tone: 'nxw' },
  ]

  const statusTabs: StatusTab<CouponFilter>[] = (
    [
      ['all', 'Todos'],
      ['active', 'Ativos'],
      ['paused', 'Pausados'],
      ['expired', 'Expirados'],
    ] as const
  ).map(([value, label]) => ({ value, label, count: stats[FILTER_TO_STATS[value]] }))

  const rowActions = (coupon: Coupon): RowAction[] => [
    { label: 'Editar', icon: Pencil, onClick: () => handleEdit(coupon) },
    {
      label: coupon.status === 1 ? 'Pausar' : 'Ativar',
      icon: coupon.status === 1 ? Pause : Play,
      onClick: () => handleToggleStatus(coupon),
      disabled: toggleStatusMutation.isPending,
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: () => handleDeleteClick(coupon),
      destructive: true,
      separatorBefore: true,
    },
  ]

  const hasFilters = !!search.trim() || activeFilter !== 'all'

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16 pt-2 sm:pt-4">
      <ListPageHeader
        title="Cupons"
        subtitle={`${stats.total} ${stats.total === 1 ? 'cupom' : 'cupons'} · ${stats.active} ativos na sua loja.`}
        action={
          <NxButton icon={Plus} onClick={() => router.push('/vendedor/cupons/criar')}>
            Novo cupom
          </NxButton>
        }
      />

      <div className="mb-5">
        <KpiStrip items={kpis} />
      </div>

      <TableCard>
        <TableToolbar>
          <StatusTabs tabs={statusTabs} active={activeFilter} onChange={setActiveFilter} />
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Buscar por código…"
            className="ml-auto w-full sm:w-64"
          />
        </TableToolbar>

        {coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className={cn(thClass, 'px-4')}>Código</th>
                  <th className={cn(thClass, 'hidden md:table-cell')}>Tipo</th>
                  <th className={thClass}>Valor</th>
                  <th className={cn(thClass, 'hidden sm:table-cell')}>Usos</th>
                  <th className={thClass}>Validade</th>
                  <th className={thClass}>Status</th>
                  <th className={cn(thClass, 'w-12')}></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const st = STATUS[getCouponDisplayStatus(coupon)]
                  const isPercent = coupon.type === 'percent'
                  return (
                    <tr
                      key={coupon.id}
                      className="border-t border-nxborder text-[13px] transition-colors hover:bg-nxbg/60"
                    >
                      <td className="px-4 py-3">
                        <span className="rounded-lg border border-nxborder bg-nxbg px-2.5 py-1 font-mono text-[12px] font-semibold tracking-wide text-nxi1">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="hidden px-2 py-3 md:table-cell">
                        <NxBadge tone={isPercent ? 'nxs' : 'nxp'}>
                          {isPercent ? '% desconto' : 'R$ fixo'}
                        </NxBadge>
                      </td>
                      <td className="px-2 py-3 font-bold tabular-nums text-nxi1">
                        {isPercent
                          ? `${parseFloat(coupon.value)}%`
                          : formatPrice(parseFloat(coupon.value))}
                      </td>
                      <td className="hidden px-2 py-3 sm:table-cell">
                        <UsesCell used={coupon.used_count} max={coupon.max_uses} />
                      </td>
                      <td className="px-2 py-3">
                        <ValidityCell expires_at={coupon.expires_at} />
                      </td>
                      <td className="px-2 py-3">
                        <NxBadge tone={st.tone} icon={st.icon}>
                          {st.label}
                        </NxBadge>
                      </td>
                      <td className="px-2 py-3">
                        <RowActionsMenu actions={rowActions(coupon)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <TableEmptyState
            icon={BadgePercent}
            title={hasFilters ? 'Nenhum cupom encontrado' : 'Você ainda não criou cupons'}
            description={
              hasFilters
                ? 'Ajuste o filtro ou o termo de busca.'
                : 'Crie cupons de desconto para campanhas, fidelizar clientes ou impulsionar vendas.'
            }
            action={
              !hasFilters && (
                <NxButton icon={Plus} onClick={() => router.push('/vendedor/cupons/criar')}>
                  Criar primeiro cupom
                </NxButton>
              )
            }
          />
        )}
      </TableCard>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir cupom"
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
