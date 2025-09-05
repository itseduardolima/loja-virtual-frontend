'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Label, Textarea, Card, Badge, LoadingSpinner, ErrorState } from '@/components'
import { Plus, Edit, Trash2, Tag, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'

export default function CategoriesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating: isCreatingCategory,
    isUpdating,
    isDeleting
  } = useCategories()

  const form = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      name: '',
      description: undefined
    }
  })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = form

  if (!user) {
    return <ErrorState message="Você precisa estar logado para gerenciar categorias" />
  }

  const onSubmit = (data: CreateCategoryFormData) => {
    if (editingCategory) {
      updateCategory({
        id: editingCategory,
        name: data.name,
        description: data.description,
        image: selectedImage || undefined
      })
    } else {
      createCategory({
        name: data.name,
        description: data.description,
        image: selectedImage || undefined
      })
    }
    
    reset()
    setSelectedImage(null)
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
    setSelectedImage(null)
    setIsCreating(false)
    setEditingCategory(null)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState message="Erro ao carregar categorias" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Categorias
              </h1>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário de Criação/Edição */}
        {isCreating && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Roupas Femininas"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="image">Imagem da Categoria</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva a categoria..."
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingCategory || isUpdating}
                  className="flex items-center gap-2"
                >
                  {(isCreatingCategory || isUpdating) ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {editingCategory ? 'Atualizar' : 'Criar'} Categoria
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories) && categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    ID: {category.id}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {category.image && (
                <div className="mt-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Criado em: {new Date(category.created_at).toLocaleDateString('pt-BR')}
              </div>
            </Card>
          ))}
        </div>

        {(!Array.isArray(categories) || categories.length === 0) && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando sua primeira categoria
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Categoria
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
