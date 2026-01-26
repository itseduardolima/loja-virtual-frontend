import { useState, useCallback } from 'react'

interface AnimationData {
  imageUrl: string
  startElement: HTMLElement | null
  endElement: HTMLElement | null
}

interface UseAddToCartAnimationReturn {
  triggerAnimation: (imageUrl: string, startElementId: string) => void
  isAnimating: boolean
  animationData: AnimationData | null
  onAnimationComplete: () => void
}

export function useAddToCartAnimation(): UseAddToCartAnimationReturn {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationData, setAnimationData] = useState<AnimationData | null>(null)

  const triggerAnimation = useCallback((imageUrl: string, startElementId: string) => {
    const startElement = document.getElementById(startElementId)
    const endElement = document.getElementById('cart-icon-button')

    if (!startElement || !endElement) {
      return
    }

    setIsAnimating(true)
    setAnimationData({
      imageUrl,
      startElement,
      endElement
    })
  }, [])

  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setAnimationData(null)
  }, [])

  return {
    triggerAnimation,
    isAnimating,
    animationData,
    onAnimationComplete
  }
}

