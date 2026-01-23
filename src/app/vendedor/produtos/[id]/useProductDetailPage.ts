import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProduct, useDeleteProduct } from '@/hooks/useProducts'
import { buildImageUrl } from '@/lib/utils'
import { useToastContext } from '@/contexts/ToastContext'

export function useProductDetailPage(productId: string) {
  const router = useRouter()
  const { error: showErrorToast } = useToastContext()
  const { data: product, isLoading, error } = useProduct(productId)
  const deleteProductMutation = useDeleteProduct()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  // Função para obter imagens por cor
  const getImagesByColor = (): Record<string, string[]> => {
    if (!product) return {}
    
    // Verificar se images é um objeto (formato novo)
    if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
      return product.images as Record<string, string[]>
    }
    
    // Verificar se images_by_color existe
    if (product.images_by_color && typeof product.images_by_color === 'object' && !Array.isArray(product.images_by_color)) {
      return product.images_by_color
    }
    
    return {}
  }

  // Obter imagens por cor
  const imagesByColor = getImagesByColor()

  // Função para obter imagens da cor selecionada
  const getImagesForColor = (): string[] => {
    if (!selectedColor || !imagesByColor[selectedColor]) {
      // Se não há cor selecionada ou a cor não tem imagens, retornar primeira cor disponível
      const firstColor = Object.keys(imagesByColor)[0]
      return firstColor ? imagesByColor[firstColor] : []
    }
    return imagesByColor[selectedColor]
  }

  // Obter imagens atuais baseado na cor selecionada
  const currentImages = getImagesForColor()

  // Inicializar cor selecionada quando o produto carregar
  useEffect(() => {
    if (product && Object.keys(imagesByColor).length > 0 && !selectedColor) {
      // Selecionar a primeira cor disponível
      const firstColor = Object.keys(imagesByColor)[0]
      setSelectedColor(firstColor)
      setSelectedImageIndex(0)
    }
  }, [product, imagesByColor, selectedColor])

  // Função para construir URLs de imagens
  const buildImageUrls = (images: string[]): string[] => {
    return images.map(image => buildImageUrl(image))
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

  // Função para selecionar cor
  const selectColor = (color: string) => {
    if (imagesByColor[color] && imagesByColor[color].length > 0) {
      setSelectedColor(color)
      setSelectedImageIndex(0) // Resetar índice ao trocar de cor
    }
  }

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

  // Função para abrir modal de confirmação
  const openDeleteDialog = () => {
    setShowDeleteDialog(true)
  }

  // Função para deletar produto
  const handleDeleteProduct = async () => {
    if (!product?.id) return
    
    try {
      await deleteProductMutation.mutateAsync(product.id)
      setShowDeleteDialog(false)
      router.push('/vendedor/produtos')
    } catch (error: any) {
      const errorData = error.response?.data
      let errorMessage = 'Erro ao deletar produto'
      
      if (errorData?.message) {
        errorMessage = errorData.message
      }
      
      showErrorToast(errorMessage, 'Erro!')
      console.error('Erro ao deletar produto:', error)
    }
  }

  return {
    product,
    isLoading,
    error,
    selectedImageIndex,
    selectedColor,
    currentImages,
    imagesByColor,
    colorMap,
    processColors,
    processSizes,
    buildImageUrls,
    getStatusInfo,
    getFeaturedInfo,
    selectColor,
    selectImage,
    previousImage,
    nextImage,
    openDeleteDialog,
    handleDeleteProduct,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting: deleteProductMutation.isPending
  }
}
