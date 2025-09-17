import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildImageUrl } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { useCart } from '@/hooks/useCart'

interface ProductDetail {
  id: number
  name: string
  description: string
  price: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
  category: {
    id: number
    name: string
    description: string
  }
  store: {
    id: number
    name: string
    slug: string
    description: string
    logo: string
  }
}

interface ProductDetailResponse {
  data: ProductDetail
}

export function useProductDetailPage(slug: string, productId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Buscar dados do produto
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', slug, productId],
    queryFn: async (): Promise<ProductDetail> => {
      const response = await api.get<ProductDetailResponse>(`/catalog/store/${slug}/products/${productId}`)
      return response.data.data
    },
    enabled: !!slug && !!productId
  })

  // Hook do carrinho
  const { addToCart: addToCartHook, isAddingToCart } = useCart(product?.store?.id)

  // Mapeamento de cores
  const colorMap: Record<string, string> = {
    'Azul': '#3B82F6',
    'Vermelho': '#EF4444',
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Verde': '#10B981',
    'Amarelo': '#F59E0B',
    'Rosa': '#EC4899',
    'Roxo': '#8B5CF6',
    'Laranja': '#F97316',
    'Cinza': '#6B7280',
    'Marrom': '#92400E',
    'Bege': '#F3E8FF',
    'Azul Marinho': '#1E40AF',
    'Verde Oliva': '#65A30D',
    'Coral': '#FB7185',
    'Turquesa': '#06B6D4',
    'Magenta': '#D946EF',
    'Dourado': '#F59E0B',
    'Prata': '#9CA3AF',
    'Cobre': '#B45309'
  }

  // Função para processar cores (separar por vírgula se necessário)
  const processColors = (colors: string[]): string[] => {
    return colors.flatMap(color => 
      typeof color === 'string' ? color.split(',').map(c => c.trim()) : [color]
    ).filter(Boolean)
  }

  // Função para processar tamanhos (separar por vírgula se necessário)
  const processSizes = (sizes: string[]): string[] => {
    return sizes.flatMap(size => 
      typeof size === 'string' ? size.split(',').map(s => s.trim()) : [size]
    ).filter(Boolean)
  }

  // Função para construir URLs de imagens
  const buildImageUrls = (images: string[]): string[] => {
    return images.map(image => buildImageUrl(image))
  }

  // Função para selecionar imagem
  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  // Função para navegar para a imagem anterior
  const previousImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  // Função para navegar para a próxima imagem
  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  // Função para selecionar tamanho
  const selectSize = (size: string) => {
    setSelectedSize(size)
  }

  // Função para selecionar cor
  const selectColor = (color: string) => {
    setSelectedColor(color)
  }

  // Função para aumentar quantidade
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  // Função para diminuir quantidade
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Mutation para adicionar ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error('Produto não encontrado')
      
      const response = await api.post('/cart', {
        product_id: product.id,
        quantity,
        size: selectedSize || '',
        color: selectedColor || '',
        notes: ''
      }, {
        params: {
          store_id: product.store.id
        }
      })
      
      return response.data
    },
    onSuccess: (data) => {
      toast({
        title: 'Produto adicionado!',
        description: data.message || `${product?.name} foi adicionado ao carrinho`,
        variant: 'success'
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Não foi possível adicionar o produto ao carrinho'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Mutation para adicionar aos favoritos
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      // Aqui você implementaria a lógica para adicionar aos favoritos
      // Por enquanto, apenas simula uma requisição
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        productId: product?.id
      }
    },
    onSuccess: () => {
      toast({
        title: 'Adicionado aos favoritos!',
        description: `${product?.name} foi adicionado aos seus favoritos`,
        variant: 'success'
      })
    },
    onError: () => {
      toast({
        title: 'Erro!',
        description: 'Não foi possível adicionar aos favoritos',
        variant: 'destructive'
      })
    }
  })

  // Função para adicionar ao carrinho
  const addToCart = () => {
    if (!product) return
    
    addToCartHook({
      productId: product.id,
      quantity,
      size: selectedSize || '',
      color: selectedColor || '',
      notes: '',
      storeId: product.store.id
    })
  }

  // Função para adicionar aos favoritos
  const addToFavorites = () => {
    if (!product) return
    
    addToFavoritesMutation.mutate()
  }

  return {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    selectImage,
    previousImage,
    nextImage,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    addToFavorites,
    isAddingToCart,
    isAddingToFavorites: addToFavoritesMutation.isPending
  }
}
