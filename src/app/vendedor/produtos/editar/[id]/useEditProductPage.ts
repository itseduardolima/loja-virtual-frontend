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
import { useSharedProductState } from '@/components/ProductForm/useSharedProductState'
import { buildProductFormData } from '@/components/ProductForm/buildProductFormData'
import type { OrderedImage } from '@/components/ProductForm/types'

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()

  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const shared = useSharedProductState()
  const {
    selectedImages,
    orderedImagesByColor,
    setOrderedImagesByColor,
    selectedNicheId,
    setSelectedNicheId,
    dynamicFieldValues,
    setDynamicFieldValues,
    variantStocks,
    setVariantStocks,
  } = shared

  const { data: storeData } = useStore()
  const storeId = storeData?.id || null
  const { data: nichesData } = useNiches(storeId)
  const niches = nichesData?.data || []
  const { data: nicheFieldsRaw } = useNicheFields(selectedNicheId)
  const nicheFields = nicheFieldsRaw || []

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
      if (selectedNicheId) params.append('niche_id', selectedNicheId.toString())
      const response = await api.get(`/categories?${params.toString()}`)
      return response.data.data || []
    },
    enabled: !!user,
  })

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      stock: undefined,
      category_id: undefined,
      featured: false,
      specifications: undefined,
      promo_price: undefined,
      promo_starts_at: null,
      promo_ends_at: null,
    },
  })

  // Initialize form from product data
  useEffect(() => {
    if (product && !isInitialized) {
      form.setValue('name', product.name || '')

      let description = product.description || ''
      let specifications = product.specifications || ''

      if (!specifications && description.includes('\n\nEspecificações:\n')) {
        const parts = description.split('\n\nEspecificações:\n')
        description = parts[0].trim()
        specifications = parts[1]?.trim() || ''
      }

      form.setValue('description', description)
      form.setValue('specifications', specifications)
      form.setValue('price', product.price ? parseFloat(product.price) : 0)
      form.setValue('stock', product.stock || 0)
      form.setValue('category_id', product.category_id || undefined)
      form.setValue('featured', product.featured === 1)
      form.setValue('promo_price', product.promo_price ? parseFloat(String(product.promo_price)) : undefined)
      form.setValue('promo_starts_at', product.promo_starts_at ? product.promo_starts_at.slice(0, 16) : null)
      form.setValue('promo_ends_at', product.promo_ends_at ? product.promo_ends_at.slice(0, 16) : null)

      if (product.stock_variants?.length > 0) {
        setVariantStocks(product.stock_variants)
      }

      const imagesByColorRaw =
        product.images_by_color ||
        (typeof product.images === 'object' && !Array.isArray(product.images)
          ? product.images
          : null)

      if (imagesByColorRaw && typeof imagesByColorRaw === 'object' && !Array.isArray(imagesByColorRaw)) {
        const initial: Record<string, OrderedImage[]> = {}
        for (const [color, urls] of Object.entries(imagesByColorRaw as Record<string, string[]>)) {
          initial[color] = (urls || []).map((url) => ({ type: 'existing' as const, url }))
        }
        setOrderedImagesByColor(initial)
      }

      setIsInitialized(true)
    }
  }, [product, form, isInitialized, setOrderedImagesByColor, setVariantStocks])

  // Load niche and dynamic fields from product
  useEffect(() => {
    if (product?.dynamic_fields?.length > 0 && product.niche?.id) {
      const nicheId =
        typeof product.niche.id === 'number'
          ? product.niche.id
          : parseInt(String(product.niche.id), 10)

      if (!isNaN(nicheId) && nicheId > 0) {
        setSelectedNicheId(nicheId)
      }

      const map: Record<string, NicheFieldValue> = {}
      product.dynamic_fields.forEach((field: any) => {
        if (!field.field_id) return
        const fieldId =
          typeof field.field_id === 'number'
            ? field.field_id
            : parseInt(String(field.field_id), 10)
        if (!isNaN(fieldId) && fieldId > 0) {
          map[fieldId.toString()] = { field_id: fieldId, value: field.value }
        }
      })
      if (Object.keys(map).length > 0) setDynamicFieldValues(map)
    }
  }, [product, setSelectedNicheId, setDynamicFieldValues])

  const updateProductMutation = useUpdateProduct()

  const availableColors = useMemo(() => {
    if (!nicheFields.length) return []
    const colorField =
      nicheFields.find((f) => f.variant_dimension === 'color') ||
      nicheFields.find((f) => f.name.toLowerCase() === 'cor')
    if (!colorField) return []
    const v = dynamicFieldValues[colorField.id.toString()]?.value
    if (!v) return []
    if (Array.isArray(v)) return v
    return String(v).split(',').map((c) => c.trim()).filter(Boolean)
  }, [dynamicFieldValues, nicheFields])

  const availableSizes = useMemo(() => {
    if (!nicheFields.length) return []
    const sizeField =
      nicheFields.find((f) => f.variant_dimension === 'size') ||
      nicheFields.find((f) =>
        f.name.toLowerCase() === 'tamanho' || f.name.toLowerCase() === 'tamanhos',
      )
    if (!sizeField) return []
    const v = dynamicFieldValues[sizeField.id.toString()]?.value
    if (!v) return []
    if (Array.isArray(v)) return v
    return String(v).split(',').map((s) => s.trim()).filter(Boolean)
  }, [dynamicFieldValues, nicheFields])

  const handleNicheChange = (nicheId: number | null) => {
    if (nicheId === null || (typeof nicheId === 'number' && !isNaN(nicheId) && nicheId > 0)) {
      setSelectedNicheId(nicheId)
    }
  }

  const removeExistingImage = (index: number) => {
    setRemovedExistingImages((prev) => [...prev, index])
  }

  const onSubmit = (data: CreateProductFormData) => {
    const hasColorImages = Object.values(orderedImagesByColor).some((items) => items.length > 0)

    if (hasColorImages) {
      for (const [color, items] of Object.entries(orderedImagesByColor)) {
        if (items.length < 2) { showError(`A cor "${color}" deve ter no mínimo 2 imagens`, 'Validação'); return }
        if (items.length > 5) { showError(`A cor "${color}" pode ter no máximo 5 imagens`, 'Validação'); return }
      }
    } else {
      const remainingExisting = Array.isArray(product?.images)
        ? (product.images as any[]).filter((_, i) => !removedExistingImages.includes(i)).length
        : 0
      const total = selectedImages.length + remainingExisting
      if (total < 2) { showError('O produto deve ter no mínimo 2 imagens', 'Validação'); return }
      if (total > 5) { showError('O produto pode ter no máximo 5 imagens', 'Validação'); return }
    }

    const formData = buildProductFormData({
      data,
      variantStocks,
      selectedNicheId,
      dynamicFieldValues,
      orderedImagesByColor,
      selectedImages,
      mode: 'edit',
      removedExistingImages,
    })

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
          const msg = error.response?.data?.message || error.message || 'Erro ao atualizar produto'
          showError(msg, 'Erro ao atualizar produto')
        },
      },
    )
  }

  return {
    form,
    store: storeData,
    product,
    ...shared,
    categories,
    niches,
    nicheFields,
    availableColors,
    availableSizes,
    removedExistingImages,
    isInitialized,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleNicheChange,
    removeExistingImage,
    onSubmit,
  }
}
