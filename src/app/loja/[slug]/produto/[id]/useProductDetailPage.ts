import { useState, useEffect, useRef, useCallback } from 'react'
import { AxiosError } from 'axios'
import { buildImageUrl } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useProductReviews } from '@/hooks/useProductReviews'
import { useProductQuestionsCount } from '@/hooks/useProductQuestions'
import { useWishlist } from '@/hooks/useWishlist'
import { useStoreProduct } from '@/hooks/useStoreProduct'
import { useAuth } from '@/contexts/AuthContext'
import { isOwnStore } from '@/lib/storefront'

interface AnimationData {
  imageUrl: string
  startElement: HTMLElement | null
  endElement: HTMLElement | null
}

export function useProductDetailPage(slug: string, productId: string) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const colorInitialized = useRef(false)

  // Store info (used for AnnouncementBar, StoreHeader, footer, WhatsApp widget)
  const { storeInfo } = useStoreInfo(slug)

  // Add-to-cart animation state (inlined from useAddToCartAnimation)
  const [animationData, setAnimationData] = useState<AnimationData | null>(null)

  const triggerAnimation = useCallback((imageUrl: string, startElementId: string) => {
    const startElement = document.getElementById(startElementId)
    const endElement = document.getElementById('cart-icon-button')
    if (!startElement || !endElement) return
    setAnimationData({ imageUrl, startElement, endElement })
  }, [])

  const onAnimationComplete = useCallback(() => {
    setAnimationData(null)
  }, [])

  // Buscar dados do produto
  const { data: product, isLoading, error, refetch } = useStoreProduct(slug, productId)

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

  // Reviews summary (used for rating display + section count badge)
  const { summary: reviewsSummary } = useProductReviews(slug, productId)

  // Questions count (used for section count badge)
  const questionsTotal = useProductQuestionsCount(slug, productId)

  // Wishlist
  const { isInWishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist()
  const { user } = useAuth()
  const showWishlist = !isOwnStore(user, storeInfo)

  const productNotFound =
    !isLoading && !!(error && (error as AxiosError)?.response?.status === 404)

  return {
    product,
    isLoading,
    error,
    refetch,
    productNotFound,
    selectedImageIndex,
    selectedSize,
    selectedColor,
    quantity,
    currentStock,
    currentImages,
    buildImageUrls,
    selectSize,
    selectColor,
    increaseQuantity,
    decreaseQuantity,
    addToCart,
    isAddingToCart,
    // Store info
    storeInfo,
    // Cart animation
    animationData,
    triggerAnimation,
    onAnimationComplete,
    // Reviews
    reviewsSummary,
    // Questions
    questionsTotal,
    // Wishlist
    isInWishlist,
    toggleWishlist,
    wishlistLoading,
    showWishlist,
  }
}
