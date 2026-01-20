import { useState } from 'react'
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

export function useCreateProductPage(user: any) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { error: showError, success: showSuccess } = useToastContext()
  const [selectedImages, setSelectedImages] = useState<File[]>([])

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
      color: '',
      specifications: '',
      category_id: undefined
    }
  })

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/categories')
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
      if (selectedImages.length === 0) {
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

  return {
    form,
    selectedImages,
    categories,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
    handleImageChange,
    removeImage,
    onSubmit
  }
}
