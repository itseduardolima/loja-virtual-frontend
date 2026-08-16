'use client'

import { X } from 'lucide-react'
import type { StoreInfo } from '@/types/store'
import { announcementText } from '@/lib/storefront'
import { StoreEyebrow } from '@/components/Store/ui'

interface AnnouncementBarProps {
  /** Loja — o texto vem do override do vendedor ou do frete grátis derivado. */
  storeInfo?: StoreInfo | null
  onDismiss: () => void
}

export function AnnouncementBar({ storeInfo, onDismiss }: AnnouncementBarProps) {
  const text = announcementText(storeInfo)
  if (!text) return null

  return (
    <div className="relative flex flex-shrink-0 items-center justify-center bg-store-ink px-14 py-2.5">
      <StoreEyebrow
        tone="onDark"
        className="text-center font-normal tracking-[0.14em] text-white sm:text-xs"
      >
        {text}
      </StoreEyebrow>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar aviso"
        className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-store-ink"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
