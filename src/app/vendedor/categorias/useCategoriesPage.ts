'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { useToastContext } from '@/contexts/ToastContext'
import { CategoryFilters } from '@/types/category'
import { type Column } from '@/components/Table/Table'
import { Edit, Trash2 } from 'lucide-react'

export function useCategoriesPage() {
  const router = useRouter()
  const { success, error: showError } = useToastContext()
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
    sort: 'ASC'
  })

  const debouncedSearch = useDebounce(filters.search, 2000)

  const debouncedFilters = {
    ...filters,
    search: debouncedSearch
  }

  const {
    categories,
    isLoading,
    error,
    deleteCategory,
    updateCategoryStatus,
    isDeleting,
    isUpdatingStatus,
    meta
  } = useCategories(debouncedFilters)

  const handleEdit = (category: any) => {
    router.push(`/vendedor/categorias/editar/${category.id}`)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      deleteCategory(id)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1
      await updateCategoryStatus({ id, status: newStatus })
      success(
        newStatus === 1 ? 'Categoria ativada com sucesso!' : 'Categoria desativada com sucesso!',
        'Status atualizado'
      )
    } catch (err) {
      showError('Erro ao atualizar status da categoria', 'Erro')
    }
  }


  const updateFilters = (newFilters: Partial<CategoryFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }))
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }

  const handleSortChange = (sort: string, sortField: string) => {
    // Mapear os valores para o formato esperado
    const sortMap: { [key: string]: 'ASC' | 'DESC' | 'DATE_ASC' | 'DATE_DESC' } = {
      'ASC': 'ASC',
      'DESC': 'DESC',
      'DATE_ASC': 'DATE_ASC',
      'DATE_DESC': 'DATE_DESC'
    }
    setFilters(prev => ({ ...prev, sort: sortMap[sort] || 'ASC' }))
  }

  const isSearching = filters.search !== debouncedSearch

  const columns: Column<any>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Nome',
      accessor: 'name',
      type: 'text' as const,
    },
    {
      key: 'description',
      header: 'Descrição',
      accessor: (category: any) => category.description || null,
      type: 'text' as const,
      options: {
        className: 'max-w-xs line-clamp-2',
      },
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (category: any) => ({
        value: category.status,
        label: category.status === 1 ? 'Ativa' : 'Inativa',
        color: category.status === 1 ? 'active' : 'inactive',
      }),
      type: 'badge' as const,
      options: {
        badgeColors: {
          active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
          inactive: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
        },
      },
    },
    {
      key: 'products',
      header: 'Produtos',
      accessor: (category: any) => category._count?.products || 0,
      type: 'text' as const,
    },
    {
      key: 'created_at',
      header: 'Criado em',
      accessor: (category: any) => new Date(category.created_at).toLocaleDateString('pt-BR'),
      type: 'date' as const,
    },
    {
      key: 'actions',
      header: 'Ações',
      accessor: 'id',
      type: 'actions' as const,
      options: {
        align: 'right' as const,
        actions: [
          {
            type: 'switch',
            getChecked: (category: any) => category.status === 1,
            onClick: (category: any) => handleToggleStatus(category.id, category.status),
            getDisabled: () => isUpdatingStatus,
            className: 'data-[state=checked]:bg-green-500',
          },
          {
            type: 'button',
            icon: Edit,
            variant: 'ghost' as const,
            onClick: (category: any) => handleEdit(category),
            className: 'h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50',
          },
          {
            type: 'button',
            icon: Trash2,
            variant: 'ghost' as const,
            onClick: (category: any) => handleDelete(category.id),
            getDisabled: () => isDeleting,
            className: 'h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50',
          },
        ],
      },
    },
  ], [handleToggleStatus, handleEdit, handleDelete, isUpdatingStatus, isDeleting])

  return {
    filters,
    
    categories,
    isLoading,
    error,
    meta,
    
    handleEdit,
    handleDelete,
    handleToggleStatus,
    
    updateFilters,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    setFilters,
    isSearching,
    
    isDeleting,
    isUpdatingStatus,
    
    // Table
    columns,
  }
}
