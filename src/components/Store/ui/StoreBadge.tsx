import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type StoreBadgeTone = 'promo' | 'new' | 'neutral' | 'dark' | 'accent'

const TONES: Record<StoreBadgeTone, string> = {
  promo: 'bg-nxd text-white',
  new: 'bg-store text-white',
  accent: 'bg-store text-white',
  neutral: 'bg-white text-store-ink',
  dark: 'bg-nxi1 text-white',
}

interface StoreBadgeProps extends ComponentPropsWithoutRef<'span'> {
  tone?: StoreBadgeTone
}

/** Selo/pílula (promo, novo, mais vendido, etc.) na voz mono da vitrine. */
export function StoreBadge({ tone = 'neutral', className, children, ...rest }: StoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
