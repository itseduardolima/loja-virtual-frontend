import { useState } from 'react'
import { useProducts, useUpdateProductStatus } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPrice } from '@/lib/utils'
import { useToastContext } from '@/contexts/ToastContext'

export function useProdutosPage() {
  const updateStatusMutation = useUpdateProductStatus()
  const { success: showSuccess, error: showError } = useToastContext()

  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest',
    category_id: undefined as number | undefined,
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    size: '',
    color: '',
    status: undefined as number | undefined,
    featured: undefined as boolean | undefined,
    page: 1,
    limit: 10
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
    featured: products.filter(p => p.featured).length,
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


  const handleToggleStatus = async (productId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      await updateStatusMutation.mutateAsync({ id: productId, status: newStatus })
      showSuccess(
        newStatus === 1 ? 'Produto disponibilizado!' : 'Produto esgotado!', 
        'Status atualizado'
      )
    } catch (error) {
      showError('Erro ao atualizar status do produto', 'Erro')
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
    handleToggleStatus,
    isUpdatingStatus: updateStatusMutation.isPending
  }
}
