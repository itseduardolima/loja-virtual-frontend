import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: number
  icon: React.ElementType
  iconCls: string
}

export function KpiCard({ label, value, icon: Icon, iconCls }: KpiCardProps) {
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
