import { useState } from 'react'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPrice } from '@/lib/utils'

export function useProdutosPage() {
  const deleteProductMutation = useDeleteProduct()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest' as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest',
    category_id: undefined as number | undefined,
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    size: '',
    color: '',
    status: undefined as number | undefined,
    featured: undefined as boolean | undefined,
    page: 1,
    limit: 12
  })

  const debouncedSearch = useDebounce(filters.search, 500)
  const debouncedMinPrice = useDebounce(filters.min_price, 800)
  const debouncedMaxPrice = useDebounce(filters.max_price, 800)
  
  const debouncedFilters = {
    ...filters,
    search: debouncedSearch,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice
  }

  const { data: productsData, isLoading, error } = useProducts(debouncedFilters)
  const products = productsData?.data || []
  const meta = productsData?.meta

  const availableSizes = Array.from(new Set(
    products.flatMap(p => 
      p.sizes.flatMap(size => 
        typeof size === 'string' ? size.split(',').map(s => s.trim()) : [size]
      )
    )
  )).filter(Boolean).sort()
  
  const availableColors = Array.from(new Set(
    products.flatMap(p => 
      p.colors.flatMap(color => 
        typeof color === 'string' ? color.split(',').map(c => c.trim()) : [color]
      )
    )
  )).filter(Boolean).sort()

  const stats = {
    total: meta?.total || 0,
    active: products.filter(p => p.status === 1).length,
    inactive: products.filter(p => p.status === 0).length,
    featured: products.filter(p => p.featured === 1).length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    averagePrice: products.length > 0
      ? products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length
      : 0
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  // Verificar se está buscando (quando algum valor digitado é diferente do debounced)
  const isSearching = filters.search !== debouncedSearch || 
                     filters.min_price !== debouncedMinPrice || 
                     filters.max_price !== debouncedMaxPrice

  // Função para abrir modal de confirmação
  const openDeleteDialog = (productId: number) => {
    setProductToDelete(productId)
    setShowDeleteDialog(true)
  }

  // Função para deletar produto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return
    
    try {
      await deleteProductMutation.mutateAsync(productToDelete)
      setProductToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
    }
  }

  return {
    filters,
    setFilters,
    products,
    meta,
    availableSizes,
    availableColors,
    stats,
    formatPrice,
    isLoading,
    error,
    handlePageChange,
    handleLimitChange,
    isSearching,
    openDeleteDialog,
    handleDeleteProduct,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting: deleteProductMutation.isPending
  }
}
