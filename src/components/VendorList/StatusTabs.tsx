'use client'

import { cn } from '@/lib/utils'

export interface StatusTab<T> {
  value: T
  label: string
  count?: number | null
}

interface StatusTabsProps<T> {
  tabs: StatusTab<T>[]
  active: T
  onChange: (value: T) => void
}

export function StatusTabs<T>({ tabs, active, onChange }: StatusTabsProps<T>) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-nxbg p-0.5">
      {tabs.map(({ value, label, count }) => {
        const isActive = active === value
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              isActive
                ? 'bg-white text-nxi1 shadow-[0_1px_2px_hsl(0_0%_0%/0.08)]'
                : 'text-nxi3 hover:text-nxi2',
            )}
          >
            {label}
            {count !== undefined && count !== null && (
              <span className={cn('text-[10.5px] font-bold', isActive ? 'text-nxp' : 'text-nxi3')}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
