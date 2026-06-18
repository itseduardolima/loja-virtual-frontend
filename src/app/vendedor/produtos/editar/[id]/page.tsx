'use client'

import { notFound } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CreateCategoryModal, ConfirmDialog, ErrorState } from '@/components'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Eye, X } from 'lucide-react'

import { useStore } from '@/hooks/useStore'
import { useUpdateProductStatus } from '@/hooks/useProducts'
import { useToastContext } from '@/contexts/ToastContext'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingPage } from '@/components/Layout'

import { useEditProductPage } from './useEditProductPage'
import {
  computeCompletion,
  type OrderedImage,
  NxBadge,
  NxButton,
  ImagesSection,
  CompletionMeter,
  PreviewCard,
  PublishCard,
  StorefrontPreviewModal,
  ProductFormSections,
  useFormWatchers,
  usePreviewUrlCache,
  buildPreviewData,
} from '@/components/ProductForm'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { buildImageUrl } from '@/lib/imageUtils'

type Status = 'draft' | 'active' | 'inactive'

const statusFromNumber = (n: number | undefined): Status =>
  n === 1 ? 'active' : n === 2 ? 'draft' : 'inactive'
const statusToNumber = (s: Status): number => (s === 'active' ? 1 : s === 'draft' ? 2 : 0)

