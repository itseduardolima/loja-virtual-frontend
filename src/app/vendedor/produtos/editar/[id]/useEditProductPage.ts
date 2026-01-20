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

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([])
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
      color: undefined,
      specifications: undefined
    }
  })

  useEffect(() => {
    if (product) {
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
      
      // Definir cor se disponível
      if (product.color) {
        form.setValue('color', product.color)
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

  const onSubmit = (data: CreateProductFormData) => {
    // Calcular imagens restantes (existentes - removidas + novas)
    const remainingExistingImages = (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
    const totalImages = selectedImages.length + remainingExistingImages.length
    
    if (totalImages === 0) {
      showError('É necessário ter pelo menos uma imagem', 'Validação')
      return
    }

    const formData = new FormData()
    
    formData.append('name', data.name)
    if (data.description && data.description.trim()) {
      formData.append('description', data.description.trim())
    }
    formData.append('price', (data.price || 0).toString())
    formData.append('stock', (data.stock || 0).toString())
    // Sempre enviar discount_price para permitir remover desconto ao editar
    if (data.discount_price !== undefined && data.discount_price !== null && data.discount_price > 0) {
      formData.append('discount_price', data.discount_price.toString())
    } else {
      // Enviar null explicitamente para remover desconto
      formData.append('discount_price', '')
    }
    if (data.category_id && data.category_id > 0) {
      formData.append('category_id', data.category_id.toString())
    }
    formData.append('featured', data.featured ? 'true' : 'false')
    
    // Adicionar campos simples: color e specifications
    if (data.color && data.color.trim()) {
      formData.append('color', data.color.trim())
    }
    if (data.specifications && data.specifications.trim()) {
      formData.append('specifications', data.specifications.trim())
    }
    
    selectedImages.forEach(image => {
      formData.append('images', image)
    })

    // Adicionar índices das imagens existentes que devem ser removidas
    removedExistingImages.forEach(index => {
      formData.append('remove_images[]', index.toString())
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
    removedExistingImages,
    isInitialized,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    onSubmit
  }
}
