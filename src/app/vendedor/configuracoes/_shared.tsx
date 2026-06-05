'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, AlertTriangle, Check, Info, Loader2 } from 'lucide-react'

// ─── Section Card ────────────────────────────────────────────────────────────
// Mesmo estilo dos cards da home/dashboard: rounded-2xl, border nxborder, shadow sutil
export function SectionCard({
  children,
  className,
  flush,
}: {
  children: React.ReactNode
  className?: string
  /** se true, não aplica padding interno (use quando o card terá ToggleRow) */
  flush?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]',
        flush && 'overflow-hidden',
        !flush && 'p-5 md:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Section Header (within card) ────────────────────────────────────────────
export function SectionHeader({
  title,
  description,
  right,
}: {
  title: string
  description?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">{description}</p>
        )}
      </div>
      {right}
    </div>
  )
}

// ─── Field grid layouts ──────────────────────────────────────────────────────
export function FieldGrid({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}) {
  const cols =
    columns === 1
      ? 'grid-cols-1'
      : columns === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2'
  return <div className={cn('grid gap-4 md:gap-5', cols, className)}>{children}</div>
}

// ─── Field wrapper ───────────────────────────────────────────────────────────
export function Field({
  children,
  full,
  className,
}: {
  children: React.ReactNode
  full?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', full && 'md:col-span-full', className)}>
      {children}
    </div>
  )
}

// ─── Field label ─────────────────────────────────────────────────────────────
export function FieldLabel({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-center gap-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-nxi2',
        className,
      )}
    >
      {children}
      {required && <span className="text-nxa">*</span>}
    </label>
  )
}

// ─── Field help text ─────────────────────────────────────────────────────────
type FieldHelpVariant = 'default' | 'error' | 'ok' | 'checking'

export function FieldHelp({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: FieldHelpVariant
}) {
  const Icon =
    variant === 'error'
      ? AlertCircle
      : variant === 'ok'
        ? Check
        : variant === 'checking'
          ? Loader2
          : null
  const styles: Record<FieldHelpVariant, string> = {
    default: 'text-nxi3',
    error: 'text-nxd font-semibold',
    ok: 'text-nxs font-semibold',
    checking: 'text-nxi3',
  }
  return (
    <span
      className={cn('flex items-center gap-1 text-[11.5px] leading-snug', styles[variant])}
    >
      {Icon && (
        <Icon
          size={11}
          strokeWidth={2.5}
          className={variant === 'checking' ? 'animate-spin' : undefined}
        />
      )}
      {children}
    </span>
  )
}

// ─── Notice (info / warn / amber) ────────────────────────────────────────────
export function Notice({
  variant = 'info',
  children,
  className,
}: {
  variant?: 'info' | 'amber' | 'error'
  children: React.ReactNode
  className?: string
}) {
  const palette = {
    info: {
      wrap: 'bg-nxp/[0.06] border-nxp/15 text-nxi1',
      icon: 'text-nxp',
      Icon: Info,
    },
    amber: {
      wrap: 'bg-nxw/[0.10] border-nxw/25 text-nxi1',
      icon: 'text-nxw',
      Icon: AlertTriangle,
    },
    error: {
      wrap: 'bg-nxd/[0.07] border-nxd/20 text-nxi1',
      icon: 'text-nxd',
      Icon: AlertCircle,
    },
  }[variant]
  const Icon = palette.Icon
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed',
        palette.wrap,
        className,
      )}
    >
      <Icon size={16} strokeWidth={2} className={cn('mt-0.5 shrink-0', palette.icon)} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// ─── Switch (matches Nexo design language) ───────────────────────────────────
export function Switch({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-nxp/30 focus:ring-offset-2',
        checked ? 'bg-nxp' : 'bg-nxborder',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.15)] transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

// ─── Toggle row (used in cards with on/off) ──────────────────────────────────
export function ToggleRow({
  on,
  onChange,
  title,
  desc,
  badge,
  children,
}: {
  on: boolean
  onChange: (next: boolean) => void
  title: string
  desc?: string
  badge?: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <div
        className={cn(
          'flex items-start justify-between gap-4 px-5 py-4 transition-colors',
          on && 'bg-nxp/[0.04]',
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-bold tracking-[-0.01em] text-nxi1">{title}</h4>
            {badge && (
              <span className="rounded-full bg-nxp/[0.10] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxp">
                {badge}
              </span>
            )}
          </div>
          {desc && (
            <p className="mt-1 text-[13px] leading-relaxed text-nxi2">{desc}</p>
          )}
        </div>
        <Switch checked={on} onChange={onChange} ariaLabel={title} />
      </div>
      {on && children && (
        <div className="border-t border-nxborder px-5 py-4">{children}</div>
      )}
    </div>
  )
}

// ─── Form actions (Cancel / Save bar at bottom of form) ──────────────────────
export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-nxborder pt-4">
      {children}
    </div>
  )
}

// ─── Primary action button (matches Nexo CTA style) ──────────────────────────
export function NxButton({
  variant = 'primary',
  type = 'button',
  disabled,
  loading,
  onClick,
  children,
  className,
}: {
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}) {
  const styles: Record<'primary' | 'ghost' | 'danger', string> = {
    primary:
      'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)] hover:bg-nxp/90 disabled:bg-nxp/40 disabled:text-white/80',
    ghost:
      'border border-nxborder bg-white text-nxi2 hover:border-nxp/40 hover:text-nxp disabled:opacity-50',
    danger:
      'border border-nxd/30 bg-white text-nxd hover:bg-nxd/[0.06] disabled:opacity-50',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed',
        styles[variant],
        className,
      )}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  )
}

// ─── Standardized text input wrapper ─────────────────────────────────────────
// Use diretamente no <Input className={nxInputClass(error)}>  para alinhar
export function nxInputClass(error?: boolean) {
  return cn(
    'h-10 rounded-lg border px-3 py-2 text-[13px] text-nxi1 transition-colors',
    'placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30',
    error
      ? 'border-nxd focus-visible:border-nxd'
      : 'border-nxborder focus-visible:border-nxp',
  )
}
