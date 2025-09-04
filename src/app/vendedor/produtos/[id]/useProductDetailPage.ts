import { useState } from 'react'
import { useProduct } from '@/hooks/useProducts'
import { buildImageUrl } from '@/lib/utils'

export function useProductDetailPage(productId: string) {
  const { data: product, isLoading, error } = useProduct(productId)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  // Mapeamento de cores para valores hexadecimais
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

  // Função para formatar preço
  const formatPrice = (price: string | number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(price.toString()))
  }

  // Função para obter status do produto
  const getStatusInfo = (status: number) => {
    return status === 1 
      ? { text: 'Ativo', color: 'bg-green-100 text-green-800 border-green-200' }
      : { text: 'Inativo', color: 'bg-red-100 text-red-800 border-red-200' }
  }

  // Função para obter status de destaque
  const getFeaturedInfo = (featured: number) => {
    return featured === 1 
      ? { text: 'Em Destaque', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
      : { text: 'Normal', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  // Função para incrementar quantidade
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  // Função para decrementar quantidade
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Função para selecionar tamanho
  const selectSize = (size: string) => {
    setSelectedSize(size)
  }

  // Função para selecionar imagem
  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  return {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedSize,
    quantity,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    formatPrice,
    getStatusInfo,
    getFeaturedInfo,
    incrementQuantity,
    decrementQuantity,
    selectSize,
    selectImage
  }
}
