'use client'

import { useState } from 'react'

export function useProductVariations() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const setSizes = (sizes: string[]) => {
    setSelectedSizes(sizes)
  }

  const setColors = (colors: string[]) => {
    setSelectedColors(colors)
  }

  const reset = () => {
    setSelectedSizes([])
    setSelectedColors([])
  }

  return {
    selectedSizes,
    selectedColors,
    toggleSize,
    toggleColor,
    setSizes,
    setColors,
    reset
  }
}