export default function EditProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { data: storeData, isLoading: storeLoading } = useStore()
  const queryClient = useQueryClient()
  const updateStatusMutation = useUpdateProductStatus()
  const { error: showError } = useToastContext()

  const {
    form,
    store,
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
    availableSizes,
    variantStocks,
    setVariantStocks,
    removedExistingImages,
    isInitialized,
    isLoading,
    error: loadError,
    productNotFound,
    refetchProduct,
    handleImageChange,
    removeImage,
    reorderImages,
    removeExistingImage,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit,
  } = useEditProductPage(productId, user)

  const { handleSubmit, setValue, formState } = form
  const { isDirty } = formState

  const { name, description, price, promoPrice, promoEndsAt, featured, categoryId, specifications, stockValue } =
    useFormWatchers(form)

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [status, setStatus] = useState<Status>('inactive')

  useEffect(() => {
    if (product) setStatus(statusFromNumber(product.status))
  }, [product])

  const colors = availableColors
  const sizes = availableSizes

  const existingImages = useMemo<string[]>(
    () => (Array.isArray(product?.images) ? (product.images as string[]) : []),
    [product?.images],
  )

  const remainingExistingCount = useMemo(
    () => existingImages.filter((_, i) => !removedExistingImages.includes(i)).length,
    [existingImages, removedExistingImages],
  )

  const imagesOk = useMemo(() => {
    if (colors.length > 0) {
      return colors.every((c) => {
        const len = orderedImagesByColor[c]?.length || 0
        return len >= 2 && len <= 5
      })
    }
    const total = remainingExistingCount + selectedImages.length
    return total >= 2 && total <= 5
  }, [colors, orderedImagesByColor, selectedImages.length, remainingExistingCount])

  const completion = useMemo(
    () =>
      computeCompletion({
        values: { name, price, category_id: categoryId, stock: stockValue, specifications },
        selectedNicheId,
        nicheFields,
        dynamicFieldValues,
        colors,
        sizes,
        variantStocks,
        imagesOk,
      }),
    [name, price, categoryId, stockValue, specifications, selectedNicheId, nicheFields, dynamicFieldValues, colors, sizes, variantStocks, imagesOk],
  )

  const canPublish = completion.filter((c) => c.required).every((c) => c.done)

  // Unsaved changes: track dirty state via isDirty (RHF) + extra state snapshot
  const initialSnapshot = useRef<string | null>(null)
  const extraState = useMemo(
    () =>
      JSON.stringify({
        orderedImagesByColor: Object.fromEntries(
          Object.entries(orderedImagesByColor).map(([c, items]) => [
            c,
            items.map((i) => (i.type === 'existing' ? i.url : i.file.name)),
          ]),
        ),
        selectedImages: selectedImages.map((f) => `${f.name}:${f.size}`),
        removedExistingImages,
        variantStocks,
        dynamicFieldValues,
        selectedNicheId,
      }),
    [orderedImagesByColor, selectedImages, removedExistingImages, variantStocks, dynamicFieldValues, selectedNicheId],
  )

  const [hasUnsaved, setHasUnsaved] = useState(false)
  useEffect(() => {
    if (!isInitialized) return
    if (initialSnapshot.current === null) {
      initialSnapshot.current = extraState
      return
    }
    setHasUnsaved(isDirty || extraState !== initialSnapshot.current)
  }, [isInitialized, isDirty, extraState])

  const {
    showCancelDialog,
    setShowCancelDialog,
    setIsSubmitting,
    setAllowNavigation,
    handleConfirmCancel,
    handleCancelDialogClose,
  } = useUnsavedChanges({ hasUnsaved, isLoading })

  // Cover image
  const coverFile = useMemo<File | null>(() => {
    if (colors.length > 0) {
      const first = colors.map((c) => orderedImagesByColor[c]?.[0]).find(Boolean) as
        | OrderedImage
        | undefined
      return first?.type === 'new' ? first.file : null
    }
    return selectedImages[0] ?? null
  }, [colors, orderedImagesByColor, selectedImages])

  const coverObjectUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile])
  useEffect(() => () => { if (coverObjectUrl) URL.revokeObjectURL(coverObjectUrl) }, [coverObjectUrl])

  const coverUrl = useMemo<string | null>(() => {
    if (coverObjectUrl) return coverObjectUrl
    if (colors.length > 0) {
      const firstExisting = colors
        .map((c) => orderedImagesByColor[c]?.[0])
        .find((item) => item?.type === 'existing') as { type: 'existing'; url: string } | undefined
      return firstExisting ? buildImageUrl(firstExisting.url) : null
    }
    const firstSimple = existingImages.find((_, i) => !removedExistingImages.includes(i))
    return firstSimple ? buildImageUrl(firstSimple) : null
  }, [coverObjectUrl, colors, orderedImagesByColor, existingImages, removedExistingImages])

  const nicheName = useMemo(
    () => niches.find((n: { id: number }) => n.id === selectedNicheId)?.name ?? null,
    [niches, selectedNicheId],
  )
  const categoryName = useMemo(
    () => categories.find((c: { id: number }) => c.id === categoryId)?.name ?? null,
    [categories, categoryId],
  )

  const { orderedImageSrc, fileSrc } = usePreviewUrlCache()

  const existingSimpleImages = useMemo(
    () =>
      existingImages
        .filter((_, i) => !removedExistingImages.includes(i))
        .map((url) => buildImageUrl(url)),
    [existingImages, removedExistingImages],
  )

  const previewData = useMemo(
    () =>
      buildPreviewData({
        name, description, price, promoPrice, promoEndsAt,
        nicheName, categoryName, colors, sizes, variantStocks,
        stockValue, orderedImagesByColor, selectedImages,
        existingSimpleImages,
        nicheFields, dynamicFieldValues, specifications,
        orderedImageSrc, fileSrc,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, description, price, promoPrice, promoEndsAt, nicheName, categoryName, colors, sizes, variantStocks, stockValue, orderedImagesByColor, selectedImages, existingSimpleImages, nicheFields, dynamicFieldValues, specifications],
  )

  const scrollToAnchor = (anchor: string) =>
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const submitForm = () => {
    setIsSubmitting(true)
    setAllowNavigation(true)
    handleSubmit(
      (data) => onSubmit(data),
      (errors) => {
        setShowErrors(true)
        setIsSubmitting(false)
        setAllowNavigation(false)
        const first = completion.find((c) => c.required && !c.done)
        scrollToAnchor(first?.anchor ?? 'sec-basico')
        void errors
      },
    )()
  }

  const handlePublish = () => {
    const first = completion.find((c) => c.required && !c.done)
    if (first) {
      setShowErrors(true)
      showError('Preencha os campos obrigatórios destacados.', 'Não foi possível salvar')
      scrollToAnchor(first.anchor)
      return
    }
    submitForm()
  }

  const handleDiscard = () => {
    if (hasUnsaved) setShowCancelDialog(true)
    else router.push('/vendedor/produtos')
  }

  const handleStatusChange = (next: Status) => {
    const prev = status
    setStatus(next)
    updateStatusMutation.mutate(
      { id: productId, status: statusToNumber(next) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['product', productId] })
          queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (err: unknown) => {
          setStatus(prev)
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Não foi possível alterar o status do produto.'
          showError(msg, 'Erro ao alterar status')
        },
      },
    )
  }

  const handleCategoryCreated = (id: number) => {
    setValue('category_id', id, { shouldValidate: true })
    setIsCreateCategoryModalOpen(false)
  }

  const productLoading = isLoading && !product

  if (authLoading || storeLoading) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado para editar produtos" />
  if (!storeData) return <ErrorState message="Erro ao carregar informações da loja" />
  // 404 ANTES do guard de isInitialized: em 404 o produto nunca inicializa e o spinner seria eterno
  if (productNotFound) return notFound()
  if (productLoading || (!isInitialized && !loadError)) return <LoadingPage />
  if (!product) return <ErrorState message="Erro ao carregar produto" onRetry={() => refetchProduct()} retryText="Tentar novamente" />

  const completionMeter = <CompletionMeter items={completion} />
  const previewCard = (
    <PreviewCard
      name={name}
      price={price}
      promoPrice={promoPrice}
      featured={featured}
      nicheName={nicheName}
      colors={colors}
      coverUrl={coverUrl}
    />
  )

  const statusLabel = status === 'active' ? 'Ativo' : status === 'draft' ? 'Rascunho' : 'Inativo'
  const statusTone: 'nxs' | 'nxi3' | 'nxw' =
    status === 'active' ? 'nxs' : status === 'draft' ? 'nxi3' : 'nxw'

  return (
    <div className="pb-[120px] lg:pb-0">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">
            Editar produto
          </h1>
          <p className="mt-1.5 text-[13px] text-nxi2">
            Atualize as informações do produto. As alterações entram no ar ao salvar.
          </p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <NxButton variant="ghost" icon={Eye} onClick={() => setPreviewOpen(true)}>
            Pré-visualizar
          </NxButton>
          <NxButton variant="ghost" icon={X} onClick={handleDiscard}>
            Descartar
          </NxButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <ProductFormSections
            form={form}
            showErrors={showErrors}
            niches={niches}
            categories={categories}
            selectedNicheId={selectedNicheId}
            onNicheChange={handleNicheChange}
            nicheFields={nicheFields}
            dynamicFieldValues={dynamicFieldValues}
            onDynamicFieldChange={handleDynamicFieldChange}
            onCreateCategory={() => setIsCreateCategoryModalOpen(true)}
            colors={colors}
            sizes={sizes}
            variantStocks={variantStocks}
            setVariantStocks={setVariantStocks}
          />
          <ImagesSection
            colors={colors}
            selectedImages={selectedImages}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            onReorderImages={reorderImages}
            orderedImagesByColor={orderedImagesByColor}
            onOrderedImagesChange={handleOrderedImagesChange}
            existingImages={existingImages}
            removedExistingImages={removedExistingImages}
            onRemoveExistingImage={removeExistingImage}
            showErrors={showErrors}
          />
          {/* mobile: completion + preview — below images */}
          <div className="flex flex-col gap-5 lg:hidden">
            {completionMeter}
            {previewCard}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            {completionMeter}
            {previewCard}
            <PublishCard
              mode="edit"
              status={status}
              onStatusChange={handleStatusChange}
              onPublish={handlePublish}
              saving={isLoading}
              canPublish={canPublish}
            />
          </div>
        </div>
      </div>

      {/* mobile action bar */}
      <div className="fixed inset-x-0 bottom-[64px] z-30 flex items-center gap-2 border-t border-nxborder bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <NxBadge tone={statusTone}>{statusLabel}</NxBadge>
        <div className="ml-auto flex items-center gap-2">
          <NxButton onClick={handlePublish} loading={isLoading} disabled={!canPublish}>
            Salvar alterações
          </NxButton>
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      <StorefrontPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        storeName={store?.name}
        storeDomain={store?.slug}
      />

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={handleCancelDialogClose}
        title="Descartar alterações?"
        description="Você tem alterações não salvas. Tem certeza que deseja sair? Todas as informações preenchidas serão perdidas."
        confirmText="Sim, descartar"
        cancelText="Continuar editando"
        variant="destructive"
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
