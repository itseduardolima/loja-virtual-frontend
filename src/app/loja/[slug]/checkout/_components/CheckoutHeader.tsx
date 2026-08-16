'use client'

import Link from 'next/link'
import { ChevronLeft, Lock, ShoppingBag } from 'lucide-react'
import { getStoreMonogram } from '@/lib/storefront'

interface CheckoutHeaderProps {
  slug: string
  bagCount: number
  storeName?: string | null
}

export function CheckoutHeader({ slug, bagCount, storeName }: CheckoutHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-nxborder bg-white/95 backdrop-blur-[12px]">
      <div className="mx-auto flex h-full max-w-[1080px] items-center gap-3 px-4 md:px-8">
        {/* marca da loja — a tela de maior confiança é da loja, não da plataforma */}
        <Link href={'/loja/' + slug} className="flex items-center gap-2.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-store pt-0.5 font-integral text-[14px] text-white">
            {getStoreMonogram(storeName)}
          </span>
          {storeName && (
            <span className="hidden text-[14.5px] font-extrabold text-nxi1 sm:inline">
              {storeName}
            </span>
          )}
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-store/[0.08] px-2.5 py-1.5 text-[11px] font-bold text-store-ink">
          <Lock size={11} strokeWidth={2.6} />
          <span className="hidden sm:inline">Checkout seguro</span>
        </span>

        {/* voltar */}
        <Link
          href={'/loja/' + slug}
          className="ml-auto flex min-h-[44px] items-center gap-1.5 rounded text-[13px] font-semibold text-nxi2 transition-colors hover:text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store"
        >
          <ChevronLeft size={17} />
          <span className="hidden sm:inline">Voltar à loja</span>
          <span className="relative">
            <ShoppingBag size={18} />
            {bagCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-store px-0.5 text-[9px] font-bold text-white">
                {bagCount}
              </span>
            )}
          </span>
        </Link>
      </div>
    </header>
  )
}
