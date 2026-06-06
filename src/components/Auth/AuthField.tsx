import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Classes do input padrão das telas de auth — reusadas pelo AuthPasswordInput */
export function authInputClass(hasError: boolean) {
  return cn(
    'h-11 w-full rounded-xl border bg-white px-3.5 text-[14px] text-nxi1 transition-colors placeholder:text-nxi3 focus:outline-none focus:ring-2',
    hasError
      ? 'border-nxd focus:border-nxd focus:ring-nxd/15'
      : 'border-nxborder focus:border-nxp focus:ring-nxp/15',
  )
}

interface AuthFieldProps {
  id: string
  label: string
  error?: string | null
  /** Slot à direita do label (ex.: link "Esqueceu a senha?") */
  right?: ReactNode
  /** Input customizado (ex.: AuthPasswordInput, PhoneCountryInput) — substitui o input padrão */
  children?: ReactNode
  type?: string
  value?: string
  placeholder?: string
  autoComplete?: string
  maxLength?: number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export function AuthField({
  id,
  label,
  error,
  right,
  children,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  maxLength,
  onChange,
  onBlur,
}: AuthFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-bold text-nxi1">
          {label}
        </label>
        {right}
      </div>
      <div className="relative">
        {children ?? (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            className={authInputClass(!!error)}
          />
        )}
      </div>
      {error && (
        <p
          id={`${id}-err`}
          className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-nxd"
        >
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  )
}
