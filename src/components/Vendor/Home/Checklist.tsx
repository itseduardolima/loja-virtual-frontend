'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface CheckItem {
  id: string
  text: string
  done: boolean
  cta?: string
  href?: string
  primary?: boolean
}

interface ChecklistProps {
  items: CheckItem[]
}

export function Checklist({ items }: ChecklistProps) {
  const router = useRouter()
  const done = items.filter((i) => i.done).length

  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="flex items-start justify-between border-b border-nxborder px-[18px] pt-4 pb-3">
        <div>
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">Próximas ações</h3>
          <p className="mt-0.5 text-sm text-nxi3">Conclua para deixar sua loja pronta para vender</p>
        </div>
        <span className="text-[11px] font-semibold tracking-[0.02em] text-nxi3 tabular-nums">
          {done} / {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-3 pt-2 pb-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5 rounded-[10px] px-2 py-2.5">
            <div
              className={cn(
                'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] text-white',
                item.done ? 'bg-nxs' : 'border-2 border-nxborder bg-transparent',
              )}
            >
              {item.done && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m4 12 5 5L20 6" />
                </svg>
              )}
            </div>

            <span
              className={cn(
                'flex-1 text-sm',
                item.done ? 'font-normal text-nxi3 line-through' : 'font-medium text-nxi1',
              )}
            >
              {item.text}
            </span>

            {!item.done && item.cta && item.href && (
              <button
                onClick={() => router.push(item.href!)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold',
                  item.primary
                    ? 'bg-nxp text-white hover:bg-nxp/90'
                    : 'border border-nxborder bg-white text-nxi2 hover:border-nxp hover:text-nxp',
                )}
              >
                {item.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
