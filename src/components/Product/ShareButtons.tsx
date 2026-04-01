'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

interface ShareButtonsProps {
  className?: string
}

export function ShareButtons({ className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleWhatsApp = useCallback(() => {
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(`Veja este produto: ${window.location.href}`)
    window.open(`https://wa.me/?text=${url}`, '_blank', 'noopener,noreferrer')
  }, [])

  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback para navegadores sem suporte a clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = window.location.href
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignora
      }
      document.body.removeChild(textarea)
    }
  }, [])

  return (
    <div className={cn('flex items-center gap-2 justify-end', className)}>
      <button
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        aria-label="Compartilhar no WhatsApp"
      >
        <WhatsappIcon />
        WhatsApp
      </button>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        aria-label="Copiar link do produto"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-700">Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copiar link
          </>
        )}
      </button>
    </div>
  )
}
