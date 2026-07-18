'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckRowProps {
  label: string
  checked: boolean
  onToggle: () => void
  /** slot opcional à direita (ex.: contagem da categoria) */
  right?: React.ReactNode
  /** cor hex opcional — ponto de cor ao lado do rótulo (grupo "Cor") */
  swatch?: string
}

/** Linha de checkbox usada nos grupos de filtro */
export function CheckRow({ label, checked, onToggle, right, swatch }: CheckRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full items-center gap-2.5 py-[7px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 rounded-md"
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors',
          checked ? 'border-store bg-store text-white' : 'border-nxborder bg-white',
        )}
      >
        {checked && <Check size={13} strokeWidth={3.4} />}
      </span>
      {swatch && (
        <span
          className="h-4 w-4 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
          style={{ background: swatch }}
        />
      )}
      <span className={cn('flex-1 text-[14px]', checked ? 'font-bold text-nxi1' : 'text-nxi2')}>
        {label}
      </span>
      {right != null && <span className="text-[13px] text-nxi3">{right}</span>}
    </button>
  )
}
