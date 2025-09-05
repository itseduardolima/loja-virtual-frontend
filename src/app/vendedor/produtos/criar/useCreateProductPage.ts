import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { 
  createProductSchema, 
  CreateProductFormData
} from '@/schemas'

export function useCreateProductPage(user: any) {
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      featured: false,
      sizes: [],
      colors: [],
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
      const formData = new FormData()
      
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      formData.append('price', data.price.toString())
      if (data.stock) formData.append('stock', data.stock.toString())
      if (data.category_id) formData.append('category_id', data.category_id.toString())
      formData.append('featured', data.featured ? 'true' : 'false')
      
      selectedSizes.forEach(size => {
        formData.append('sizes[]', size)
      })

      selectedColors.forEach(color => {
        formData.append('colors[]', color)
      })
      
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
      router.push('/vendedor/produtos')
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const onSubmit = (data: CreateProductFormData) => {
    createProductMutation.mutate(data)
  }

  return {
    form,
    selectedImages,
    selectedSizes,
    selectedColors,
    categories,
    isLoading: createProductMutation.isPending,
    error: createProductMutation.error,
    handleImageChange,
    removeImage,
    toggleSize,
    toggleColor,
    onSubmit
  }
}
