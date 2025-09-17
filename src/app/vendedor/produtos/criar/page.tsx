'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, Badge, LoadingSpinner, ErrorState, ImageUpload, ProductVariations, ProductPreview } from '@/components'
import { ArrowLeft, Package, X, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCreateProductPage } from './useCreateProductPage'
import { useToastContext } from '@/contexts/ToastContext'

export default function CreateProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { error: showError, success: showSuccess } = useToastContext()

  const {
    form,
    selectedImages,
    selectedSizes,
    selectedColors,
    categories,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    toggleSize,
    toggleColor,
    onSubmit
  } = useCreateProductPage(user)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para criar produtos" />
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

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
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
                    <p className="text-sm text-gray-500">Dados essenciais do produto</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Nome do Produto *
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Ex: Camiseta Básica Feminina"
                      className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Descrição do Produto
                    </Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descreva as características, materiais e benefícios do produto..."
                      rows={4}
                      className={`${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Preço e Estoque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Preço de Venda *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...register('price', { valueAsNumber: true })}
                          placeholder="0,00"
                          value={watch('price') || ''}
                          className={`h-12 pl-8 text-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stock" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Quantidade em Estoque
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        {...register('stock', { valueAsNumber: true })}
                        placeholder="0"
                        value={watch('stock') || ''}
                        className={`h-12 text-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors.stock ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Categoria e Destaque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Categoria
                      </Label>
                      <Select onValueChange={(value) => setValue('category_id', parseInt(value))}>
                        <SelectTrigger className={`h-12 ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(categories) && categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.category_id.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="featured"
                          {...register('featured')}
                          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                        />
                        <Label htmlFor="featured" className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Produto em Destaque
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Upload de Imagens */}
              <ImageUpload
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
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
              onSave={handleSubmit(onSubmit)}
              onCancel={() => router.back()}
              isLoading={isLoading}
            />
          </div>

        </form>
      </div>
    </div>
  )
}

