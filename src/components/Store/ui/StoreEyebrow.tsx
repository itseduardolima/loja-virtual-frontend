import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type StoreEyebrowTone = 'accent' | 'muted' | 'onDark'

const TONES: Record<StoreEyebrowTone, string> = {
  accent: 'text-store-ink',
  muted: 'text-nxi3',
  onDark: 'text-white/60',
}

interface StoreEyebrowProps extends ComponentPropsWithoutRef<'span'> {
  tone?: StoreEyebrowTone
}

/** Micro-label editorial (mono uppercase) — a assinatura tipográfica da vitrine. */
export function StoreEyebrow({ tone = 'accent', className, children, ...rest }: StoreEyebrowProps) {
  return (
    <span
      className={cn(
        'block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[12px]',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
