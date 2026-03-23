'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { createProductSchema, CreateProductFormData } from '@/schemas/productSchemas'
import { useUpdateProduct } from '@/hooks/useProducts'
import { useToastContext } from '@/contexts/ToastContext'
import { useStore } from '@/hooks/useStore'
import { useNiches, useNicheFields } from '@/hooks/useNiches'
import { NicheFieldValue } from '@/types'
import { OrderedImage } from '@/components/Form/ImageUploadByColor'

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()

  // Unified ordered image state per color
  const [orderedImagesByColor, setOrderedImagesByColor] = useState<Record<string, OrderedImage[]>>({})

  // Simple images (no-color path)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([])

  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null)
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, NicheFieldValue>>({})

  const { data: storeData } = useStore()
  const storeId = storeData?.id || null
  const { data: nichesData } = useNiches(storeId)
  const niches = nichesData?.data || []
  const { data: nicheFields } = useNicheFields(selectedNicheId)

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}`)
      return response.data
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories', selectedNicheId],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('status', '1')
      params.append('limit', '1000')
      if (selectedNicheId) {
        params.append('niche_id', selectedNicheId.toString())
      }
      const response = await api.get(`/categories?${params.toString()}`)
      return response.data.data || []
    },
    enabled: !!user
  })

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      stock: undefined,
      discount_price: undefined,
      category_id: undefined,
      featured: false,
      specifications: undefined
    }
  })

  // Initialize form fields and ordered images from product data
  useEffect(() => {
    if (product && !isInitialized) {
      form.setValue('name', product.name || '')

      let description = product.description || ''
      let specifications = product.specifications || ''

      if (!specifications && description && description.includes('\n\nEspecificações:\n')) {
        const parts = description.split('\n\nEspecificações:\n')
        description = parts[0].trim()
        specifications = parts[1]?.trim() || ''
      }

      form.setValue('description', description)
      form.setValue('specifications', specifications)
      form.setValue('price', product.price ? parseFloat(product.price) : 0)
      form.setValue('stock', product.stock || 0)
      form.setValue('discount_price', product.discount_price ? parseFloat(product.discount_price) : undefined)
      form.setValue('category_id', product.category_id || undefined)
      form.setValue('featured', product.featured === 1)

      // Initialize ordered images from product.images_by_color
      const imagesByColorRaw = product.images_by_color ||
        (typeof product.images === 'object' && !Array.isArray(product.images) ? product.images : null)

      if (imagesByColorRaw && typeof imagesByColorRaw === 'object' && !Array.isArray(imagesByColorRaw)) {
        const initial: Record<string, OrderedImage[]> = {}
        for (const [color, urls] of Object.entries(imagesByColorRaw as Record<string, string[]>)) {
          initial[color] = (urls || []).map(url => ({ type: 'existing' as const, url }))
        }
        setOrderedImagesByColor(initial)
      }

      setIsInitialized(true)
    }
  }, [product, form, isInitialized])

  // Load niche and dynamic fields
  useEffect(() => {
    if (product && product.dynamic_fields && product.dynamic_fields.length > 0) {
      if (product.niche && product.niche.id) {
        const nicheId = typeof product.niche.id === 'number'
          ? product.niche.id
          : parseInt(String(product.niche.id), 10)

        if (!isNaN(nicheId) && nicheId > 0) {
          setSelectedNicheId(nicheId)
        }
      }

      const dynamicFieldsMap: Record<string, NicheFieldValue> = {}
      product.dynamic_fields.forEach((field: any) => {
        if (field.field_id) {
          const fieldId = typeof field.field_id === 'number'
            ? field.field_id
            : parseInt(String(field.field_id), 10)

          if (!isNaN(fieldId) && fieldId > 0) {
            dynamicFieldsMap[fieldId.toString()] = {
              field_id: fieldId,
              value: field.value
            }
          }
        }
      })

      if (Object.keys(dynamicFieldsMap).length > 0) {
        setDynamicFieldValues(dynamicFieldsMap)
      }
    }
  }, [product])

  const updateProductMutation = useUpdateProduct()

  // Simple images handlers (no-color path)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const reorderImages = (newImages: File[]) => {
    setSelectedImages(newImages)
  }

  const removeExistingImage = (index: number) => {
    setRemovedExistingImages(prev => [...prev, index])
  }

  // Color images handlers (unified ordered model)
  const handleOrderedImagesChange = (color: string, newOrder: OrderedImage[]) => {
    setOrderedImagesByColor(prev => ({
      ...prev,
      [color]: newOrder,
    }))
  }

  const onSubmit = (data: CreateProductFormData) => {
    const hasColorImages = Object.values(orderedImagesByColor).some(items => items.length > 0)

    // Validate image count (min 4, max 10)
    let totalImages: number
    if (hasColorImages) {
      totalImages = Object.values(orderedImagesByColor).reduce((sum, items) => sum + items.length, 0)
    } else {
      const remainingExistingImages = Array.isArray(product?.images)
        ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
        : []
      totalImages = selectedImages.length + remainingExistingImages.length
    }

    if (hasColorImages) {
      for (const [color, items] of Object.entries(orderedImagesByColor)) {
        if (items.length < 5) { showError(`A cor "${color}" deve ter exatamente 5 imagens`, 'Validação'); return }
        if (items.length > 5) { showError(`A cor "${color}" deve ter exatamente 5 imagens`, 'Validação'); return }
      }
    } else {
      if (totalImages < 5) { showError('O produto deve ter exatamente 5 imagens', 'Validação'); return }
      if (totalImages > 5) { showError('O produto deve ter exatamente 5 imagens', 'Validação'); return }
    }

    const formData = new FormData()

    formData.append('name', data.name)
    if (data.description && data.description.trim()) {
      formData.append('description', data.description.trim())
    }
    formData.append('price', (data.price || 0).toString())
    formData.append('stock', (data.stock || 0).toString())
    if (data.discount_price !== undefined && data.discount_price !== null && data.discount_price > 0) {
      formData.append('discount_price', data.discount_price.toString())
    }
    if (data.category_id && data.category_id > 0) {
      formData.append('category_id', data.category_id.toString())
    }
    formData.append('featured', data.featured ? 'true' : 'false')

    if (data.specifications !== undefined) {
      formData.append('specifications', data.specifications.trim() || '')
    }

    if (selectedNicheId && Object.keys(dynamicFieldValues).length > 0) {
      const dynamicFields = Object.values(dynamicFieldValues).map((fieldValue) => ({
        field_id: fieldValue.field_id,
        value: Array.isArray(fieldValue.value) ? fieldValue.value.join(', ') : fieldValue.value
      }))
      formData.append('dynamic_fields', JSON.stringify(dynamicFields))
    }

    if (hasColorImages) {
      // Decompose orderedImagesByColor into:
      // - existing_images_order: ordered existing URLs (defines order + removals)
      // - images_by_color: new file indices appended at end
      const existing_images_order: Record<string, string[]> = {}
      const allNewFiles: File[] = []
      const images_by_color: Record<string, number[]> = {}

      for (const [color, items] of Object.entries(orderedImagesByColor)) {
        // Existing URLs in order (omitted URLs are effectively removed)
        existing_images_order[color] = items
          .filter(i => i.type === 'existing')
          .map(i => (i as { type: 'existing'; url: string }).url)

        // New files
        const newItems = items.filter(i => i.type === 'new') as { type: 'new'; file: File }[]
        if (newItems.length > 0) {
          images_by_color[color] = newItems.map(i => {
            const idx = allNewFiles.length
            allNewFiles.push(i.file)
            return idx
          })
        }
      }

      formData.append('existing_images_order', JSON.stringify(existing_images_order))

      if (allNewFiles.length > 0) {
        allNewFiles.forEach(f => formData.append('images', f))
        formData.append('images_by_color', JSON.stringify(images_by_color))
      }
    } else {
      // Simple images path (no colors)
      selectedImages.forEach(image => formData.append('images', image))
      removedExistingImages.forEach(index => formData.append('remove_images[]', index.toString()))
    }

    updateProductMutation.mutate(
      { id: productId, data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] })
          queryClient.invalidateQueries({ queryKey: ['product'] })
          showSuccess('Produto atualizado com sucesso!', 'Sucesso')
          router.push('/vendedor/produtos')
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar produto'
          showError(errorMessage, 'Erro ao atualizar produto')
        }
      }
    )
  }

  const handleNicheChange = (nicheId: number | null) => {
    if (nicheId === null || (typeof nicheId === 'number' && !isNaN(nicheId) && nicheId > 0)) {
      setSelectedNicheId(nicheId)
    }
  }

  const handleDynamicFieldChange = (fieldId: number, value: string | string[]) => {
    setDynamicFieldValues(prev => ({
      ...prev,
      [fieldId.toString()]: { field_id: fieldId, value }
    }))
  }

  const availableColors = useMemo(() => {
    if (!nicheFields || nicheFields.length === 0) return []
    const colorField = nicheFields.find(f => f.name.toLowerCase() === 'cor')
    if (!colorField) return []
    const colorFieldValue = dynamicFieldValues[colorField.id.toString()]
    if (!colorFieldValue) return []
    const value = colorFieldValue.value
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').map(c => c.trim()).filter(Boolean)
    return []
  }, [dynamicFieldValues, nicheFields])

  return {
    form,
    product,
    selectedImages,
    orderedImagesByColor,
    handleOrderedImagesChange,
    categories,
    niches,
    nicheFields: nicheFields || [],
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    removedExistingImages,
    isInitialized,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleImageChange,
    removeImage,
    reorderImages,
    removeExistingImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  }
}
