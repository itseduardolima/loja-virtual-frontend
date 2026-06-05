'use client'

import Link from 'next/link'
import { ChevronLeft, Lock, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutHeaderProps {
  slug: string
  bagCount: number
}

export function CheckoutHeader({ slug, bagCount }: CheckoutHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-nxborder bg-white/95 backdrop-blur-[12px]">
      <div className="mx-auto flex h-full max-w-[1080px] items-center px-4 md:px-8">
        {/* Voltar */}
        <Link
          href={'/loja/' + slug}
          className="flex items-center gap-1 text-[13px] font-semibold text-nxi2 transition-colors hover:text-nxp"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Voltar</span>
        </Link>

        {/* Título central */}
        <div className="mx-auto flex items-center gap-2 text-[13px] font-bold text-nxi1">
          <Lock size={13} className="text-nxs" />
          Checkout seguro
        </div>

        {/* Sacola */}
        <div className="relative">
          <ShoppingBag size={19} className="text-nxi2" />
          {bagCount > 0 && (
            <span
              className={cn(
                'absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-nxp px-0.5 text-[9px] font-bold text-white',
              )}
            >
              {bagCount}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
