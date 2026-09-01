'use client'

// Primitivos de UI do fluxo "Criar/Editar Produto".
// Espelha /tmp/nexo-design/nexo-criar-produto/project/ui.jsx — classes Tailwind
// idênticas onde possível, trocando o <Icon name> do protótipo por componentes
// lucide-react passados como prop.
import * as React from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Info,
  Loader2,
  Minus,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { colorLuma } from './data'

// ── Card / Section ───────────────────────────────────────────────────────────
export function SectionCard({
  children,
  className,
  id,
  flush,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  flush?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] scroll-mt-24',
        !flush && 'p-5 md:p-6',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  icon: IconCmp,
  title,
  description,
  right,
}: {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {IconCmp && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxp/[0.08] text-nxp">
            <IconCmp size={18} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="m-0 flex items-center gap-2 text-base font-bold tracking-[-0.01em] text-nxi1">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-[13px] leading-[1.5] text-nxi2">{description}</p>
          )}
        </div>
      </div>
      {right}
    </div>
  )
}

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

export function FieldLabel({
  htmlFor,
  required,
  children,
  className,
  hint,
}: {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  hint?: string
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
      {hint && (
        <NxTooltip text={hint}>
          <Info size={12.5} className="text-nxi3" />
        </NxTooltip>
      )}
    </label>
  )
}

export function FieldHelp({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'error' | 'ok'
}) {
  const map: Record<string, string> = {
    default: 'text-nxi3',
    error: 'text-nxd font-semibold',
    ok: 'text-nxs font-semibold',
  }
  const Ic = variant === 'error' ? AlertCircle : variant === 'ok' ? Check : null
  return (
    <span className={cn('flex items-center gap-1 text-[11.5px] leading-snug', map[variant])}>
      {Ic && <Ic size={11} strokeWidth={2.5} />}
      {children}
    </span>
  )
}

export function Notice({
  variant = 'info',
  children,
  className,
  icon,
}: {
  variant?: 'info' | 'amber' | 'error' | 'success'
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
}) {
  const palette = {
    info: { wrap: 'bg-nxp/[0.06] border-nxp/15 text-nxi1', icon: 'text-nxp', Ic: Info },
    amber: { wrap: 'bg-nxw/[0.10] border-nxw/25 text-nxi1', icon: 'text-nxw', Ic: AlertTriangle },
    error: { wrap: 'bg-nxd/[0.07] border-nxd/20 text-nxi1', icon: 'text-nxd', Ic: AlertCircle },
    success: { wrap: 'bg-nxs/[0.08] border-nxs/20 text-nxi1', icon: 'text-nxs', Ic: CheckCircle2 },
  }[variant]
  const Ic = icon || palette.Ic
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed',
        palette.wrap,
        className,
      )}
    >
      <Ic size={16} className={cn('mt-0.5 shrink-0', palette.icon)} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// ── Toggle row (usa Switch shadcn estilizado para nx*) ───────────────────────
