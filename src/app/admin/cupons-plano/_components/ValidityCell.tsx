import { cn, daysUntil } from '@/lib/utils'
import { fmtDateShortMonth } from '../useAdminPlanCouponsPage'

interface ValidityCellProps {
  expires_at: string | null
}

export function ValidityCell({ expires_at }: ValidityCellProps) {
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
      <div className="text-[12.5px] text-nxi1">{fmtDateShortMonth(expires_at)}</div>
      <div className={cn(
        'mt-0.5 font-mono text-[11px]',
        expired ? 'text-red-500' : warn ? 'text-amber-600' : 'text-nxi3',
      )}>
        {expired ? 'Expirado' : `${days} dia${days !== 1 ? 's' : ''}`}
      </div>
    </div>
  )
}
