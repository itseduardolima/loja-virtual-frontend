'use client'

import type { StoreInfo } from '@/types/store'
import { announcementText } from '@/lib/storefront'

interface AnnouncementBarProps {
  /** Loja — o texto vem do override do vendedor ou do frete grátis derivado. */
  storeInfo?: StoreInfo | null
  onDismiss: () => void
}

export function AnnouncementBar({ storeInfo, onDismiss }: AnnouncementBarProps) {
  const text = announcementText(storeInfo)
  if (!text) return null

  return (
    <div className="relative flex h-9 flex-shrink-0 items-center justify-center bg-nxp">
      <p className="px-10 text-center text-[11px] tracking-[.06em] text-white">{text}</p>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-1 text-lg leading-none text-white/40 transition-colors hover:text-white/80"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}
