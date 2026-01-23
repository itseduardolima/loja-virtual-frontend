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

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagesByColor, setImagesByColor] = useState<Record<string, File[]>>({})
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([])
  const [removedImagesByColor, setRemovedImagesByColor] = useState<Record<string, number[]>>({})
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
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories')
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

  useEffect(() => {
    if (product && !isInitialized) {
      // Usar setValue para garantir reatividade
      form.setValue('name', product.name || '')
      
      // Separar description e specifications se houver
      let description = product.description || ''
      let specifications = product.specifications || ''
      
      // Se não tiver specifications separado, tentar extrair da description
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
      
      // Inicializar imagens por cor se houver
      if (product.images_by_color && typeof product.images_by_color === 'object' && !Array.isArray(product.images_by_color)) {
        // Produto já tem imagens por cor - não precisamos fazer nada aqui
        // As imagens existentes serão gerenciadas pelo componente ImageUploadByColor
      } else if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
        // Produto tem imagens como objeto (formato novo)
        // Não precisamos fazer nada, o componente vai lidar com isso
      }
      
      setIsInitialized(true)
    }
  }, [product, form, isInitialized])

  // Carregar nicho e campos dinâmicos em um useEffect separado
  useEffect(() => {
    if (product && product.dynamic_fields && product.dynamic_fields.length > 0) {
      // Determinar o nicho baseado nos campos dinâmicos
      if (product.niche && product.niche.id) {
        const nicheId = typeof product.niche.id === 'number' 
          ? product.niche.id 
          : parseInt(String(product.niche.id), 10)
        
        if (!isNaN(nicheId) && nicheId > 0) {
          setSelectedNicheId(nicheId)
        }
      }
      
      // Carregar campos dinâmicos
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setRemovedExistingImages(prev => [...prev, index])
  }

  const onSubmit = (data: CreateProductFormData) => {
    // Verificar se há imagens (por cor ou simples)
    const hasImagesByColor = Object.keys(imagesByColor).length > 0 && 
      Object.values(imagesByColor).some(images => images.length > 0)
    
    // Calcular imagens restantes (existentes - removidas + novas)
    const remainingExistingImages = Array.isArray(product?.images) 
      ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
      : []
    
    const totalImages = selectedImages.length + remainingExistingImages.length
    
    // Se não há imagens por cor e não há imagens simples, verificar se há imagens existentes
    if (!hasImagesByColor && totalImages === 0) {
      // Verificar se há imagens por cor existentes que não foram todas removidas
      const hasExistingImagesByColor = product?.images_by_color && 
        typeof product.images_by_color === 'object' && 
        !Array.isArray(product.images_by_color) &&
        Object.keys(product.images_by_color).some(color => {
          const colorImages = product.images_by_color[color] || []
          const removedIndices = removedImagesByColor[color] || []
          return colorImages.length > removedIndices.length
        })
      
      if (!hasExistingImagesByColor) {
        showError('É necessário ter pelo menos uma imagem', 'Validação')
        return
      }
    }

    const formData = new FormData()
    
    formData.append('name', data.name)
    if (data.description && data.description.trim()) {
      formData.append('description', data.description.trim())
    }
    formData.append('price', (data.price || 0).toString())
    formData.append('stock', (data.stock || 0).toString())
    // Só enviar discount_price se tiver valor válido
    if (data.discount_price !== undefined && data.discount_price !== null && data.discount_price > 0) {
      formData.append('discount_price', data.discount_price.toString())
    }
    // Se discount_price for 0, null ou undefined, não enviar o campo (permite remover desconto)
    if (data.category_id && data.category_id > 0) {
      formData.append('category_id', data.category_id.toString())
    }
    formData.append('featured', data.featured ? 'true' : 'false')
    
    // Adicionar campo de specifications
    // Sempre enviar specifications para permitir limpar o campo
    if (data.specifications !== undefined) {
      formData.append('specifications', data.specifications.trim() || '')
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
      
      // Adicionar remoções de imagens por cor se houver
      if (Object.keys(removedImagesByColor).length > 0) {
        formData.append('remove_images_by_color', JSON.stringify(removedImagesByColor))
      }
    } else {
      // Formato antigo: array simples
      selectedImages.forEach(image => {
        formData.append('images', image)
      })

      // Adicionar índices das imagens existentes que devem ser removidas
      removedExistingImages.forEach(index => {
        formData.append('remove_images[]', index.toString())
      })
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
      // Não limpar campos quando trocar de nicho na edição, para não perder dados
    }
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
    product,
    selectedImages,
    imagesByColor,
    setImagesByColor,
    categories,
    niches,
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    removedExistingImages,
    removedImagesByColor,
    setRemovedImagesByColor,
    isInitialized,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  }
}
