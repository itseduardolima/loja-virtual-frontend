'use client'

// Inputs nx-styled do fluxo "Criar/Editar Produto".
// Espelham Input/Textarea/SelectNative de
// /tmp/nexo-design/nexo-criar-produto/project/ui.jsx (h-10, rounded-lg, text-base md:text-[13px],
// suporte a prefix/suffix/error). O Input/Textarea/Select shadcn têm dimensões
// próprias (h-12, rounded-xl, text-base md:text-[13px]) que não batem com este protótipo, então
// estes primitivos vivem junto às seções e usam <input>/<textarea>/<select> nativos.
import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function nxInputClass(error?: boolean) {
  return cn(
    'h-10 w-full rounded-lg border bg-white px-3 py-2 text-base md:text-[13px] text-nxi1 transition-colors',
    'placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30',
    error ? 'border-nxd focus-visible:border-nxd' : 'border-nxborder focus-visible:border-nxp',
  )
}

export interface NxInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix'
> {
  error?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const NxInput = React.forwardRef<HTMLInputElement, NxInputProps>(
  ({ error, prefix, suffix, className, ...rest }, ref) => {
    if (prefix || suffix) {
      return (
        <div
          className={cn(
            'flex h-10 items-center rounded-lg border bg-white transition-colors focus-within:ring-2 focus-within:ring-nxp/30',
            error ? 'border-nxd' : 'border-nxborder focus-within:border-nxp',
          )}
        >
          {prefix && (
            <span className="pl-3 pr-1 text-base md:text-[13px] font-semibold text-nxi3">{prefix}</span>
          )}
          <input
            ref={ref}
            {...rest}
            className={cn(
              'h-full w-full bg-transparent px-3 text-base md:text-[13px] text-nxi1 placeholder:text-nxi3 focus:outline-none',
              prefix && 'pl-1',
              className,
            )}
          />
          {suffix && <span className="pl-1 pr-3 text-[12px] font-medium text-nxi3">{suffix}</span>}
        </div>
      )
    }
    return <input ref={ref} {...rest} className={cn(nxInputClass(error), className)} />
  },
)
NxInput.displayName = 'NxInput'

export interface NxTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const NxTextarea = React.forwardRef<HTMLTextAreaElement, NxTextareaProps>(
  ({ error, rows = 3, className, ...rest }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      className={cn(
        'w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-base md:text-[13px] leading-relaxed text-nxi1 transition-colors',
        'placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30',
        error ? 'border-nxd' : 'border-nxborder focus-visible:border-nxp',
        className,
      )}
    />
  ),
)
NxTextarea.displayName = 'NxTextarea'

type NxSelectOption = string | { value: string | number; label: string }

export function NxSelectNative({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: NxSelectOption[]
  placeholder?: string
  error?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          nxInputClass(error),
          'appearance-none pr-9',
          !value && 'text-nxi3',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o} className="text-nxi1">
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value} className="text-nxi1">
              {o.label}
            </option>
          ),
        )}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-nxi3"
      />
    </div>
  )
}
