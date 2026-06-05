import { cn } from '@/lib/utils'

interface UsesCellProps {
  used: number
  max: number | null
}

export function UsesCell({ used, max }: UsesCellProps) {
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
