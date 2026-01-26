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

export function useCreateProductPage(user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagesByColor, setImagesByColor] = useState<Record<string, File[]>>({})
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null)
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, NicheFieldValue>>({})

  const { data: storeData } = useStore()
  const storeId = storeData?.id || null
  const { data: nichesData } = useNiches(storeId)
  const niches = nichesData?.data || []
  const { data: nicheFields } = useNicheFields(selectedNicheId)

  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      stock: undefined,
      discount_price: undefined,
      featured: false,
      sizes: [],
      colors: [],
      specifications: '',
      category_id: undefined
    }
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories', selectedNicheId],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        params.append('status', '1')
        params.append('limit', '1000') // Limite alto para buscar todas as categorias
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
      // Verificar se há imagens (por cor ou simples)
      const hasImagesByColor = Object.keys(imagesByColor).length > 0 && 
        Object.values(imagesByColor).some(images => images.length > 0)
      const hasSimpleImages = selectedImages.length > 0

      if (!hasImagesByColor && !hasSimpleImages) {
        throw new Error('É necessário ter pelo menos uma imagem')
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
      
      // Adicionar campo de specifications
      if (data.specifications && data.specifications.trim()) {
        formData.append('specifications', data.specifications.trim())
      }

      // Adicionar campos dinâmicos se houver nicho selecionado
      if (selectedNicheId && Object.keys(dynamicFieldValues).length > 0) {
        const dynamicFields = Object.values(dynamicFieldValues).map((fieldValue) => ({
          field_id: fieldValue.field_id,
          value: Array.isArray(fieldValue.value) ? fieldValue.value.join(', ') : fieldValue.value
        }))
        formData.append('dynamic_fields', JSON.stringify(dynamicFields))
      }
      
      // Processar imagens por cor se houver
      if (hasImagesByColor) {
        // Criar um mapeamento de índices para as imagens
        const allImages: File[] = []
        const imagesByColorWithIndices: Record<string, number[]> = {}
        
        Object.entries(imagesByColor).forEach(([color, images]) => {
          const indices: number[] = []
          images.forEach(image => {
            const index = allImages.length
            allImages.push(image)
            indices.push(index)
          })
          imagesByColorWithIndices[color] = indices
        })
        
        // Adicionar todas as imagens ao FormData
        allImages.forEach(image => {
          formData.append('images', image)
        })
        
        // Adicionar o mapeamento de imagens por cor
        formData.append('images_by_color', JSON.stringify(imagesByColorWithIndices))
      } else {
        // Formato antigo: array simples
        selectedImages.forEach(image => {
          formData.append('images', image)
        })
      }

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidar queries para atualizar a listagem
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      // Forçar refetch imediato
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

  const onSubmit = (data: CreateProductFormData) => {
    createProductMutation.mutate(data)
  }

  const handleNicheChange = (nicheId: number | null) => {
    setSelectedNicheId(nicheId)
    setDynamicFieldValues({}) // Limpar campos quando trocar de nicho
  }

  const handleDynamicFieldChange = (fieldId: number, value: string | string[]) => {
    setDynamicFieldValues(prev => ({
      ...prev,
      [fieldId.toString()]: { field_id: fieldId, value }
    }))
  }

  // Extrair cores dos campos dinâmicos
  const availableColors = useMemo(() => {
    if (!nicheFields || nicheFields.length === 0) return []
    
    // Encontrar o campo de cor
    const colorField = nicheFields.find(f => f.name.toLowerCase() === 'cor')
    if (!colorField) return []
    
    // Buscar o valor do campo de cor nos dynamicFieldValues
    const colorFieldValue = dynamicFieldValues[colorField.id.toString()]
    if (!colorFieldValue) return []
    
    const value = colorFieldValue.value
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string') {
      return value.split(',').map(c => c.trim()).filter(Boolean)
    }
    return []
  }, [dynamicFieldValues, nicheFields])

  return {
    form,
    selectedImages,
    imagesByColor,
    setImagesByColor,
    categories,
    niches,
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
    handleImageChange,
    removeImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  }
}
