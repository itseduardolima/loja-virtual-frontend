import { useEffect, useState } from 'react'
import { useProducts, useUpdateProductStatus, useDuplicateProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPrice } from '@/lib/utils'
import { useToastContext } from '@/contexts/ToastContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/hooks/useStore'
import type { Product } from '@/types'

export function useProdutosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams?.get('search') ?? ''
  const updateStatusMutation = useUpdateProductStatus()
  const duplicateMutation = useDuplicateProduct()
  const deleteMutation = useDeleteProduct()
  const { success: showSuccess, error: showError } = useToastContext()
  const { data: storeData } = useStore()
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const [filters, setFilters] = useState({
    search: initialSearch,
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

  useEffect(() => {
    const urlSearch = searchParams?.get('search') ?? ''
    setFilters((prev) => (prev.search === urlSearch ? prev : { ...prev, search: urlSearch, page: 1 }))
  }, [searchParams])

  const debouncedSearch = useDebounce(filters.search, 400)
  const debouncedMinPrice = useDebounce(filters.min_price, 400)
  const debouncedMaxPrice = useDebounce(filters.max_price, 400)
  
  const debouncedFilters = {
    ...filters,
    search: debouncedSearch,
    min_price: debouncedMinPrice,
    max_price: debouncedMaxPrice
  }

  const { data: productsData, isLoading, error } = useProducts(debouncedFilters)
  const products = productsData?.data || []
  const meta = productsData?.meta
  const apiStats = productsData?.stats

  // Extrair tamanhos e cores dos campos dinâmicos
  const availableSizes = Array.from(new Set(
    products.flatMap(p => 
      p.dynamic_fields
        ?.filter(field => field.field_name.toLowerCase().includes('tamanho') || field.field_name.toLowerCase().includes('size'))
        ?.map(field => field.value) || []
    )
  )).filter(Boolean).sort()
  
  const availableColors = Array.from(new Set(
    products.flatMap(p => 
      p.dynamic_fields
        ?.filter(field => field.field_name.toLowerCase().includes('cor') || field.field_name.toLowerCase().includes('color'))
        ?.map(field => field.value) || []
    )
  )).filter(Boolean).sort()

  const stats = {
    total: apiStats?.total ?? 0,
    active: apiStats?.total_active ?? 0,
    // Aproximação: todos os não-ativos (inativos + rascunhos). Calculado via API para não ser limitado pela página atual.
    inactive: apiStats ? (apiStats.total - apiStats.total_active) : 0,
    featured: apiStats?.total_featured ?? 0,
    totalStock: apiStats?.total_in_stock ?? 0,
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
      // Rascunho (2) → publicado (1); ativo (1) → inativo (0); inativo (0) → ativo (1)
      const newStatus = currentStatus === 2 ? 1 : currentStatus === 1 ? 0 : 1
      await updateStatusMutation.mutateAsync({ id: productId, status: newStatus })
      const label = newStatus === 1 ? 'Produto publicado!' : 'Produto desativado!'
      showSuccess(label, 'Status atualizado')
    } catch (error) {
      showError('Erro ao atualizar status do produto', 'Erro')
    }
  }

  const handleDuplicate = async (productId: number) => {
    try {
      const result = await duplicateMutation.mutateAsync(productId)
      showSuccess('Produto duplicado com sucesso!', 'Duplicado')
      router.push(`/vendedor/produtos/editar/${result.data.id}`)
    } catch (error) {
      showError('Erro ao duplicar produto', 'Erro')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      showSuccess('Produto excluído com sucesso!', 'Excluído')
      setDeleteTarget(null)
    } catch (error) {
      showError('Erro ao excluir produto', 'Erro')
    }
  }

  return {
    filters,
    setFilters,
    storeSlug: storeData?.slug as string | undefined,
    deleteTarget,
    setDeleteTarget,
    handleConfirmDelete,
    isDeleting: deleteMutation.isPending,
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
    isUpdatingStatus: updateStatusMutation.isPending,
    handleDuplicate,
    isDuplicating: duplicateMutation.isPending
  }
}
