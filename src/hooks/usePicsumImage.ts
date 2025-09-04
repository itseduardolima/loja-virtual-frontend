'use client'

import { useState, useEffect } from 'react'

export function usePicsumImage() {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const generateImageUrl = (index: number) => {
    const timestamp = Date.now()
    const randomId = Math.floor(Math.random() * 10000) + index + timestamp
    return `https://picsum.photos/1920/1080?random=${randomId}`
  }

  const loadImage = (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true)
      setTimeout(() => {
        const imageUrl = generateImageUrl(imageIndex)
        setCurrentImageUrl(imageUrl)
        setIsLoading(false)
      }, 500)
    } else {
      const newIndex = imageIndex + 1
      const imageUrl = generateImageUrl(newIndex)
      const img = new Image()
      img.onload = () => {
        setCurrentImageUrl(imageUrl)
        setImageIndex(newIndex)
      }
      img.onerror = () => {
        const fallbackUrl = generateImageUrl(newIndex + 1000)
        setCurrentImageUrl(fallbackUrl)
        setImageIndex(newIndex)
      }
      img.src = imageUrl
    }
  }

  useEffect(() => {
    loadImage(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      loadImage(false)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return {
    currentImageUrl,
    isLoading,
  }
}
