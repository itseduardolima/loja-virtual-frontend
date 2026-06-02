import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import {
  createProductSchema,
  CreateProductFormData
} from '@/schemas'
import { useToastContext } from '@/contexts/ToastContext'
import { useStore } from '@/hooks/useStore'
import { useNiches, useNicheFields } from '@/hooks/useNiches'
import { NicheFieldValue } from '@/types'
import { OrderedImage } from '@/components/Form/ImageUploadByColor'

export function useCreateProductPage(user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [orderedImagesByColor, setOrderedImagesByColor] = useState<Record<string, OrderedImage[]>>({})
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null)
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, NicheFieldValue>>({})
  const [variantStocks, setVariantStocks] = useState<{color: string, size: string, stock: number}[]>([])

  const { data: storeData } = useStore()
  const storeId = storeData?.id || null
  const { data: nichesData } = useNiches(storeId)
  const niches = nichesData?.data || []
  const { data: nicheFields } = useNicheFields(selectedNicheId)

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
    }
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories', selectedNicheId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        params.append('status', '1')
        params.append('limit', '1000')
        if (selectedNicheId) {
          params.append('niche_id', selectedNicheId.toString())
        }
        const response = await api.get(`/categories?${params.toString()}`)
        return response.data.data || []
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
        return []
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!user
  })

  const categories = Array.isArray(categoriesData) ? categoriesData : []

  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductFormData) => {
      const hasColorImages = Object.values(orderedImagesByColor).some(items => items.length > 0)
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

      const formData = new FormData()

      formData.append('name', data.name)
      if (data.description && data.description.trim()) {
        formData.append('description', data.description.trim())
      }
      formData.append('price', (data.price || 0).toString())
      // Se há variações, o estoque total é a soma das variações
      const stockTotal = variantStocks.length > 0
        ? variantStocks.reduce((sum, v) => sum + (v.stock || 0), 0)
        : (data.stock || 0)
      formData.append('stock', stockTotal.toString())
      if (data.category_id && data.category_id > 0) {
        formData.append('category_id', data.category_id.toString())
      }
      formData.append('featured', data.featured ? 'true' : 'false')
      if (data.save_as_draft) formData.append('save_as_draft', 'true')

      if (data.specifications && data.specifications.trim()) {
        formData.append('specifications', data.specifications.trim())
      }
      if (data.promo_price) formData.append('promo_price', data.promo_price.toString())
      if (data.promo_starts_at) formData.append('promo_starts_at', data.promo_starts_at)
      if (data.promo_ends_at) formData.append('promo_ends_at', data.promo_ends_at)
      if (variantStocks.length > 0) formData.append('variant_stocks', JSON.stringify(variantStocks))
      // Dados fiscais (NF-e)
      if (data.ncm) formData.append('ncm', data.ncm)
      if (data.cest) formData.append('cest', data.cest)
      if (data.origem !== undefined && data.origem !== null) formData.append('origem', String(data.origem))
      if (data.unidade) formData.append('unidade', data.unidade)
      if (data.gtin) formData.append('gtin', data.gtin)

      // Envia o nicho sempre que selecionado (mesmo sem valores preenchidos), para o
      // backend cobrar os campos obrigatórios do nicho — não só quando há dynamic_fields.
      if (selectedNicheId) {
        formData.append('niche_id', selectedNicheId.toString())
      }

      if (selectedNicheId && Object.keys(dynamicFieldValues).length > 0) {
        const dynamicFields = Object.values(dynamicFieldValues).map((fieldValue) => ({
          field_id: fieldValue.field_id,
          value: Array.isArray(fieldValue.value) ? fieldValue.value.join(', ') : fieldValue.value
        }))
        formData.append('dynamic_fields', JSON.stringify(dynamicFields))
      }

      if (hasColorImages) {
        // All items are type 'new' (create has no existing images)
        const allImages: File[] = []
        const imagesByColorWithIndices: Record<string, number[]> = {}

        for (const [color, items] of Object.entries(orderedImagesByColor)) {
          const newItems = items.filter(i => i.type === 'new') as { type: 'new'; file: File }[]
          if (newItems.length > 0) {
            imagesByColorWithIndices[color] = newItems.map(i => {
              const idx = allImages.length
              allImages.push(i.file)
              return idx
            })
          }
        }

        allImages.forEach(image => formData.append('images', image))
        formData.append('images_by_color', JSON.stringify(imagesByColorWithIndices))
      } else {
        selectedImages.forEach(image => formData.append('images', image))
      }

      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar produto'
      showError(errorMessage, 'Erro ao criar produto')
    }
  })

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

  const handleOrderedImagesChange = (color: string, newOrder: OrderedImage[]) => {
    setOrderedImagesByColor(prev => ({ ...prev, [color]: newOrder }))
  }

  const onSubmit = (data: CreateProductFormData) => {
    createProductMutation.mutate(data)
  }

  const handleNicheChange = (nicheId: number | null) => {
    setSelectedNicheId(nicheId)
    setDynamicFieldValues({})
  }

  const handleDynamicFieldChange = (fieldId: number, value: string | string[]) => {
    setDynamicFieldValues(prev => ({
      ...prev,
      [fieldId.toString()]: { field_id: fieldId, value }
    }))
  }

  const availableColors = useMemo(() => {
    if (!nicheFields || nicheFields.length === 0) return []
    const colorField = nicheFields.find(f => f.variant_dimension === 'color')
      || nicheFields.find(f => f.name.toLowerCase() === 'cor')
    if (!colorField) return []
    const colorFieldValue = dynamicFieldValues[colorField.id.toString()]
    if (!colorFieldValue) return []
    const value = colorFieldValue.value
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').map(c => c.trim()).filter(Boolean)
    return []
  }, [dynamicFieldValues, nicheFields])

  const availableSizes = useMemo(() => {
    if (!nicheFields || nicheFields.length === 0) return []
    const sizeField = nicheFields.find(f => f.variant_dimension === 'size')
      || nicheFields.find(f =>
        f.name.toLowerCase() === 'tamanho' || f.name.toLowerCase() === 'tamanhos'
      )
    if (!sizeField) return []
    const sizeFieldValue = dynamicFieldValues[sizeField.id.toString()]
    if (!sizeFieldValue) return []
    const value = sizeFieldValue.value
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean)
    return []
  }, [dynamicFieldValues, nicheFields])

  return {
    form,
    selectedImages,
    orderedImagesByColor,
    handleOrderedImagesChange,
    categories,
    niches,
    nicheFields: nicheFields || [],
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    availableSizes,
    variantStocks,
    setVariantStocks,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
    handleImageChange,
    removeImage,
    reorderImages,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  }
}
