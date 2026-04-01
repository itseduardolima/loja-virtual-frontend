'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, ZoomIn } from 'lucide-react'

interface ProductImageZoomProps {
  src: string
  alt: string
}

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [transformOrigin, setTransformOrigin] = useState('center center')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTransformOrigin(`${x}% ${y}%`)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false)
    setTransformOrigin('center center')
  }, [])

  const handleClick = useCallback(() => {
    // Mobile: abre modal
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsModalOpen(true)
    }
  }, [])

  return (
    <>
      {/* Container com zoom no hover (desktop) */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-2xl cursor-zoom-in lg:cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label={`Imagem do produto: ${alt}`}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
            transformOrigin,
            transition: 'transform 0.2s ease',
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain select-none"
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        {/* Ícone de zoom hint (mobile) */}
        <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-1.5 lg:hidden pointer-events-none">
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </div>
      </div>

      {/* Modal de tela cheia (mobile) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-sm w-full p-0 bg-black border-0 rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="relative w-full aspect-square">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
