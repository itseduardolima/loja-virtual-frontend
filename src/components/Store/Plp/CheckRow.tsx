'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckRowProps {
  label: string
  checked: boolean
  onToggle: () => void
  /** slot opcional à direita (ex.: contagem da categoria) */
  right?: React.ReactNode
}

/** Linha de checkbox usada nos grupos de filtro */
export function CheckRow({ label, checked, onToggle, right }: CheckRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 py-1.5 text-left"
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors',
          checked ? 'border-nxp bg-nxp text-white' : 'border-nxi3/50',
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <span className={cn('flex-1 text-[13px]', checked ? 'font-semibold text-nxi1' : 'text-nxi2')}>
        {label}
      </span>
      {right != null && <span className="text-[11px] text-nxi3">{right}</span>}
    </button>
  )
}
