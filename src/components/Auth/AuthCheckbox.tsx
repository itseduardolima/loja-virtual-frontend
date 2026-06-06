'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthCheckboxProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}

export function AuthCheckbox({ checked, onChange, label }: AuthCheckboxProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-nxi2">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
          checked ? 'border-nxp bg-nxp text-white' : 'border-nxi3/50',
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </button>
      {label}
    </label>
  )
}
