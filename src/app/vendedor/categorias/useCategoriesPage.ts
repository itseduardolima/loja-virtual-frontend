'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCategories } from '@/hooks/useCategories'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'
import { useDebounce } from '@/hooks/useDebounce'
import { useToastContext } from '@/contexts/ToastContext'

export interface CategoryFilters {
  page: number
  limit: number
  search: string
  status?: number
  sort: string
}

export function useCategoriesPage() {
  const { success, error: showError } = useToastContext()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: 1,
    sort: 'ASC'
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  const debouncedFilters = {
    ...filters,
    search: debouncedSearch
  }

  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryStatus,
    isCreating: isCreatingCategory,
    isUpdating,
    isDeleting,
    isUpdatingStatus,
    meta
  } = useCategories(debouncedFilters)

  const form = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      name: '',
      description: undefined
    }
  })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = form

  const onSubmit = (data: CreateCategoryFormData) => {
    if (editingCategory) {
      updateCategory({
        id: editingCategory,
        name: data.name,
        description: data.description
      })
    } else {
      createCategory({
        name: data.name,
        description: data.description
      })
    }
    
    reset()
    setIsCreating(false)
    setEditingCategory(null)
  }

  const handleEdit = (category: any) => {
    setValue('name', category.name)
    setValue('description', category.description || '')
    setEditingCategory(category.id)
    setIsCreating(true)
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

  const cancelForm = () => {
    reset()
    setIsCreating(false)
    setEditingCategory(null)
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

  return {
    isCreating,
    editingCategory,
    filters,
    
    categories,
    isLoading,
    error,
    meta,
    
    form,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    
    onSubmit,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    cancelForm,
    setIsCreating,
    
    updateFilters,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    setFilters,
    isSearching,
    
    isCreatingCategory,
    isUpdating,
    isDeleting,
    isUpdatingStatus
  }
}
