'use client'

import * as React from 'react'
import { Lock, Search, ShoppingBag } from 'lucide-react'
import type { StoreInfo } from '@/types/store'
import { AnnouncementBar, StoreHomeHero, StoreMarquee } from '@/components/Store'
import { marqueeItems, getStoreMonogram, storeAccentStyle } from '@/lib/storefront'

/** Largura de design do preview — a vitrine real é renderizada nessa largura e
 *  escalada para caber no painel (preview desktop fiel, porém compacto). */
const DESIGN_W = 1200
const noop = () => {}

interface VitrinePreviewPanelProps {
  storeInfo: StoreInfo
}

/**
 * Preview ao vivo da vitrine (não-modal). Renderiza a loja pública em DESIGN_W e
 * aplica transform:scale para caber na coluna, refletindo em tempo real o
 * conteúdo e o accent (brand_color) editados ao lado.
 *
 * A largura é medida em `wrapRef` (sem scrollbar interna → estável) e o recálculo
 * roda em requestAnimationFrame, evitando o loop de ResizeObserver que causava
 * "tremor". O container não rola por dentro (altura = conteúdo escalado).
 */
export function VitrinePreviewPanel({ storeInfo }: VitrinePreviewPanelProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0.55)
  const [contentH, setContentH] = React.useState(0)

  React.useLayoutEffect(() => {
    const wrap = wrapRef.current
    const content = contentRef.current
    if (!wrap || !content) return

    let raf = 0
    const measure = () => {
      const w = wrap.clientWidth
      if (w <= 0) return
      const s = Math.min(1, w / DESIGN_W)
      setScale(s)
      setContentH(Math.round(content.scrollHeight * s))
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    measure()
    const ro = new ResizeObserver(schedule)
    ro.observe(wrap)
    ro.observe(content)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [storeInfo])

  const monogram = getStoreMonogram(storeInfo.name)
  const slug = storeInfo.slug || 'minha-loja'

  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      {/* chrome do browser */}
      <div className="flex items-center gap-2 border-b border-nxborder bg-nxbg/60 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-nxi3 ring-1 ring-inset ring-nxborder">
          <Lock size={11} className="shrink-0 text-nxs" />
          <span className="truncate">
            {process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '')}/loja/{slug}
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-nxs/[0.12] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-nxs">
          <span className="h-1.5 w-1.5 rounded-full bg-nxs" /> Ao vivo
        </span>
      </div>

      {/* viewport escalado — sem scroll interno (altura = conteúdo escalado) */}
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden bg-white"
        style={{ height: contentH || 480 }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: DESIGN_W,
            transform: `scale(${scale})`,
            ...storeAccentStyle(storeInfo),
          }}
        >
          <AnnouncementBar storeInfo={storeInfo} onDismiss={noop} />

          {/* header simplificado */}
          <div className="flex items-center gap-3 border-b border-nxborder px-6 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-store text-[14px] font-extrabold text-white">
              {monogram}
            </div>
            <span className="font-integral text-[16px] uppercase tracking-[0.04em] text-nxi1">
              {storeInfo.name}
            </span>
            <div className="ml-auto flex items-center gap-4 text-nxi2">
              <Search size={18} />
              <ShoppingBag size={18} />
            </div>
          </div>

          <StoreHomeHero
            storeInfo={storeInfo}
            showcase={null}
            onOpenProduct={noop}
            onExplore={noop}
            onNovidades={noop}
          />

          <StoreMarquee items={marqueeItems(storeInfo)} />

          {/* seções de produtos — indicativo estático (o catálogo real aparece na loja) */}
          <div className="mx-auto max-w-store px-10 py-12">
            <div className="rounded-2xl border border-dashed border-nxborder bg-nxbg/60 p-8 text-center">
              <p className="text-[15px] font-bold text-nxi2">Coleção, novidades e ofertas</p>
              <p className="mt-1.5 text-[13px] text-nxi3">
                Os produtos aparecem aqui na loja pública, com base no seu catálogo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
