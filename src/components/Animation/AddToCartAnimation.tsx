'use client'

import { useEffect } from 'react'
import { buildImageUrl } from '@/lib/utils'

interface AddToCartAnimationProps {
  imageUrl: string
  startElement: HTMLElement | null
  endElement: HTMLElement | null
  onComplete: () => void
}

export function AddToCartAnimation({
  imageUrl,
  startElement,
  endElement,
  onComplete
}: AddToCartAnimationProps) {
  useEffect(() => {
    if (!startElement || !endElement) {
      onComplete()
      return
    }

    // Obter posições dos elementos
    const startRect = startElement.getBoundingClientRect()
    const endRect = endElement.getBoundingClientRect()

    // Calcular posições centrais
    const startX = startRect.left + startRect.width / 2
    const startY = startRect.top + startRect.height / 2
    const endX = endRect.left + endRect.width / 2
    const endY = endRect.top + endRect.height / 2

    // Criar elemento de animação
    const animationElement = document.createElement('div')
    animationElement.style.position = 'fixed'
    animationElement.style.left = `${startX}px`
    animationElement.style.top = `${startY}px`
    animationElement.style.width = '60px'
    animationElement.style.height = '60px'
    animationElement.style.zIndex = '9999'
    animationElement.style.pointerEvents = 'none'
    animationElement.style.borderRadius = '8px'
    animationElement.style.overflow = 'hidden'
    animationElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
    animationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    animationElement.style.transform = 'translate(-50%, -50%) scale(1)'

    // Criar imagem dentro do elemento
    const img = document.createElement('img')
    img.src = buildImageUrl(imageUrl)
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'cover'
    animationElement.appendChild(img)

    document.body.appendChild(animationElement)

    // Forçar reflow para garantir que o elemento seja renderizado
    void animationElement.offsetWidth

    // Iniciar animação
    requestAnimationFrame(() => {
      animationElement.style.left = `${endX}px`
      animationElement.style.top = `${endY}px`
      animationElement.style.transform = 'translate(-50%, -50%) scale(0.3)'
      animationElement.style.opacity = '0.8'
    })

    // Limpar após animação
    const timeout = setTimeout(() => {
      if (document.body.contains(animationElement)) {
        document.body.removeChild(animationElement)
      }
      onComplete()
    }, 600)

    return () => {
      clearTimeout(timeout)
      if (document.body.contains(animationElement)) {
        document.body.removeChild(animationElement)
      }
    }
  }, [startElement, endElement, imageUrl, onComplete])

  return null
}

