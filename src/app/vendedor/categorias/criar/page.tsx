'use client'

import { Button, Input, Label, Textarea, Card, LoadingSpinner } from '@/components'
import { Plus, X, Tag, ArrowLeft, ChevronLeft } from 'lucide-react'
import { LoadingPage } from '@/components/Layout'
import { useNewCategoryPage } from './useNewCategoryPage'

export default function NewCategoryPage() {
  const {
    user,
    authLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    isCreating,
    handleCancel,
  } = useNewCategoryPage()

  if (authLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-6 -ml-5"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 bg-white border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Tag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Nova Categoria
              </h2>
              <p className="text-sm text-gray-500">
                Crie uma nova categoria para seus produtos
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                Nome da Categoria *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Roupas Femininas"
                className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                Descrição
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva a categoria..."
                rows={3}
                className={`${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className="px-6">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="px-6"
              >
                {isCreating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Criar Categoria
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
