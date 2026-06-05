import { cn } from '@/lib/utils'
import { COUPON_STATUS } from '@/lib/vendor'
import type { StatusTone } from '@/lib/vendor'
import type { DisplayStatus } from '../useAdminPlanCouponsPage'

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

interface StatusBadgeProps {
  status: DisplayStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, cls } = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
