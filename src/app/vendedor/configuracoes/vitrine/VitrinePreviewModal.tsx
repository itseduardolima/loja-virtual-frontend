'use client'

import * as React from 'react'
import { Eye, Lock, Search, ShoppingBag, X } from 'lucide-react'
import type { StoreInfo } from '@/types/store'
import { AnnouncementBar } from '@/components/Store/AnnouncementBar'
import { StoreHomeHero } from '@/components/Store/StoreHomeHero'
import { StoreMarquee } from '@/components/Store/StoreMarquee'
import { StoreFeatureBanner } from '@/components/Store/StoreFeatureBanner'
import { marqueeItems, getStoreMonogram } from '@/lib/storefront'

interface VitrinePreviewModalProps {
  open: boolean
  onClose: () => void
  storeInfo: StoreInfo
}

const noop = () => {}

export function VitrinePreviewModal({ open, onClose, storeInfo }: VitrinePreviewModalProps) {
  React.useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const slug = storeInfo.slug || 'minha-loja'
  const monogram = getStoreMonogram(storeInfo.name)

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-nxi1/55 backdrop-blur-sm nx-fade"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pré-visualização da vitrine"
    >
      {/* chrome do browser */}
      <div
        className="mx-auto mt-3 w-full max-w-[1080px] px-3"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-nxborder bg-white px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg bg-nxbg px-3 py-1.5 text-[12px] text-nxi3">
            <Lock size={12} className="text-nxs" />
            <span className="truncate">{slug}.nexo.com.br</span>
            <span className="ml-auto rounded-full bg-nxa px-2 py-0.5 text-[10px] font-bold text-white">
              Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-nxi2 transition-colors hover:bg-nxbg"
            title="Fechar (Esc)"
            aria-label="Fechar pré-visualização"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* página rolável */}
      <div
        className="mx-auto w-full max-w-[1080px] flex-1 overflow-y-auto px-3 pb-6 scrollbar-thin"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-nxborder bg-white">

          {/* announcement bar */}
          <AnnouncementBar storeInfo={storeInfo} onDismiss={noop} />

          {/* header simplificado */}
          <div className="flex items-center gap-3 border-b border-nxborder px-5 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-nxp text-[13px] font-extrabold text-white">
              {monogram}
            </div>
            <span className="font-integral text-[15px] uppercase tracking-[0.04em] text-nxi1">
              {storeInfo.name}
            </span>
            <div className="ml-auto flex items-center gap-3 text-nxi2">
              <Search size={16} />
              <ShoppingBag size={16} />
            </div>
          </div>

          {/* hero */}
          <StoreHomeHero
            storeInfo={storeInfo}
            showcase={null}
            onOpenProduct={noop}
            onExplore={noop}
            onNovidades={noop}
          />

          {/* marquee */}
          <StoreMarquee items={marqueeItems(storeInfo)} />

          {/* feature banner de campanha */}
          <StoreFeatureBanner storeInfo={storeInfo} onExplore={noop} />

          {/* seções de produtos — indicativo estático */}
          <div className="mx-auto max-w-[1180px] px-4 py-10 md:px-10">
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-nxborder bg-nxbg/60 p-6 text-center">
              <div className="mx-auto">
                <p className="text-[13px] font-bold text-nxi2">Coleção, novidades e ofertas</p>
                <p className="mt-1 text-[12px] text-nxi3">
                  Os produtos aparecem aqui na loja pública, com base no catálogo real.
                </p>
              </div>
            </div>
          </div>

          {/* rodapé */}
          <div className="flex items-center justify-center gap-2 border-t border-nxborder bg-nxbg/50 px-5 py-4 text-[11.5px] text-nxi3">
            <Eye size={13} /> Esta é uma pré-visualização — nada foi publicado.{' '}
            <button type="button" onClick={onClose} className="font-semibold text-nxp underline">
              Voltar a editar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
