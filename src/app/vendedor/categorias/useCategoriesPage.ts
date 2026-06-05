'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { useToastContext } from '@/contexts/ToastContext'
import { AxiosError } from 'axios'
import { Category, CategoryFilters } from '@/types/category'

export function useCategoriesPage() {
  const router = useRouter()
  const { success, error: showError } = useToastContext()

  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
    sort: 'ASC',
  })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const debouncedSearch = useDebounce(filters.search, 400)
  const debouncedFilters = { ...filters, search: debouncedSearch }

  const {
    categories,
    isLoading,
    error,
    deleteCategory,
    updateCategoryStatus,
    isDeleting,
    isUpdatingStatus,
    meta,
  } = useCategories(debouncedFilters)

  const isSearching = filters.search !== debouncedSearch

  const handleEdit = (category: Category) => {
    router.push(`/vendedor/categorias/editar/${category.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteCategory(deleteTarget.id, {
      onSuccess: () => {
        success('Categoria excluída com sucesso!', 'Sucesso')
        setDeleteTarget(null)
      },
      onError: (err: AxiosError<{ message?: string }>) => {
        showError(err.response?.data?.message || err.message || 'Erro ao excluir categoria', 'Erro')
      },
    })
  }

  const handleToggleStatus = async (category: Category) => {
    try {
      const newStatus = category.status === 1 ? 0 : 1
      await updateCategoryStatus({ id: category.id, status: newStatus })
      success(
        newStatus === 1 ? 'Categoria ativada com sucesso!' : 'Categoria desativada com sucesso!',
        'Status atualizado',
      )
    } catch {
      showError('Erro ao atualizar status da categoria', 'Erro')
    }
  }

  return {
    filters,
    setFilters,
    categories: categories as Category[],
    isLoading,
    error,
    meta,
    isSearching,
    handleEdit,
    handlePageChange,
    handleToggleStatus,
    isUpdatingStatus,
    deleteTarget,
    setDeleteTarget,
    handleConfirmDelete,
    isDeleting,
  }
}
