'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { createProductSchema, CreateProductFormData } from '@/schemas'
import { useToastContext } from '@/contexts/ToastContext'
import { useStore } from '@/hooks/useStore'
import { useNiches, useNicheFields } from '@/hooks/useNiches'
import { useSharedProductState, buildProductFormData } from '@/components/ProductForm'

export function useCreateProductPage(user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()

  const shared = useSharedProductState()
  const {
    selectedImages,
    orderedImagesByColor,
    selectedNicheId,
    setSelectedNicheId,
    dynamicFieldValues,
    setDynamicFieldValues,
    variantStocks,
  } = shared

  const { data: storeData } = useStore()
  const storeId = storeData?.id || null
  const { data: nichesData } = useNiches(storeId)
  const niches = nichesData?.data || []
  const { data: nicheFieldsRaw } = useNicheFields(selectedNicheId)
  const nicheFields = nicheFieldsRaw || []

  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      stock: undefined,
      featured: false,
      save_as_draft: false,
      sizes: [],
      colors: [],
      specifications: '',
      category_id: undefined,
      promo_price: undefined,
      promo_starts_at: null,
      promo_ends_at: null,
    },
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories', selectedNicheId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        params.append('status', '1')
        params.append('limit', '1000')
        if (selectedNicheId) params.append('niche_id', selectedNicheId.toString())
        const response = await api.get(`/categories?${params.toString()}`)
        return response.data.data || []
      } catch {
        return []
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user,
  })

  const categories = Array.isArray(categoriesData) ? categoriesData : []

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
    setSelectedNicheId(nicheId)
    setDynamicFieldValues({})
  }

  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductFormData) => {
      const hasColorImages = Object.values(orderedImagesByColor).some((items) => items.length > 0)
      const hasSimpleImages = selectedImages.length > 0

      if (!hasColorImages && !hasSimpleImages) {
        throw new Error('O produto deve ter no mínimo 2 imagens por cor')
      }

      if (hasColorImages) {
        for (const [color, items] of Object.entries(orderedImagesByColor)) {
          if (items.length < 2) throw new Error(`A cor "${color}" deve ter no mínimo 2 imagens`)
          if (items.length > 5) throw new Error(`A cor "${color}" pode ter no máximo 5 imagens`)
        }
      } else {
        if (selectedImages.length < 2) throw new Error('O produto deve ter no mínimo 2 imagens')
        if (selectedImages.length > 5) throw new Error('O produto pode ter no máximo 5 imagens')
      }

      const formData = buildProductFormData({
        data,
        variantStocks,
        selectedNicheId,
        dynamicFieldValues,
        orderedImagesByColor,
        selectedImages,
        mode: 'create',
      })

      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
      showSuccess('Produto criado com sucesso!', 'Sucesso')
      router.push('/vendedor/produtos')
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Erro ao criar produto'
      showError(msg, 'Erro ao criar produto')
    },
  })

  return {
    form,
    store: storeData,
    ...shared,
    categories,
    niches,
    nicheFields,
    availableColors,
    availableSizes,
    handleNicheChange,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
    onSubmit: (data: CreateProductFormData) => createProductMutation.mutate(data),
  }
}
