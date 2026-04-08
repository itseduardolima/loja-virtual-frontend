import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { buildImageUrl } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { useCart } from '@/hooks/useCart'
import { ProductDetail, ProductDetailResponse } from '@/types/product'

export function useProductDetailPage(slug: string, productId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const colorInitialized = useRef(false)

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

  // Inicializar cor selecionada quando o produto carregar e tiver imagens por cor
  useEffect(() => {
    if (!product || colorInitialized.current) return

    // Verificar se há images_by_color ou images como objeto
    let imagesByColor: Record<string, string[]> | null = null

    if (product.images_by_color && Object.keys(product.images_by_color).length > 0) {
      imagesByColor = product.images_by_color
    } else if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
      imagesByColor = product.images as Record<string, string[]>
    }

    if (imagesByColor && Object.keys(imagesByColor).length > 0) {
      // Selecionar a primeira cor disponível automaticamente
      const firstColor = Object.keys(imagesByColor)[0]
      setSelectedColor(firstColor)
      colorInitialized.current = true
    }
  }, [product])

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

  // Função para obter imagens baseado na cor selecionada
  const getImagesForColor = (): string[] => {
    if (!product) return []
    
    // Obter objeto de imagens por cor (pode vir em images_by_color ou images como objeto)
    let imagesByColor: Record<string, string[]> | null = null
    
    if (product.images_by_color && Object.keys(product.images_by_color).length > 0) {
      imagesByColor = product.images_by_color
    } else if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
      imagesByColor = product.images as Record<string, string[]>
    }
    
    // Se houver imagens por cor
    if (imagesByColor && Object.keys(imagesByColor).length > 0) {
      // Se uma cor está selecionada e tem imagens, usar imagens daquela cor
      if (selectedColor && imagesByColor[selectedColor]) {
        return imagesByColor[selectedColor]
      }
      // Se não há cor selecionada, usar imagens da primeira cor disponível
      const firstColor = Object.keys(imagesByColor)[0]
      return imagesByColor[firstColor] || []
    }
    
    // Caso contrário, usar todas as imagens (compatibilidade com formato antigo - array)
    return Array.isArray(product.images) ? product.images : []
  }

  // Função para construir URLs de imagens
  const buildImageUrls = (images: string[]): string[] => {
    return images.map(image => buildImageUrl(image))
  }

  // Obter imagens atuais baseado na cor selecionada
  const currentImages = getImagesForColor()

  // Função para selecionar imagem
  const selectImage = (index: number) => {
    if (index >= 0 && index < currentImages.length) {
      setSelectedImageIndex(index)
    }
  }

  // Função para navegar para a imagem anterior
  const previousImage = () => {
    if (currentImages.length > 0) {
      setSelectedImageIndex(prev => 
        prev === 0 ? currentImages.length - 1 : prev - 1
      )
    }
  }

  // Função para navegar para a próxima imagem
  const nextImage = () => {
    if (currentImages.length > 0) {
      setSelectedImageIndex(prev => 
        prev === currentImages.length - 1 ? 0 : prev + 1
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
    // Resetar índice da imagem quando trocar de cor
    setSelectedImageIndex(0)
  }

  // Estoque atual baseado na variação selecionada
  const currentStock = (() => {
    if (!product) return 0
    const hasVariants = product.variant_stocks && product.variant_stocks.length > 0
    if (!hasVariants) return product.stock

    const match = product.variant_stocks!.find(v => {
      const colorMatch = !v.color || v.color === selectedColor
      const sizeMatch = !v.size || v.size === selectedSize
      return colorMatch && sizeMatch
    })

    // Se cor e tamanho estão selecionados mas não há entrada exata, retorna 0
    if (selectedColor && selectedSize) return match?.stock ?? 0
    // Se só cor selecionada mas produto tem tamanhos: não mostrar estoque ainda (forçar seleção de tamanho)
    if (selectedColor && !selectedSize) {
      const hasSizes = product.variant_stocks!.some(v => v.size)
      if (hasSizes) return 0
      return product.variant_stocks!
        .filter(v => v.color === selectedColor)
        .reduce((sum, v) => sum + v.stock, 0)
    }
    // Se só tamanho selecionado (produto sem cor): usa o match direto
    if (!selectedColor && selectedSize) return match?.stock ?? 0
    // Nenhum selecionado: total geral
    return product.stock
  })()

  // Função para aumentar quantidade
  const increaseQuantity = () => {
    if (quantity < currentStock) {
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
    onSuccess: () => {
      // Toast removido - a animação visual substitui o toast
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
    currentStock,
    processColors,
    processSizes,
    currentImages,
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
