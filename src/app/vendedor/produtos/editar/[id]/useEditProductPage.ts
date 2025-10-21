'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { createProductSchema, CreateProductFormData } from '@/schemas/productSchemas'
import { useUpdateProduct } from '@/hooks/useProducts'
import { useToastContext } from '@/contexts/ToastContext'
import { NicheFieldValue } from '@/types'
import { useNicheFields } from '@/hooks/useNiches'

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([])
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null)
  const [nicheFieldValues, setNicheFieldValues] = useState<Record<string, NicheFieldValue>>({})
  const [isInitialized, setIsInitialized] = useState(false)
  
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}`)
      return response.data
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })

  // Buscar campos do nicho selecionado
  const { data: nicheFields } = useNicheFields(selectedNicheId)

  // Mapear campos dinâmicos existentes quando o nicho for carregado
  useEffect(() => {
    if (nicheFields && product && product.dynamic_fields) {
      const updatedFieldValues: Record<string, NicheFieldValue> = {}
      
      // Mapear cada campo dinâmico existente para o field_id correto
      product.dynamic_fields.forEach((existingField: any) => {
        const nicheField = nicheFields.find((field: any) => field.name === existingField.field_name)
        if (nicheField) {
          // Para campos de seleção múltipla, converter string para array
          let fieldValue = existingField.value
          if (nicheField.field_type === 'select' && typeof fieldValue === 'string') {
            fieldValue = fieldValue.split(',').map(item => item.trim()).filter(Boolean)
          }
          
          updatedFieldValues[nicheField.id] = {
            field_id: nicheField.id,
            value: fieldValue
          }
        }
      })
      
      setNicheFieldValues(updatedFieldValues)
    }
  }, [nicheFields, product])

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
      category_id: undefined,
      featured: false
    }
  })

  useEffect(() => {
    if (product) {
      // Usar setValue para garantir reatividade
      form.setValue('name', product.name || '')
      form.setValue('description', product.description || '')
      form.setValue('price', product.price ? parseFloat(product.price) : 0)
      form.setValue('stock', product.stock || 0)
      form.setValue('category_id', product.category_id || undefined)
      form.setValue('featured', product.featured === 1)

      // Definir nicho do produto
      if (product.niche && product.niche.id) {
        setSelectedNicheId(product.niche.id)
      }
      
      setIsInitialized(true)
    }
  }, [product, form])

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

  const handleNicheSelect = (nicheId: number) => {
    setSelectedNicheId(nicheId)
    // Limpar valores dos campos quando trocar de nicho
    setNicheFieldValues({})
  }

  const handleFieldChange = (fieldId: number, value: string | string[]) => {
    setNicheFieldValues(prev => ({
      ...prev,
      [fieldId]: {
        field_id: fieldId,
        value
      }
    }))
  }


  const onSubmit = (data: CreateProductFormData) => {
    // Calcular imagens restantes (existentes - removidas + novas)
    const remainingExistingImages = (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
    const totalImages = selectedImages.length + remainingExistingImages.length
    
    if (totalImages === 0) {
      showError('É necessário ter pelo menos uma imagem', 'Validação')
      return
    }

    if (!selectedNicheId) {
      showError('É necessário selecionar um nicho para o produto', 'Validação')
      return
    }

    // Validar campos dinâmicos obrigatórios
    const emptyFields = Object.values(nicheFieldValues).filter(fieldValue => {
      if (Array.isArray(fieldValue.value)) {
        return fieldValue.value.length === 0
      }
      return !fieldValue.value || fieldValue.value.toString().trim() === ''
    })

    if (emptyFields.length > 0) {
      showError('Todos os campos personalizados são obrigatórios', 'Validação')
      return
    }

    const formData = new FormData()
    
    formData.append('name', data.name)
    if (data.description && data.description.trim()) {
      formData.append('description', data.description.trim())
    }
    formData.append('price', (data.price || 0).toString())
    formData.append('stock', (data.stock || 0).toString())
    if (data.category_id && data.category_id > 0) {
      formData.append('category_id', data.category_id.toString())
    }
    formData.append('featured', data.featured ? 'true' : 'false')
    formData.append('niche_id', selectedNicheId.toString())
    
    selectedImages.forEach(image => {
      formData.append('images', image)
    })

    // Adicionar índices das imagens existentes que devem ser removidas
    removedExistingImages.forEach(index => {
      formData.append('remove_images[]', index.toString())
    })

    // Adicionar campos dinâmicos do nicho como dynamic_fields
    const dynamicFields = Object.values(nicheFieldValues).map(fieldValue => ({
      field_id: fieldValue.field_id,
      value: fieldValue.value
    }))
    
    if (dynamicFields.length > 0) {
      formData.append('dynamic_fields', JSON.stringify(dynamicFields))
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

  return {
    form,
    product,
    selectedImages,
    categories,
    selectedNicheId,
    nicheFieldValues,
    nicheFields,
    removedExistingImages,
    isInitialized,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    handleNicheSelect,
    handleFieldChange,
    onSubmit
  }
}
