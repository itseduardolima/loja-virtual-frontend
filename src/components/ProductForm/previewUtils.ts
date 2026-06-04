import { useEffect, useRef } from 'react'
import { buildImageUrl } from '@/lib/imageUtils'
import { slugify } from './data'
import type { OrderedImage, StorefrontPreviewData } from './types'
import type { NicheField, NicheFieldValue } from '@/types'

export function usePreviewUrlCache() {
  const cache = useRef<Map<File, string>>(new Map())

  useEffect(() => {
    const map = cache.current
    return () => {
      map.forEach((url) => URL.revokeObjectURL(url))
      map.clear()
    }
  }, [])

  const orderedImageSrc = (item: OrderedImage): string => {
    if (item.type === 'existing') return buildImageUrl(item.url)
    if (!cache.current.has(item.file)) {
      cache.current.set(item.file, URL.createObjectURL(item.file))
    }
    return cache.current.get(item.file)!
  }

  const fileSrc = (file: File): string => {
    if (!cache.current.has(file)) {
      cache.current.set(file, URL.createObjectURL(file))
    }
    return cache.current.get(file)!
  }

  return { orderedImageSrc, fileSrc }
}

export function buildPreviewData(params: {
  name: string
  description: string | undefined
  price: number | undefined
  promoPrice: number | null | undefined
  promoEndsAt: string | null | undefined
  nicheName: string | null
  categoryName: string | null
  colors: string[]
  sizes: string[]
  variantStocks: { color: string; size: string; stock: number }[]
  stockValue: number | undefined
  orderedImagesByColor: Record<string, OrderedImage[]>
  selectedImages: File[]
  existingSimpleImages?: string[]
  nicheFields: NicheField[]
  dynamicFieldValues: Record<string, NicheFieldValue>
  specifications: string | undefined
  orderedImageSrc: (item: OrderedImage) => string
  fileSrc: (file: File) => string
}): StorefrontPreviewData {
  const {
    name, description, price, promoPrice, promoEndsAt,
    nicheName, categoryName, colors, sizes, variantStocks, stockValue,
    orderedImagesByColor, selectedImages, existingSimpleImages,
    nicheFields, dynamicFieldValues, specifications,
    orderedImageSrc, fileSrc,
  } = params

  const imagesByColor: Record<string, string[]> = {}
  if (colors.length > 0) {
    colors.forEach((c) => {
      imagesByColor[c] = (orderedImagesByColor[c] || []).map(orderedImageSrc)
    })
  }

  const simpleImages =
    colors.length > 0
      ? []
      : [...(existingSimpleImages ?? []), ...selectedImages.map(fileSrc)]

  const dynSpecs = nicheFields
    .filter((f) => {
      const isColor = f.field_type === 'color' || f.variant_dimension === 'color'
      const isSize = f.variant_dimension === 'size'
      return !isColor && !isSize
    })
    .map((f): [string, string] => {
      const v = dynamicFieldValues[String(f.id)]?.value
      const str = Array.isArray(v) ? v.join(', ') : (v ?? '')
      return [f.name, str]
    })
    .filter(([, v]) => v.trim() !== '')

  return {
    name: name || '',
    description: description || undefined,
    price: price || undefined,
    promoPrice: promoPrice ?? null,
    promoEndsAt: promoEndsAt ?? null,
    nicheName,
    categoryName,
    colors,
    sizes,
    variantStocks,
    singleStock: typeof stockValue === 'number' ? stockValue : undefined,
    imagesByColor,
    simpleImages,
    specificationsHtml: specifications || undefined,
    dynSpecs,
    slug: slugify(name),
  }
}
