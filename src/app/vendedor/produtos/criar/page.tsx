'use client'

import { useAuth } from '@/contexts/AuthContext'
import { CreateCategoryModal, ConfirmDialog, ErrorState } from '@/components'
import { useEffect, useMemo, useState } from 'react'
import { Eye, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useStore } from '@/hooks/useStore'
import { useToastContext } from '@/contexts/ToastContext'
import LoadingPage from '@/components/Layout/LoadingPage'

import { useCreateProductPage } from './useCreateProductPage'
import { computeCompletion } from '@/components/ProductForm/completion'
import type { OrderedImage } from '@/components/ProductForm/types'
import { NxBadge, NxButton } from '@/components/ProductForm/primitives'
import { ImagesSection } from '@/components/ProductForm/sections/ImagesSection'
import { CompletionMeter } from '@/components/ProductForm/CompletionMeter'
import { PreviewCard } from '@/components/ProductForm/PreviewCard'
import { PublishCard } from '@/components/ProductForm/PublishCard'
import { StorefrontPreviewModal } from '@/components/ProductForm/StorefrontPreviewModal'
import { ProductFormSections } from '@/components/ProductForm/ProductFormSections'
import { useFormWatchers } from '@/components/ProductForm/useFormWatchers'
import { usePreviewUrlCache, buildPreviewData } from '@/components/ProductForm/previewUtils'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { buildImageUrl } from '@/lib/imageUtils'

export default function CreateProductPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { data: storeData, isLoading: storeLoading } = useStore()
  const { error: showError } = useToastContext()

  const {
    form,
    store,
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
    isLoading,
    handleImageChange,
    removeImage,
    reorderImages,
    handleNicheChange,
    handleDynamicFieldChange,
    onSubmit,
  } = useCreateProductPage(user)

  const { handleSubmit, setValue } = form
  const { name, description, price, promoPrice, promoEndsAt, featured, categoryId, specifications, stockValue } =
    useFormWatchers(form)

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [saveAction, setSaveAction] = useState<'publish' | 'draft' | null>(null)

  const colors = availableColors
  const sizes = availableSizes
  const hasColorImages = Object.values(orderedImagesByColor).some((items) => items.length > 0)
  const hasImages = selectedImages.length > 0 || hasColorImages

  const imagesOk = useMemo(() => {
    if (colors.length > 0) {
      return colors.every((c) => {
        const len = orderedImagesByColor[c]?.length || 0
        return len >= 2 && len <= 5
      })
    }
    return selectedImages.length >= 2 && selectedImages.length <= 5
  }, [colors, orderedImagesByColor, selectedImages.length])

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

  // Unsaved changes guard
  const hasUnsaved = !!(name || price || description || hasImages)
  const {
    showCancelDialog,
    setShowCancelDialog,
    setIsSubmitting,
    setAllowNavigation,
    handleConfirmCancel,
    handleCancelDialogClose,
  } = useUnsavedChanges({ hasUnsaved, isLoading })

  // Cover image URL for preview card
  const coverFile = useMemo<File | null>(() => {
    if (colors.length > 0) {
      const first = colors.map((c) => orderedImagesByColor[c]?.[0]).find(Boolean) as
        | OrderedImage
        | undefined
      return first?.type === 'new' ? first.file : null
    }
    return selectedImages[0] ?? null
  }, [colors, orderedImagesByColor, selectedImages])

  const coverUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile])
  useEffect(() => () => { if (coverUrl) URL.revokeObjectURL(coverUrl) }, [coverUrl])

  // Name/category resolution for preview
  const nicheName = useMemo(
    () => niches.find((n: { id: number }) => n.id === selectedNicheId)?.name ?? null,
    [niches, selectedNicheId],
  )
  const categoryName = useMemo(
    () => categories.find((c: { id: number }) => c.id === categoryId)?.name ?? null,
    [categories, categoryId],
  )

  const { orderedImageSrc, fileSrc } = usePreviewUrlCache()

  const previewData = useMemo(
    () =>
      buildPreviewData({
        name, description, price, promoPrice, promoEndsAt,
        nicheName, categoryName, colors, sizes, variantStocks,
        stockValue, orderedImagesByColor, selectedImages,
        nicheFields, dynamicFieldValues, specifications,
        orderedImageSrc, fileSrc,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, description, price, promoPrice, promoEndsAt, nicheName, categoryName, colors, sizes, variantStocks, stockValue, orderedImagesByColor, selectedImages, nicheFields, dynamicFieldValues, specifications],
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
      showError('Preencha os campos obrigatórios destacados.', 'Não foi possível publicar')
      scrollToAnchor(first.anchor)
      return
    }
    setValue('save_as_draft', false)
    setSaveAction('publish')
    submitForm()
  }

  const handleDraft = () => {
    setValue('save_as_draft', true)
    setSaveAction('draft')
    submitForm()
  }

  const handleDiscard = () => {
    if (hasUnsaved) setShowCancelDialog(true)
    else router.push('/vendedor/produtos')
  }

  const handleCategoryCreated = (id: number) => {
    setValue('category_id', id, { shouldValidate: true })
    setIsCreateCategoryModalOpen(false)
  }

  if (authLoading || storeLoading) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado para criar produtos" />
  if (!storeData) return <ErrorState message="Erro ao carregar informações da loja" />

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

  return (
    <div className="pb-28 lg:pb-0">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">
            Novo produto
          </h1>
          <p className="mt-1.5 text-[13px] text-nxi2">
            Preencha as seções abaixo. Você pode editar em qualquer ordem.
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

      {/* mobile: completion + preview */}
      <div className="mb-5 flex flex-col gap-5 lg:hidden">
        {completionMeter}
        {previewCard}
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
            showErrors={showErrors}
          />
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            {completionMeter}
            {previewCard}
            <PublishCard
              mode="create"
              status="draft"
              onPublish={handlePublish}
              onDraft={handleDraft}
              saving={isLoading && saveAction === 'publish'}
              savingDraft={isLoading && saveAction === 'draft'}
              canPublish={canPublish}
            />
          </div>
        </div>
      </div>

      {/* mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-nxborder bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <NxBadge tone="nxi3">Rascunho</NxBadge>
        <div className="ml-auto flex items-center gap-2">
          <NxButton
            variant="ghost"
            onClick={handleDraft}
            loading={isLoading && saveAction === 'draft'}
            disabled={isLoading && saveAction === 'publish'}
          >
            Rascunho
          </NxButton>
          <NxButton
            onClick={handlePublish}
            loading={isLoading && saveAction === 'publish'}
            disabled={isLoading && saveAction === 'draft'}
          >
            Publicar
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
