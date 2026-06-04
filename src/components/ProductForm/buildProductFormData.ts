import type { CreateProductFormData } from '@/schemas'
import type { NicheFieldValue } from '@/types'
import type { OrderedImage } from './types'

interface BuildParams {
  data: CreateProductFormData
  variantStocks: { color: string; size: string; stock: number }[]
  selectedNicheId: number | null
  dynamicFieldValues: Record<string, NicheFieldValue>
  orderedImagesByColor: Record<string, OrderedImage[]>
  selectedImages: File[]
  mode: 'create' | 'edit'
  // Edit-only: track removed simple images
  removedExistingImages?: number[]
}

export function buildProductFormData(params: BuildParams): FormData {
  const {
    data,
    variantStocks,
    selectedNicheId,
    dynamicFieldValues,
    orderedImagesByColor,
    selectedImages,
    mode,
    removedExistingImages = [],
  } = params

  const formData = new FormData()

  formData.append('name', data.name)
  if (data.description?.trim()) {
    formData.append('description', data.description.trim())
  }
  formData.append('price', (data.price || 0).toString())

  const stockTotal =
    variantStocks.length > 0
      ? variantStocks.reduce((sum, v) => sum + (v.stock || 0), 0)
      : data.stock || 0
  formData.append('stock', stockTotal.toString())

  if (data.category_id && data.category_id > 0) {
    formData.append('category_id', data.category_id.toString())
  }
  formData.append('featured', data.featured ? 'true' : 'false')

  if (mode === 'create' && data.save_as_draft) {
    formData.append('save_as_draft', 'true')
  }

  if (mode === 'edit') {
    // Allow clearing specifications (empty string)
    formData.append('specifications', data.specifications?.trim() ?? '')
  } else if (data.specifications?.trim()) {
    formData.append('specifications', data.specifications.trim())
  }

  if (data.promo_price) formData.append('promo_price', data.promo_price.toString())
  if (data.promo_starts_at) formData.append('promo_starts_at', data.promo_starts_at)
  if (data.promo_ends_at) formData.append('promo_ends_at', data.promo_ends_at)
  if (variantStocks.length > 0) {
    formData.append('variant_stocks', JSON.stringify(variantStocks))
  }

  if (selectedNicheId) {
    formData.append('niche_id', selectedNicheId.toString())
  }

  if (selectedNicheId && Object.keys(dynamicFieldValues).length > 0) {
    const fields = Object.values(dynamicFieldValues).map((fv) => ({
      field_id: fv.field_id,
      value: Array.isArray(fv.value) ? fv.value.join(', ') : fv.value,
    }))
    formData.append('dynamic_fields', JSON.stringify(fields))
  }

  const hasColorImages = Object.values(orderedImagesByColor).some((items) => items.length > 0)

  if (hasColorImages) {
    if (mode === 'edit') {
      // Preserve existing URLs in their current order (omitted = removed)
      const existingImagesOrder: Record<string, string[]> = {}
      const allNewFiles: File[] = []
      const imagesByColor: Record<string, number[]> = {}

      for (const [color, items] of Object.entries(orderedImagesByColor)) {
        existingImagesOrder[color] = items
          .filter((i) => i.type === 'existing')
          .map((i) => (i as { type: 'existing'; url: string }).url)

        const newItems = items.filter((i) => i.type === 'new') as { type: 'new'; file: File }[]
        if (newItems.length > 0) {
          imagesByColor[color] = newItems.map((i) => {
            const idx = allNewFiles.length
            allNewFiles.push(i.file)
            return idx
          })
        }
      }

      formData.append('existing_images_order', JSON.stringify(existingImagesOrder))

      if (allNewFiles.length > 0) {
        allNewFiles.forEach((f) => formData.append('images', f))
        formData.append('images_by_color', JSON.stringify(imagesByColor))
      }
    } else {
      // Create: all items are type 'new'
      const allImages: File[] = []
      const imagesByColor: Record<string, number[]> = {}

      for (const [color, items] of Object.entries(orderedImagesByColor)) {
        const newItems = items.filter((i) => i.type === 'new') as { type: 'new'; file: File }[]
        if (newItems.length > 0) {
          imagesByColor[color] = newItems.map((i) => {
            const idx = allImages.length
            allImages.push(i.file)
            return idx
          })
        }
      }

      allImages.forEach((img) => formData.append('images', img))
      formData.append('images_by_color', JSON.stringify(imagesByColor))
    }
  } else {
    // Simple images path
    selectedImages.forEach((img) => formData.append('images', img))
    if (mode === 'edit') {
      removedExistingImages.forEach((idx) => formData.append('remove_images[]', idx.toString()))
    }
  }

  return formData
}
