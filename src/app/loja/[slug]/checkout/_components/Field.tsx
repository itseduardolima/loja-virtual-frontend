'use client'

import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  counter?: string
  children: React.ReactNode
}

export function Field({ label, required, error, hint, counter, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[12.5px] font-semibold text-nxi2">
          {label}
          {required && <span className="text-nxa"> *</span>}
        </label>
        {counter != null && <span className="text-[11px] text-nxi3">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p className="mt-1 text-[11.5px] font-semibold text-nxd">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11.5px] text-nxi3">{hint}</p>
      ) : null}
    </div>
  )
}

export function inputCls(err?: boolean): string {
  return cn(
    'h-11 w-full rounded-xl border bg-white px-3.5 text-[13.5px] text-nxi1 transition-colors placeholder:text-nxi3 focus:outline-none focus:ring-2 focus:ring-store/25',
    err ? 'border-nxd' : 'border-nxborder hover:border-nxi3 focus:border-store',
  )
}
