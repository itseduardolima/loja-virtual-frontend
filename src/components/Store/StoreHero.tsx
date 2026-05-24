'use client'

import { useState } from 'react'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'

interface StoreHeroProps {
  banner?: string | null
  name?: string | null
  onVerColecao?: () => void
  onNovidades?: () => void
}

export function StoreHero({ banner, name, onVerColecao, onNovidades }: StoreHeroProps) {
  const [shimmer, setShimmer] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const year = new Date().getFullYear()

  return (
    <>
      {/* ── MOBILE hero — compact text block, no banner ── */}
      <div className="md:hidden w-full bg-[#f7f3ef] px-5 pt-8 pb-7 flex flex-col">

        {/* Store name */}
        <h1
          className="font-bold text-[#1a100a] tracking-[-0.03em] leading-[1] mb-5"
          style={{ fontSize: 'clamp(38px, 10vw, 56px)' }}
        >
          {name ?? ''}
        </h1>

        {/* Divider */}
        <div className="w-full h-px bg-[#e0d8d0] mb-5" />

        {/* CTAs */}
        <div className="flex items-center gap-6">
          <button
            onClick={onVerColecao}
            className="bg-transparent border-none text-[11px] font-semibold text-[#1a100a] tracking-[.12em] uppercase pb-[2px] border-b border-[#1a100a]/40 hover:border-[#1a100a] transition-colors cursor-pointer"
          >
            Ver Coleção →
          </button>
          <button
            onClick={onNovidades}
            className="bg-transparent border-none text-[11px] font-semibold text-[#a89888] tracking-[.12em] uppercase pb-[2px] border-b border-[#a89888]/40 hover:text-[#1a100a] hover:border-[#1a100a]/40 transition-colors cursor-pointer"
          >
            Novidades
          </button>
        </div>
      </div>

      {/* ── DESKTOP hero — full banner ── */}
      <div className="hidden md:block relative w-full h-[520px] overflow-hidden bg-[#1a100a]">
        {/* Shimmer */}
        {shimmer && (
          <div className="absolute inset-0 bg-[#ede8e3] animate-pulse z-10 transition-opacity duration-500" />
        )}

        {/* Banner image or fallback gradient */}
        {banner ? (
          <Image
            src={buildImageUrl(banner)}
            alt={name ?? 'Banner da loja'}
            fill
            className="object-cover"
            priority
            quality={100}
            onLoad={() => {
              setShimmer(false)
              setLoaded(true)
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5ede3] via-[#b99878] to-[#180c06]" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.72)_100%)]" />

        {/* Content — only after image loaded (or no banner) */}
        {(loaded || !banner) && (
          <>
            {/* Top metadata row */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 pt-5 pointer-events-none">
              <span className="font-mono text-[9px] tracking-[.2em] uppercase text-white/[22%] whitespace-nowrap">
                {name ?? ''}
              </span>
              <span className="font-mono text-[9px] tracking-[.2em] uppercase text-white/[22%] whitespace-nowrap">
                {year}
              </span>
            </div>

            {/* Left vertical rule */}
            <div className="absolute top-[20%] bottom-[20%] left-7 w-px bg-white/[14%] rounded-full pointer-events-none" />

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 px-10 pb-11 flex items-end justify-between gap-8">
              <div className="hero-title-reveal">
                <h1
                  className="font-bold text-white tracking-[-0.03em] leading-[0.96]"
                  style={{ fontSize: 'clamp(56px, 7.2vw, 96px)' }}
                >
                  {name ?? ''}
                </h1>
              </div>

              <div className="hero-ctas-reveal flex flex-col items-end gap-3.5 pb-1 flex-shrink-0">
                <button
                  onClick={onVerColecao}
                  className="bg-transparent border-none text-[11px] font-semibold text-white tracking-[.12em] uppercase pb-[3px] border-b border-white/30 hover:border-white transition-colors cursor-pointer"
                >
                  Ver Coleção →
                </button>
                <button
                  onClick={onNovidades}
                  className="bg-transparent border-none text-[11px] font-semibold text-white/45 tracking-[.12em] uppercase pb-[3px] border-b border-white/20 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
                >
                  Novidades
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
