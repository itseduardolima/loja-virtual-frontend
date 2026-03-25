'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, ErrorState, ImageUpload, ImageUploadByColor, ProductPreview, CreateCategoryModal, Button, ProductSteps, ConfirmDialog } from '@/components'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { DynamicFields } from '@/components/Form/DynamicFields'
import { Package, X, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { useEditProductPage } from './useEditProductPage'
import { useStore } from '@/hooks/useStore'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useState, useMemo, useEffect } from 'react'

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Dados essenciais' },
  { id: 2, title: 'Tipo de Produto', description: 'Nicho e campos' },
  { id: 3, title: 'Imagens', description: 'Fotos do produto' },
  { id: 4, title: 'Especificações', description: 'Detalhes adicionais' },
]

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const productId = params.id as string
  const { data: storeData, isLoading: storeLoading } = useStore()
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allowNavigation, setAllowNavigation] = useState(false)

  const {
    form,
    product,
    selectedImages,
    orderedImagesByColor,
    handleOrderedImagesChange,
    categories,
    niches,
    nicheFields,
    selectedNicheId,
    dynamicFieldValues,
    availableColors,
    removedExistingImages,
    isInitialized,
    isLoading,
    error,
    handleImageChange,
    removeImage,
    reorderImages,
    removeExistingImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit
  } = useEditProductPage(productId, user)

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = form

  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleCurrencyInput = (field: 'price' | 'discount_price') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '')
      const cents = parseInt(digits, 10) || 0
      if (cents > 99999999) return
      setValue(field, cents > 0 ? cents / 100 : undefined, { shouldValidate: digits.length > 0 })
    }

  const { ref: priceRef, name: priceName, onBlur: priceOnBlur } = register('price')
  const { ref: discountRef, name: discountName, onBlur: discountOnBlur } = register('discount_price')

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
        if (availableColors.length > 0) {
          // All selected colors must have at least 4 images
          return availableColors.every(color => (orderedImagesByColor[color]?.length || 0) >= 4)
        }
        // No colors: validate simple images (min 4)
        const remainingExistingImages = Array.isArray(product?.images)
          ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
          : []
        const totalSimple = selectedImages.length + remainingExistingImages.length
        const totalColor = Object.values(orderedImagesByColor).reduce((sum, items) => sum + items.length, 0)
        return totalSimple >= 4 || totalColor >= 4
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
  const descriptionValue = watch('description')
  const hasImages = selectedImages.length > 0 ||
    Object.values(orderedImagesByColor).some(items => items.length > 0) ||
    (Array.isArray(product?.images) && product?.images.length > 0 && removedExistingImages.length < (product?.images.length || 0))

  // Verificar se há mudanças não salvas
  useEffect(() => {
    const hasData = !!(nameValue || priceValue || descriptionValue || hasImages)
    setHasUnsavedChanges(hasData)
  }, [nameValue, priceValue, descriptionValue, hasImages])

  // Permitir navegação quando o produto for salvo com sucesso
  useEffect(() => {
    if (isSubmitting && !isLoading && allowNavigation) {
      // Navegação já foi permitida, manter assim
    }
  }, [isLoading, isSubmitting, allowNavigation])

  // Interceptar mudanças de rota via pathname
  useEffect(() => {
    if (hasUnsavedChanges && !showCancelDialog && shouldBlockNavigation) {
      setShouldBlockNavigation(false)
    }
  }, [pathname, hasUnsavedChanges, showCancelDialog, shouldBlockNavigation])

  // Bloquear navegação se houver mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Interceptar navegação do Next.js
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setShouldBlockNavigation(false)
      return
    }

    // Interceptar cliques em links
    const handleLinkClick = (e: MouseEvent) => {
      if (isSubmitting || allowNavigation) return
      
      const target = e.target as HTMLElement
      
      const button = target.closest('button[type="submit"]')
      if (button) {
        return
      }
      
      const link = target.closest('a')
      if (link && hasUnsavedChanges && !showCancelDialog) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && href !== pathname) {
          e.preventDefault()
          e.stopPropagation()
          setPendingNavigation(href)
          setShowCancelDialog(true)
          setShouldBlockNavigation(true)
        }
      }
    }

    // Interceptar navegação do router do Next.js
    const originalPush = router.push.bind(router) as typeof router.push
    const originalBack = router.back.bind(router) as typeof router.back
    const originalReplace = router.replace.bind(router) as typeof router.replace

    const handleRouterPush: typeof router.push = (url: any, options?: any) => {
      if (hasUnsavedChanges && !showCancelDialog && !isLoading && !isSubmitting && !allowNavigation) {
        let targetUrl = ''
        if (typeof url === 'string') {
          targetUrl = url
        } else if (typeof url === 'object' && url !== null) {
          targetUrl = url.pathname || url.href || ''
        }
        
        const currentPath = window.location.pathname
        if (targetUrl && targetUrl !== pathname && targetUrl !== currentPath) {
          setPendingNavigation(targetUrl)
          setShowCancelDialog(true)
          setShouldBlockNavigation(true)
          return Promise.resolve()
        }
      }
      return originalPush(url, options)
    }

    const handleRouterBack: typeof router.back = () => {
      if (hasUnsavedChanges && !showCancelDialog && !isSubmitting && !allowNavigation) {
        setPendingNavigation(null)
        setShowCancelDialog(true)
        setShouldBlockNavigation(true)
        return
      }
      return originalBack()
    }

    const handleRouterReplace: typeof router.replace = (url: any, options?: any) => {
      if (hasUnsavedChanges && !showCancelDialog && !isSubmitting && !allowNavigation) {
        let targetUrl = ''
        if (typeof url === 'string') {
          targetUrl = url
        } else if (typeof url === 'object' && url !== null) {
          targetUrl = url.pathname || url.href || ''
        }
        
        const currentPath = window.location.pathname
        if (targetUrl && targetUrl !== pathname && targetUrl !== currentPath) {
          setPendingNavigation(targetUrl)
          setShowCancelDialog(true)
          setShouldBlockNavigation(true)
          return Promise.resolve()
        }
      }
      return originalReplace(url, options)
    }

    // Sobrescrever métodos do router
    ;(router as any).push = handleRouterPush
    ;(router as any).back = handleRouterBack
    ;(router as any).replace = handleRouterReplace

    document.addEventListener('click', handleLinkClick, true)

    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      ;(router as any).push = originalPush
      ;(router as any).back = originalBack
      ;(router as any).replace = originalReplace
    }
  }, [hasUnsavedChanges, showCancelDialog, pathname, router, isLoading, isSubmitting, allowNavigation])

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true)
    } else {
      router.push('/vendedor/produtos')
    }
  }

  const handleCancelConfirm = () => {
    setShowCancelDialog(false)
    setHasUnsavedChanges(false)
    setAllowNavigation(true)
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    } else {
      router.push('/vendedor/produtos')
    }
  }

  const handleCancelDialogClose = (open: boolean) => {
    if (!open) {
      setShowCancelDialog(false)
      setPendingNavigation(null)
      setShouldBlockNavigation(false)
    }
  }

  const isFormValid = useMemo(() => {
    let hasImages = false

    if (availableColors.length > 0) {
      hasImages = availableColors.every(color => (orderedImagesByColor[color]?.length || 0) >= 4)
    } else {
      const remainingExistingImages = Array.isArray(product?.images)
        ? (product?.images || []).filter((_: any, index: number) => !removedExistingImages.includes(index))
        : []
      const totalSimple = selectedImages.length + remainingExistingImages.length
      const totalColor = Object.values(orderedImagesByColor).reduce((sum, items) => sum + items.length, 0)
      hasImages = totalSimple >= 4 || totalColor >= 4
    }

    return !!(
      nameValue &&
      nameValue.trim().length >= 3 &&
      priceValue &&
      priceValue > 0 &&
      hasImages
    )
  }, [nameValue, priceValue, selectedImages.length, orderedImagesByColor, product?.images, removedExistingImages, availableColors])

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !nameValue || nameValue.trim().length < 3 || !priceValue || priceValue <= 0
      case 2:
        if (!selectedNicheId || nicheFields.length === 0) return false
        return nicheFields.some(field => {
          if (field.required !== 1) return false
          const val = dynamicFieldValues[field.id.toString()]?.value
          if (Array.isArray(val)) return val.length === 0
          return !val || String(val).trim() === ''
        })
      case 3:
        if (availableColors.length > 0) {
          return !availableColors.every(color => (orderedImagesByColor[color]?.length || 0) >= 4)
        }
        const remainingExisting = Array.isArray(product?.images)
          ? (product?.images || []).filter((_: any, i: number) => !removedExistingImages.includes(i))
          : []
        const totalSimple = selectedImages.length + remainingExisting.length
        const totalColor = Object.values(orderedImagesByColor).reduce((sum, items) => sum + items.length, 0)
        return totalSimple < 4 && totalColor < 4
      default:
        return false
    }
  }, [currentStep, nameValue, priceValue, selectedNicheId, nicheFields, dynamicFieldValues, availableColors, orderedImagesByColor, selectedImages, product, removedExistingImages])

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
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 pt-4 sm:pt-6 mt-6 sm:mt-8 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex gap-3 w-full sm:w-auto">
        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isNextDisabled}
            className="flex items-center justify-center gap-2 flex-1 sm:flex-initial"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              onClick={() => {
                setIsSubmitting(true)
                setAllowNavigation(true)
              }}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </>
        )}
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-primary">Informações Básicas</h2>
                <p className="text-xs sm:text-sm text-gray-500">Dados essenciais do produto</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Nome do Produto *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Camiseta Básica Feminina"
                  maxLength={100}
                  className={`h-11 sm:h-12 text-sm sm:text-base ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.name ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  ) : <span />}
                  <span className={`text-xs ${(nameValue?.length || 0) > 85 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {nameValue?.length || 0}/100
                  </span>
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
                  rows={5}
                  maxLength={500}
                  className={`text-sm sm:text-base ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors resize-none`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  ) : <span />}
                  <span className={`text-xs ${(descriptionValue?.length || 0) > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {descriptionValue?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Preço, Estoque e Desconto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Preço de Venda *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">R$</span>
                    <Input
                      id="price"
                      type="text"
                      inputMode="numeric"
                      ref={priceRef}
                      name={priceName}
                      onBlur={priceOnBlur}
                      onChange={handleCurrencyInput('price')}
                      placeholder="0,00"
                      value={priceValue ? formatBRL(Math.round(priceValue * 100)) : ''}
                      className={`h-11 sm:h-12 pl-7 sm:pl-8 text-base sm:text-lg ${errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
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
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">R$</span>
                    <Input
                      id="discount_price"
                      type="text"
                      inputMode="numeric"
                      ref={discountRef}
                      name={discountName}
                      onBlur={discountOnBlur}
                      onChange={handleCurrencyInput('discount_price')}
                      placeholder="0,00"
                      value={watch('discount_price') ? formatBRL(Math.round(watch('discount_price')! * 100)) : ''}
                      className={`h-11 sm:h-12 pl-7 sm:pl-8 text-base sm:text-lg ${errors.discount_price ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                    />
                  </div>
                  {errors.discount_price && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.discount_price.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="stock" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Quantidade em Estoque
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    max="999999"
                    {...register('stock', { valueAsNumber: true })}
                    onKeyDown={(e) => {
                      if (e.ctrlKey || e.metaKey) return
                      if (!/^\d$/.test(e.key)) return
                      const input = e.currentTarget
                      const start = input.selectionStart ?? input.value.length
                      const end = input.selectionEnd ?? input.value.length
                      const simulated = input.value.slice(0, start) + e.key + input.value.slice(end)
                      if (parseInt(simulated, 10) > 999999) e.preventDefault()
                    }}
                    onPaste={(e) => {
                      e.preventDefault()
                      const num = Math.min(parseInt(e.clipboardData.getData('text'), 10), 999999)
                      if (!isNaN(num)) setValue('stock', num, { shouldValidate: true })
                    }}
                    placeholder="0"
                    value={watch('stock') || ''}
                    className={`h-11 sm:h-12 text-base sm:text-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${errors.stock ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Destaque */}
              <div className="flex items-center justify-start sm:justify-center">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 w-full sm:w-auto">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded flex-shrink-0"
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2 text-sm sm:text-base text-gray-800 font-medium cursor-pointer">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                    <span>Produto em Destaque</span>
                  </Label>
                </div>
              </div>
            </div>

            {renderNavigationButtons()}
          </Card>
        )

      case 2:
        return (
          niches.length > 0 ? (
            <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-primary">Tipo de Produto</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Selecione o nicho para campos personalizados</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Seleção de Nicho */}
                <div className="w-full sm:w-1/2 lg:w-1/3">
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
                      // Limpar categoria quando mudar o nicho
                      if (value === 'none') {
                        setValue('category_id', undefined)
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base border-gray-200">
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

                {/* Categoria - Filtrada pelo Nicho */}
                {selectedNicheId && (
                  <div>
                    <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Categoria <span className="text-gray-400 font-normal">(opcional)</span>
                    </Label>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      <Select
                        value={watch('category_id') ? watch('category_id')?.toString() : ''}
                        onValueChange={(value) => setValue('category_id', parseInt(value))}
                      >
                        <SelectTrigger className={`h-11 sm:h-12 text-sm sm:text-base ${errors.category_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200'} transition-colors`}>
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
                            Nenhuma categoria disponível para este tipo de produto
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
                )}

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
            <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-gray-500">Nenhum nicho disponível. Esta etapa é opcional.</p>
              </div>
              {renderNavigationButtons()}
            </Card>
          )
        )

      case 3:
        // Função helper para verificar quais cores têm menos de 4 imagens
        const getColorsWithoutMinImages = () => {
          if (availableColors.length === 0) return []
          return availableColors.filter(color => (orderedImagesByColor[color]?.length || 0) < 4)
        }

        const colorsWithoutMinImages = getColorsWithoutMinImages()

        return (
          <div className="space-y-4 sm:space-y-6">
            {availableColors.length > 0 ? (
              <>
                <ImageUploadByColor
                  orderedImagesByColor={orderedImagesByColor}
                  onOrderedImagesChange={handleOrderedImagesChange}
                  availableColors={availableColors}
                />
                {colorsWithoutMinImages.length > 0 && (
                  <Card className="p-4 bg-red-50 border-red-200 border-2">
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Cada cor precisa de no mínimo 4 imagens
                        </p>
                        <p className="text-sm text-red-700">
                          {colorsWithoutMinImages.map(color => {
                            const count = orderedImagesByColor[color]?.length || 0
                            return `${color} (${count}/4)`
                          }).join(', ')}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <ImageUpload
                selectedImages={selectedImages}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                onReorderImages={reorderImages}
                existingImages={Array.isArray(product?.images) ? (product?.images || []) : []}
                onRemoveExistingImage={removeExistingImage}
                removedExistingImages={removedExistingImages}
              />
            )}
            <Card className="p-4 sm:p-6 bg-white border-gray-200 shadow-sm">
              {renderNavigationButtons()}
            </Card>
          </div>
        )

      case 4:
        return (
          <Card className="p-4 sm:p-6 lg:p-8 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-primary">Especificações do Produto</h2>
                <p className="text-xs sm:text-sm text-gray-500">Informações adicionais sobre o produto</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
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
      <div className="mx-auto sm:px-6 lg:px-8 sm:py-6">
        <form onSubmit={(e) => {
          setIsSubmitting(true)
          setAllowNavigation(true)
          handleSubmit(onSubmit as any)(e)
        }} className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">Editar Produto</h1>
            <p className="text-sm sm:text-base text-gray-600">Atualize as informações do produto abaixo</p>
          </div>

          {/* Steps Navigation */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <ProductSteps
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={completedSteps}
            />
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Sidebar - Preview (oculto no mobile, visível apenas em desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <ProductPreview
                  name={watch('name') || ''}
                  description={watch('description') || ''}
                  price={watch('price') || 0}
                  featured={watch('featured') || false}
                  selectedImages={selectedImages}
                  imagesByColor={Object.fromEntries(
                    Object.entries(orderedImagesByColor).map(([c, items]) => [
                      c,
                      items.filter(i => i.type === 'new').map(i => (i as any).file as File)
                    ])
                  )}
                  category={categories.find(cat => cat.id === watch('category_id'))}
                  stock={watch('stock') || 0}
                  existingImages={Array.isArray(product?.images) ? (product?.images || []) : []}
                  removedExistingImages={removedExistingImages}
                  isLoading={isLoading}
                  isDisabled={!isFormValid}
                  showActions={false}
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

        {/* Modal de confirmação de cancelamento */}
        <ConfirmDialog
          open={showCancelDialog}
          onOpenChange={handleCancelDialogClose}
          title="Descartar alterações?"
          description="Você tem alterações não salvas. Tem certeza que deseja sair? Todas as informações preenchidas serão perdidas."
          confirmText="Sim, descartar"
          cancelText="Cancelar"
          onConfirm={handleCancelConfirm}
          variant="destructive"
        />
      </div>
    </div>
  )
}
