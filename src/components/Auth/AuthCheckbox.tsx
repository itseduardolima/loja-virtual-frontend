'use client'

import type { ReactNode } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthCheckboxProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: ReactNode
  error?: string | null
}

export function AuthCheckbox({ checked, onChange, label, error }: AuthCheckboxProps) {
  return (
    <div>
      <label className="flex cursor-pointer select-none items-start gap-2 text-[13px] leading-relaxed text-nxi2">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-invalid={!!error}
          onClick={() => onChange(!checked)}
          className={cn(
            'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
            checked ? 'border-nxp bg-nxp text-white' : error ? 'border-nxd' : 'border-nxi3/50',
          )}
        >
          {checked && <Check size={11} strokeWidth={3} />}
        </button>
        {label}
      </label>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-nxd">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  )
}
