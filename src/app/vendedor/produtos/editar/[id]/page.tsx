'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, ErrorState, ImageUpload, ImageUploadByColor, ProductPreview, CreateCategoryModal, Button, ProductSteps } from '@/components'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { DynamicFields } from '@/components/Form/DynamicFields'
import { Package, X, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEditProductPage } from './useEditProductPage'
import { useStore } from '@/hooks/useStore'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useState, useMemo } from 'react'

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Dados essenciais' },
  { id: 2, title: 'Tipo de Produto', description: 'Nicho e campos' },
  { id: 3, title: 'Imagens', description: 'Fotos do produto' },
  { id: 4, title: 'Especificações', description: 'Detalhes adicionais' },
]

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { data: storeData, isLoading: storeLoading } = useStore()
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const {
    form,
    product,
    selectedImages,
    imagesByColor,
    setImagesByColor,
    categories,
    niches,
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    removedExistingImages,
    removedImagesByColor,
    setRemovedImagesByColor,
    isInitialized,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    removeExistingImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  } = useEditProductPage(productId, user)

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = form

  const handleCategoryCreated = (categoryId: number) => {
    setValue('category_id', categoryId)
    setIsCreateCategoryModalOpen(false)
  }

  // Validar etapa atual
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        // Validar campos básicos obrigatórios
        const nameValid = await trigger('name')
        const priceValid = await trigger('price')
        return nameValid && priceValid
      case 2:
        // Etapa 2 é opcional (tipo de produto)
        return true
      case 3:
        // Validar se há imagens
        const hasImagesByColor = Object.keys(imagesByColor).length > 0 && 
          Object.values(imagesByColor).some(images => images.length > 0)
        const hasSimpleImages = selectedImages.length > 0
        const remainingExistingImages = Array.isArray(product?.images) 
          ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
          : []
        const hasExistingImages = remainingExistingImages.length > 0
        
        // Verificar imagens por cor existentes
        const hasExistingImagesByColor = product?.images_by_color && 
          typeof product.images_by_color === 'object' && 
          !Array.isArray(product.images_by_color) &&
          Object.keys(product.images_by_color).some(color => {
            const colorImages = product.images_by_color[color] || []
            const removedIndices = removedImagesByColor[color] || []
            return colorImages.length > removedIndices.length
          })
        
        return hasImagesByColor || hasSimpleImages || hasExistingImages || hasExistingImagesByColor
      case 4:
        // Etapa 4 é opcional (especificações)
        return true
      default:
        return true
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = async (step: number) => {
    // Validar etapas anteriores antes de permitir navegação
    for (let i = 1; i < step; i++) {
      const isValid = await validateStep(i)
      if (!isValid && !completedSteps.includes(i)) {
        return // Não permite pular etapas não validadas
      }
    }
    setCurrentStep(step)
  }

  // Validar se todos os campos obrigatórios estão preenchidos
  const nameValue = watch('name')
  const priceValue = watch('price')
  const isFormValid = useMemo(() => {
    const hasImagesByColor = Object.keys(imagesByColor).length > 0 && 
      Object.values(imagesByColor).some(images => images.length > 0)
    const hasSimpleImages = selectedImages.length > 0
    const remainingExistingImages = Array.isArray(product?.images) 
      ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
      : []
    const hasExistingImages = remainingExistingImages.length > 0
    
    // Verificar imagens por cor existentes
    const hasExistingImagesByColor = product?.images_by_color && 
      typeof product.images_by_color === 'object' && 
      !Array.isArray(product.images_by_color) &&
      Object.keys(product.images_by_color).some(color => {
        const colorImages = product.images_by_color[color] || []
        const removedIndices = removedImagesByColor[color] || []
        return colorImages.length > removedIndices.length
      })
    
    const hasImages = hasImagesByColor || hasSimpleImages || hasExistingImages || hasExistingImagesByColor
    
    return !!(
      nameValue &&
      nameValue.trim().length >= 3 &&
      priceValue &&
      priceValue > 0 &&
      hasImages
    )
  }, [nameValue, priceValue, selectedImages.length, imagesByColor, product?.images, removedExistingImages, removedImagesByColor, product?.images_by_color])

  if (authLoading || storeLoading) {
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

  if (!product || !isInitialized) {
    return <ErrorState message="Produto não encontrado" />
  }

  const renderNavigationButtons = () => (
    <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex gap-3">
        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        )}
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-8 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">Informações Básicas</h2>
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
                  rows={6}
                  className={`${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Preço, Estoque e Desconto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <Label htmlFor="discount_price" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Valor de Desconto <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
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
                    Categoria <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  {Array.isArray(categories) && categories.length > 0 ? (
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

            {renderNavigationButtons()}
          </Card>
        )

      case 2:
        return (
          niches.length > 0 ? (
            <Card className="p-8 bg-white border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">Tipo de Produto</h2>
                  <p className="text-sm text-gray-500">Selecione o nicho para campos personalizados</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Seleção de Nicho */}
                <div className="w-1/3">
                  <Label htmlFor="niche" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Nicho <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Select
                    value={
                      selectedNicheId !== null && 
                      selectedNicheId !== undefined && 
                      typeof selectedNicheId === 'number' && 
                      !isNaN(selectedNicheId) && 
                      selectedNicheId > 0
                        ? selectedNicheId.toString() 
                        : 'none'
                    }
                    onValueChange={(value) => {
                      handleNicheChange(value === 'none' ? null : parseInt(value))
                    }}
                  >
                    <SelectTrigger className="h-12 border-gray-200">
                      <SelectValue placeholder="Selecione um nicho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum nicho selecionado</SelectItem>
                      {niches.map((niche: any) => (
                        <SelectItem key={niche.id} value={niche.id.toString()}>
                          {niche.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campos Dinâmicos */}
                {selectedNicheId && (
                  <DynamicFields
                    nicheId={selectedNicheId}
                    fieldValues={dynamicFieldValues}
                    onFieldChange={handleDynamicFieldChange}
                  />
                )}
              </div>

              {renderNavigationButtons()}
            </Card>
          ) : (
            <Card className="p-8 bg-white border-gray-200 shadow-sm">
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum nicho disponível. Esta etapa é opcional.</p>
              </div>
              {renderNavigationButtons()}
            </Card>
          )
        )

      case 3:
        return (
          <div className="space-y-6">
            {availableColors.length > 0 ? (
              <ImageUploadByColor
                imagesByColor={imagesByColor}
                onImagesByColorChange={setImagesByColor}
                availableColors={availableColors}
                existingImagesByColor={product?.images_by_color || (typeof product?.images === 'object' && !Array.isArray(product?.images) ? product.images : {})}
                onRemoveExistingImage={(color, index) => {
                  setRemovedImagesByColor(prev => ({
                    ...prev,
                    [color]: [...(prev[color] || []), index]
                  }))
                }}
                removedExistingImages={removedImagesByColor}
              />
            ) : (
              <ImageUpload
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                existingImages={Array.isArray(product?.images) ? (product?.images || []) : []}
                onRemoveExistingImage={removeExistingImage}
                removedExistingImages={removedExistingImages}
              />
            )}
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              {renderNavigationButtons()}
            </Card>
          </div>
        )

      case 4:
        return (
          <Card className="p-8 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">Especificações do Produto</h2>
                <p className="text-sm text-gray-500">Informações adicionais sobre o produto</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="specifications" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Especificações <span className="text-gray-400 font-normal">(opcional)</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Informações detalhadas sobre o produto (material, composição, cuidados, etc.)
                </p>
                <RichTextEditor
                  content={watch('specifications') || ''}
                  onChange={(html) => setValue('specifications', html)}
                  placeholder="Ex: Material: 100% algodão. Lavagem: à mão. Composição detalhada..."
                  error={!!errors.specifications}
                />
                {errors.specifications && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.specifications.message}
                  </p>
                )}
              </div>
            </div>

            {renderNavigationButtons()}
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-8">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Editar Produto</h1>
            <p className="text-gray-600">Atualize as informações do produto abaixo</p>
          </div>

          {/* Steps Navigation */}
          <ProductSteps
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Sidebar - Preview (sempre visível, ações apenas na última etapa) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ProductPreview
                  name={watch('name') || ''}
                  description={watch('description') || ''}
                  price={watch('price') || 0}
                  featured={watch('featured') || false}
                  selectedImages={selectedImages}
                  imagesByColor={imagesByColor}
                  category={categories.find(cat => cat.id === watch('category_id'))}
                  stock={watch('stock') || 0}
                  existingImages={Array.isArray(product?.images) ? (product?.images || []) : []}
                  removedExistingImages={removedExistingImages}
                  onSave={handleSubmit(onSubmit)}
                  onCancel={() => router.push('/vendedor/produtos')}
                  isLoading={isLoading}
                  isDisabled={!isFormValid}
                  showActions={currentStep === STEPS.length}
                />
              </div>
            </div>
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
