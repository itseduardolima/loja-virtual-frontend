import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TypeChip } from './TypeChip'
import { StatusBadge } from './StatusBadge'
import { UsesCell } from './UsesCell'
import { ValidityCell } from './ValidityCell'
import { getStatus, durationLabel, CYCLE_LABEL } from '../useAdminPlanCouponsPage'
import type { AdminPlanCoupon } from '@/types/admin'

interface CouponRowProps {
  coupon: AdminPlanCoupon
  onEdit: () => void
  onDelete: () => void
}

export function CouponRow({ coupon, onEdit, onDelete }: CouponRowProps) {
  const status = getStatus(coupon)
  const valueStr = coupon.discount_type === 'percent'
    ? `${Number(coupon.discount_value)}%`
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(coupon.discount_value))
  const plansLabel = coupon.plans.length === 0
    ? 'Todos'
    : coupon.plans.map(p => p.plan.name).join(', ')

  return (
    <tr className="border-t border-[#F0F1F5] transition-colors hover:bg-[#FAFAFE]">
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
