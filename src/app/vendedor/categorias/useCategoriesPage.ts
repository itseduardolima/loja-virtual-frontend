'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCategories } from '@/hooks/useCategories'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'
import { useDebounce } from '@/hooks/useDebounce'

export interface CategoryFilters {
  page: number
  limit: number
  search: string
  status?: number
  sort: string
}

export function useCategoriesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 12,
    search: '',
    status: 1,
    sort: 'name_asc'
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
    isCreating: isCreatingCategory,
    isUpdating,
    isDeleting,
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
    cancelForm,
    setIsCreating,
    
    updateFilters,
    handlePageChange,
    handleSearchChange,
    setFilters,
    isSearching,
    
    isCreatingCategory,
    isUpdating,
    isDeleting
  }
}
