'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { createProductSchema, CreateProductFormData } from '@/schemas'
import { useToastContext } from '@/contexts/ToastContext'
import { useStore } from '@/hooks/useStore'
import { useCategories } from '@/hooks/useCategories'
import { useNiches, useNicheFields } from '@/hooks/useNiches'
import { useSharedProductState, buildProductFormData } from '@/components/ProductForm'
import type { User } from '@/types'

export function useCreateProductPage(user: User | null) {
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

  // Categoria filtra quais campos dinâmicos do nicho aparecem (NICHE_FIELD_CATEGORY).
  const categoryId = form.watch('category_id') || null
  const { data: nicheFieldsRaw } = useNicheFields(selectedNicheId, categoryId)
  const nicheFields = nicheFieldsRaw || []

  // Trocar de categoria também invalida os valores de campos dinâmicos já
  // preenchidos (mesmo motivo do reset ao trocar nicho, em handleNicheChange
  // abaixo) — um campo preenchido pode não existir mais na nova lista
  // filtrada. Ignora a primeira renderização (categoryId partindo de null).
  const previousCategoryIdRef = useRef(categoryId)
  useEffect(() => {
    if (previousCategoryIdRef.current !== categoryId) {
      previousCategoryIdRef.current = categoryId
      setDynamicFieldValues({})
    }
  }, [categoryId, setDynamicFieldValues])

  const { categories } = useCategories(
    {
      status: 1,
      limit: 1000,
      ...(selectedNicheId != null ? { niche_id: selectedNicheId } : {}),
    },
    { enabled: !!user }, // não busca antes do auth resolver (paridade com o inline anterior)
  )

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
        throw new Error('O produto deve ter no mínimo 1 imagem por cor')
      }

      if (hasColorImages) {
        for (const [color, items] of Object.entries(orderedImagesByColor)) {
          if (items.length < 1) throw new Error(`A cor "${color}" deve ter no mínimo 1 imagem`)
          if (items.length > 5) throw new Error(`A cor "${color}" pode ter no máximo 5 imagens`)
        }
      } else {
        if (selectedImages.length < 1) throw new Error('O produto deve ter no mínimo 1 imagem')
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
    onError: (error: AxiosError<{ message?: string }>) => {
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
