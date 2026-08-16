'use client'

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StoreButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark'
export type StoreButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-[transform,filter,background,border-color] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none'

const VARIANTS: Record<StoreButtonVariant, string> = {
  primary: 'bg-store text-white shadow-[0_14px_30px_-12px_rgba(7,8,21,0.5)] hover:brightness-[1.05]',
  outline: 'border-[1.5px] border-store text-store-ink bg-transparent hover:bg-store/[0.06]',
  ghost: 'text-nxi2 hover:bg-nxbg',
  dark: 'bg-nxi1 text-white hover:brightness-110',
}

const SIZES: Record<StoreButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-[52px] px-7 text-[15px]',
}

/** Classe do botão-pill da vitrine — use em <Link>/<a> quando precisar de um link com aparência de botão. */
export function storeButtonClass(opts: { variant?: StoreButtonVariant; size?: StoreButtonSize } = {}) {
  const { variant = 'primary', size = 'md' } = opts
  return cn(BASE, VARIANTS[variant], SIZES[size])
}

interface StoreButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: StoreButtonVariant
  size?: StoreButtonSize
  loading?: boolean
}

/** Botão-pill padrão da vitrine (accent do lojista). Para links, use storeButtonClass em <Link>. */
export const StoreButton = forwardRef<HTMLButtonElement, StoreButtonProps>(function StoreButton(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(storeButtonClass({ variant, size }), className)}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
})
