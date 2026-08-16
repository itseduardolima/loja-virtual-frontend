'use client'

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type StoreIconButtonVariant = 'ghost' | 'surface' | 'dark' | 'accent'

const VARIANTS: Record<StoreIconButtonVariant, string> = {
  ghost: 'bg-transparent text-nxi1 hover:bg-nxbg',
  surface: 'bg-white/90 text-nxi2 shadow-sm backdrop-blur hover:text-nxi1',
  dark: 'bg-nxi1 text-white hover:brightness-110',
  /** cor de marca do lojista (brand_color) — sacola, CTAs principais do header */
  accent: 'bg-store text-white hover:brightness-110',
}

interface StoreIconButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: StoreIconButtonVariant
  /** obrigatório — botão só de ícone precisa de rótulo acessível */
  'aria-label': string
}

/** Botão de ícone com alvo de toque 44px e focus ring — header, cards, carrosséis. */
export const StoreIconButton = forwardRef<HTMLButtonElement, StoreIconButtonProps>(
  function StoreIconButton({ variant = 'ghost', className, children, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-[background,filter,color] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    )
  },
)
