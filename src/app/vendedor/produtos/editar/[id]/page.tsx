'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, ErrorState, ImageUpload, ProductPreview, DynamicFields, CreateCategoryModal, Button } from '@/components'
import { Package, X, Star, Plus } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEditProductPage } from './useEditProductPage'
import { useStore } from '@/hooks/useStore'
import { useNiches } from '@/hooks/useNiches'
import LoadingPage from '@/components/LoadingPage'
import { useState, useEffect, useMemo } from 'react'

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { data: storeData, isLoading: storeLoading } = useStore()
  const { data: nichesData, isLoading: nichesLoading } = useNiches(storeData?.id || null)
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)

  const {
    form,
    product,
    selectedImages,
    categories,
    selectedNicheId,
    nicheFieldValues,
    nicheFields,
    removedExistingImages,
    isInitialized,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    handleNicheSelect,
    handleFieldChange,
    onSubmit
  } = useEditProductPage(productId, user)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  // Estado local para controlar renderização dos selects
  const [showSelects, setShowSelects] = useState(false)

  // Mostrar selects apenas quando tudo estiver carregado
  useEffect(() => {
    if (isInitialized && selectedNicheId && nichesData) {
      setShowSelects(true)
    }
  }, [isInitialized, selectedNicheId, nichesData])

  const handleCategoryCreated = (categoryId: number) => {
    setValue('category_id', categoryId)
    setIsCreateCategoryModalOpen(false)
  }

  // Validar se todos os campos obrigatórios estão preenchidos
  const nameValue = watch('name')
  const priceValue = watch('price')
  const isFormValid = useMemo(() => {
    const existingImages = product?.images || []
    const remainingImages = existingImages.filter((_: any, index: number) => !removedExistingImages?.includes(index))
    const hasImages = selectedImages.length > 0 || remainingImages.length > 0

    return !!(
      nameValue &&
      nameValue.trim().length >= 3 &&
      priceValue &&
      priceValue > 0 &&
      selectedNicheId &&
      hasImages
    )
  }, [nameValue, priceValue, selectedNicheId, selectedImages.length, product?.images, removedExistingImages])

  if (authLoading || storeLoading || nichesLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para editar produtos" />
  }

  if (!storeData) {
    return <ErrorState message="Erro ao carregar informações da loja" />
  }

  if (isLoading && !product) {
    return <LoadingPage />
  }


  if (!product) {
    return <ErrorState message="Produto não encontrado" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          {/* Layout em Duas Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Coluna Principal - Informações do Produto */}
            <div className="lg:col-span-2 space-y-6">

              {/* Informações Básicas */}
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <Package className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
                    <p className="text-sm text-gray-500">Dados essenciais do produto</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Nicho */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                    <div>
                      <Label htmlFor="niche" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Tipo do Produto *
                      </Label>
                      {showSelects ? (
                        <Select
                          value={selectedNicheId?.toString() || ''}
                          onValueChange={(value) => handleNicheSelect(parseInt(value))}
                        >
                          <SelectTrigger className={`h-12 ${!selectedNicheId ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}>
                            <SelectValue placeholder="Selecione o tipo do produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {nichesData?.data?.map((niche) => (
                              <SelectItem key={niche.id} value={niche.id.toString()}>
                                {niche.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-12 bg-gray-100 rounded-md flex items-center px-3">
                          <span className="text-gray-500">Carregando...</span>
                        </div>
                      )}
                      {!selectedNicheId && showSelects && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Selecione o tipo do produto
                        </p>
                      )}
                    </div>
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

                  {/* Preço com Desconto */}
                  <div>
                    <Label htmlFor="discount_price" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Valor de Desconto <span className="text-gray-400 font-normal">(opcional)</span>
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Valor que será descontado do preço original do produto
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <Input
                        id="discount_price"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('discount_price', { valueAsNumber: true })}
                        placeholder="0,00"
                        value={watch('discount_price') || ''}
                        className={`h-12 pl-8 text-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors.discount_price ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                      />
                    </div>
                    {errors.discount_price && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.discount_price.message}
                      </p>
                    )}
                  </div>

                  {/* Categoria e Destaque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Categoria <span className="text-gray-400 font-normal">(opcional)</span>
                      </Label>
                      {Array.isArray(categories) && categories.length > 0 ? (
                        showSelects ? (
                          <Select
                            value={watch('category_id') ? watch('category_id')?.toString() : ''}
                            onValueChange={(value) => setValue('category_id', parseInt(value))}
                          >
                            <SelectTrigger className={`h-12 ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}>
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
                        ) : (
                          <div className="h-12 bg-gray-100 rounded-md flex items-center px-3">
                            <span className="text-gray-500">Carregando...</span>
                          </div>
                        )
                      ) : (
                        <div className="space-y-3">
                          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                            <p className="text-gray-500 text-sm mb-3">
                              Nenhuma categoria criada ainda
                            </p>
                            <Button
                              type="button"
                              variant="default"
                              onClick={() => setIsCreateCategoryModalOpen(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Nova Categoria
                            </Button>
                          </div>
                        </div>
                      )}
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

              {/* Campos Dinâmicos do Nicho */}
              {selectedNicheId && isInitialized && (
                <DynamicFields
                  nicheId={selectedNicheId}
                  fieldValues={nicheFieldValues}
                  onFieldChange={handleFieldChange}
                />
              )}

              {/* Upload de Imagens */}
              <ImageUpload
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                existingImages={product?.images || []}
                onRemoveExistingImage={removeExistingImage}
                removedExistingImages={removedExistingImages}
              />

            </div>

            {/* Sidebar - Preview e Ações */}
            <ProductPreview
              name={watch('name') || ''}
              description={watch('description') || ''}
              price={watch('price') || 0}
              featured={watch('featured') || false}
              selectedImages={selectedImages}
              category={categories.find(cat => cat.id === watch('category_id'))}
              stock={watch('stock') || 0}
              dynamicFields={Object.values(nicheFieldValues).map(fieldValue => {
                const field = nicheFields?.find(f => f.id === fieldValue.field_id)
                return {
                  field_name: field?.name || `Campo ${fieldValue.field_id}`,
                  value: Array.isArray(fieldValue.value) ? fieldValue.value.join(', ') : fieldValue.value
                }
              })}
              existingImages={product?.images || []}
              removedExistingImages={removedExistingImages}
              onSave={handleSubmit(onSubmit)}
              onCancel={() => router.push('/vendedor/produtos')}
              isLoading={isLoading}
              isDisabled={!isFormValid}
            />
          </div>

        </form>

        {/* Modal para criar categoria */}
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      </div>
    </div>
  )
}