export function ToggleRow({
  on,
  onChange,
  title,
  desc,
  badge,
  children,
  icon: IconCmp,
}: {
  on: boolean
  onChange: (v: boolean) => void
  title: React.ReactNode
  desc?: React.ReactNode
  badge?: React.ReactNode
  children?: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <div>
      <div
        className={cn(
          'flex items-start justify-between gap-4 px-5 py-4 transition-colors',
          on && 'bg-nxp/[0.04]',
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {IconCmp && (
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-nxi3/10 text-nxi2">
              <IconCmp size={16} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-[15px] font-bold tracking-[-0.01em] text-nxi1">{title}</h4>
              {badge && (
                <span className="rounded-full bg-nxs/[0.12] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
                  {badge}
                </span>
              )}
            </div>
            {desc && <p className="mt-1 text-[13px] leading-relaxed text-nxi2">{desc}</p>}
          </div>
        </div>
        <Switch
          checked={on}
          onCheckedChange={onChange}
          aria-label={typeof title === 'string' ? title : undefined}
          className="data-[state=checked]:bg-nxp data-[state=unchecked]:bg-nxborder focus-visible:ring-nxp/30"
        />
      </div>
      {on && children && <div className="border-t border-nxborder px-5 py-5">{children}</div>}
    </div>
  )
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function NxButton({
  variant = 'primary',
  type = 'button',
  disabled,
  loading,
  onClick,
  children,
  className,
  icon: IconCmp,
  size = 'md',
}: {
  variant?: 'primary' | 'accent' | 'ghost' | 'danger' | 'subtle'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
}) {
  const styles = {
    primary:
      'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)] hover:bg-nxp/90 disabled:bg-nxp/40 disabled:text-white/80',
    accent:
      'bg-nxa text-white shadow-[0_1px_2px_hsl(18_80%_54%/0.30)] hover:bg-nxa/90 disabled:bg-nxa/40',
    ghost:
      'border border-nxborder bg-white text-nxi2 hover:border-nxp/40 hover:text-nxp disabled:opacity-50',
    danger: 'border border-nxd/30 bg-white text-nxd hover:bg-nxd/[0.06] disabled:opacity-50',
    subtle: 'bg-nxi3/[0.10] text-nxi2 hover:bg-nxi3/[0.16] disabled:opacity-50',
  }[variant]
  const sz =
    size === 'lg'
      ? 'px-4 py-2.5 text-[14px]'
      : size === 'sm'
        ? 'px-2.5 py-1.5 text-[12px]'
        : 'px-3.5 py-2 text-[13px]'
  const iconSize = size === 'lg' ? 16 : 14
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed',
        sz,
        styles,
        className,
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : IconCmp ? (
        <IconCmp size={iconSize} />
      ) : null}
      {children}
    </button>
  )
}

// ── Radio pills (single) & Checkbox chips (multi) ───────────────────────────
export function RadioPills({
  value,
  onChange,
  options,
  error,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  error?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(on ? '' : o)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              on
                ? 'border-nxp bg-nxp/[0.08] text-nxp'
                : 'border-nxborder bg-white text-nxi2 hover:border-nxp/40 hover:text-nxp',
              error && !value && 'border-nxd/50',
            )}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function CheckChips({
  value = [],
  onChange,
  options,
}: {
  value: string[]
  onChange: (v: string[]) => void
  options: string[]
}) {
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              on
                ? 'border-nxp bg-nxp/[0.08] text-nxp'
                : 'border-nxborder bg-white text-nxi2 hover:border-nxp/40 hover:text-nxp',
            )}
          >
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border',
                on ? 'border-nxp bg-nxp text-white' : 'border-nxi3/50',
              )}
            >
              {on && <Check size={10} strokeWidth={3} />}
            </span>
            {o}
          </button>
        )
      })}
    </div>
  )
}

// ── Badge / chip ─────────────────────────────────────────────────────────────
export function NxBadge({
  tone = 'nxp',
  children,
  className,
  icon: IconCmp,
}: {
  tone?: 'nxp' | 'nxa' | 'nxs' | 'nxw' | 'nxd' | 'nxi3'
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
}) {
  const tones: Record<string, string> = {
    nxp: 'text-nxp bg-nxp/[0.08] ring-nxp/15',
    nxa: 'text-nxa bg-nxa/[0.10] ring-nxa/20',
    nxs: 'text-nxs bg-nxs/[0.10] ring-nxs/20',
    nxw: 'text-[#9a6a16] bg-nxw/[0.16] ring-nxw/30',
    nxd: 'text-nxd bg-nxd/[0.08] ring-nxd/20',
    nxi3: 'text-nxi2 bg-nxi3/[0.12] ring-nxi3/20',
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {IconCmp && <IconCmp size={11} />}
      {children}
    </span>
  )
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
export function NxTooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-1.5 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-nxi1 px-2.5 py-1.5 text-[11.5px] font-medium leading-snug text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  )
}

// ── Stepper number input ─────────────────────────────────────────────────────
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 999999,
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  className?: string
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, isNaN(v) ? 0 : v)))
  return (
    <div
      className={cn(
        'inline-flex h-9 items-stretch overflow-hidden rounded-lg border border-nxborder bg-white',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => set((value || 0) - 1)}
        className="flex w-8 items-center justify-center text-nxi3 transition-colors hover:bg-nxbg hover:text-nxp"
      >
        <Minus size={13} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
        className="w-12 border-x border-nxborder bg-transparent text-center text-[13px] font-semibold text-nxi1 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set((value || 0) + 1)}
        className="flex w-8 items-center justify-center text-nxi3 transition-colors hover:bg-nxbg hover:text-nxp"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

// ── Color swatch (círculo + ring para cores claras) ──────────────────────────
export function Swatch({
  hex,
  size = 18,
  selected,
  className,
}: {
  hex: string
  size?: number
  selected?: boolean
  className?: string
}) {
  const light = colorLuma(hex) > 0.82
  return (
    <span
      className={cn('inline-block shrink-0 rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: hex,
        boxShadow: light ? 'inset 0 0 0 1px hsl(220 14% 84%)' : 'none',
        outline: selected ? '2px solid hsl(var(--nxp))' : 'none',
        outlineOffset: 2,
      }}
    />
  )
}

export { ChevronDown }
