'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, Badge, LoadingSpinner, ErrorState, ImageUpload, ProductVariations, ProductPreview } from '@/components'
import { ArrowLeft, Package, Edit3 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEditProductPage } from './useEditProductPage'

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const {
    form,
    product,
    selectedImages,
    selectedSizes,
    selectedColors,
    categories,
    removedExistingImages,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    toggleSize,
    toggleColor,
    onSubmit
  } = useEditProductPage(productId, user)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para editar produtos" />
  }

  if (isLoading && !product) {
    return <LoadingSpinner message="Carregando produto..." />
  }

  if (error) {
    return <ErrorState message="Erro ao carregar produto" />
  }

  if (!product) {
    return <ErrorState message="Produto não encontrado" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Estilizado */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/vendedor/produtos')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Layout em Duas Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna Principal - Informações do Produto */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Informações Básicas */}
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
                    <p className="text-sm text-gray-500">Dados principais do produto</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome do Produto *
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Ex: Camiseta Básica"
                      className="h-12 text-base"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descreva seu produto..."
                      rows={4}
                      className="resize-none"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Preço e Estoque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Preço *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price')}
                        placeholder="0,00"
                        value={watch('price') || ''}
                        className="h-12 text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      {errors.price && (
                        <p className="text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                        Estoque
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        {...register('stock')}
                        placeholder="0"
                        value={watch('stock') || ''}
                        className="h-12 text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      {errors.stock && (
                        <p className="text-sm text-red-600">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Categoria
                    </Label>
                    <Select
                      value={watch('category_id')?.toString() || ''}
                      onValueChange={(value) => setValue('category_id', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && (
                      <p className="text-sm text-red-600">{errors.category_id.message}</p>
                    )}
                  </div>

                  {/* Destaque */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Produto em destaque
                    </Label>
                  </div>
                </div>
              </Card>

              {/* Upload de Imagens */}
              <ImageUpload
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                existingImages={product?.images || []}
                onRemoveExistingImage={removeExistingImage}
                removedExistingImages={removedExistingImages}
              />

              {/* Tamanhos e Cores */}
              <ProductVariations
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                onToggleSize={toggleSize}
                onToggleColor={toggleColor}
              />
            </div>

            {/* Sidebar - Preview e Ações */}
            <ProductPreview
              name={watch('name') || ''}
              description={watch('description') || ''}
              price={watch('price') || 0}
              featured={watch('featured') || false}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              selectedImages={selectedImages}
              existingImages={product?.images || []}
              removedExistingImages={removedExistingImages}
              onSave={handleSubmit(onSubmit)}
              onCancel={() => router.push('/vendedor/produtos')}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
