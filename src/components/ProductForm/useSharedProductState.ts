'use client'

import { useState } from 'react'
import type { NicheFieldValue } from '@/types'
import type { OrderedImage } from './types'

export function useSharedProductState() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [orderedImagesByColor, setOrderedImagesByColor] = useState<Record<string, OrderedImage[]>>({})
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null)
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, NicheFieldValue>>({})
  const [variantStocks, setVariantStocks] = useState<{ color: string; size: string; stock: number }[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const reorderImages = (newImages: File[]) => {
    setSelectedImages(newImages)
  }

  const handleOrderedImagesChange = (color: string, newOrder: OrderedImage[]) => {
    setOrderedImagesByColor((prev) => ({ ...prev, [color]: newOrder }))
  }

  const handleDynamicFieldChange = (fieldId: number, value: string | string[]) => {
    setDynamicFieldValues((prev) => ({
      ...prev,
      [fieldId.toString()]: { field_id: fieldId, value },
    }))
  }

  return {
    selectedImages,
    setSelectedImages,
    orderedImagesByColor,
    setOrderedImagesByColor,
    selectedNicheId,
    setSelectedNicheId,
    dynamicFieldValues,
    setDynamicFieldValues,
    variantStocks,
    setVariantStocks,
    handleImageChange,
    removeImage,
    reorderImages,
    handleOrderedImagesChange,
    handleDynamicFieldChange,
  }
}
