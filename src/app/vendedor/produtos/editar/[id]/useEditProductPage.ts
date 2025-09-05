'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { createProductSchema, CreateProductFormData } from '@/schemas/productSchemas'
import { useUpdateProduct } from '@/hooks/useProducts'
import { useProductVariations } from '@/hooks/useProductVariations'

export function useEditProductPage(productId: string, user: any) {
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const { selectedSizes, selectedColors, toggleSize, toggleColor, setSizes, setColors } = useProductVariations()

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
      price: 0,
      stock: 0,
      category_id: undefined,
      featured: false
    }
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        stock: product.stock || 0,
        category_id: product.category_id || undefined,
        featured: product.featured === 1
      })

      if (product.sizes && Array.isArray(product.sizes)) {
        const sizes = product.sizes.flatMap((size: any) => 
          typeof size === 'string' ? size.split(',').map(s => s.trim()) : [size]
        ).filter(Boolean)
        setSizes(sizes)
      }

      if (product.colors && Array.isArray(product.colors)) {
        const colors = product.colors.flatMap((color: any) => 
          typeof color === 'string' ? color.split(',').map(c => c.trim()) : [color]
        ).filter(Boolean)
        setColors(colors)
      }
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


  const onSubmit = (data: CreateProductFormData) => {
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

    updateProductMutation.mutate(
      { id: productId, data: formData },
      {
        onSuccess: () => {
          router.push('/vendedor/produtos')
        }
      }
    )
  }

  return {
    form,
    product,
    selectedImages,
    selectedSizes,
    selectedColors,
    categories,
    isLoading: productLoading || updateProductMutation.isPending,
    error: productError || updateProductMutation.error,
    handleImageChange,
    removeImage,
    toggleSize,
    toggleColor,
    onSubmit
  }
}
