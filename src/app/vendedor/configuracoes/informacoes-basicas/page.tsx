'use client'

import { useInformacoesBasicas } from './useInformacoesBasicas'
import { Input, Textarea, LoadingSpinner } from '@/components'
import Image from 'next/image'
import { Camera, ImagePlus, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImageCropDialog } from '@/components/Dialog'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldLabel,
  FieldHelp,
  FieldGrid,
  FormActions,
  NxButton,
  nxInputClass,
} from '../_shared'

function buildSrc(API_URL: string | undefined, src: string) {
  return src.startsWith('data:') || src.startsWith('http') || src.startsWith('blob:')
    ? src
    : `${API_URL}${src}`
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'L'
  )
}

export default function InformacoesBasicasPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    logoPreview,
    bannerPreview,
    cropTarget,
    setCropTarget,
    handleInputChange,
    handleFileSelect,
    handleCropDone,
    handleSave,
    handleReset,
  } = useInformacoesBasicas()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  const displayName = formData.name || 'Nome da sua loja'
  const displayDesc =
    formData.description ||
    'Adicione uma descrição curta para apresentar sua loja aos visitantes.'

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Hero: identidade visual com preview ────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        {/* Banner zone */}
        <label
          htmlFor="banner-upload"
          className="group relative block h-[400px] w-full cursor-pointer overflow-hidden bg-gradient-to-br from-nxp/[0.08] via-nxp/[0.04] to-nxbg"
        >
          {bannerPreview ? (
            <>
              <Image
                src={buildSrc(API_URL, bannerPreview)}
                alt="Banner"
                fill
                unoptimized={bannerPreview.startsWith('blob:') || bannerPreview.startsWith('data:')}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11.5px] font-semibold text-nxi1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Camera className="h-3.5 w-3.5" strokeWidth={2} />
                Trocar banner
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-nxi3 transition-colors group-hover:text-nxp">
                <ImagePlus className="h-6 w-6" strokeWidth={1.75} />
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em]">
                  Adicionar banner
                </span>
                <span className="text-[10.5px] text-nxi3">Recomendado: 1600×400</span>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { handleFileSelect('banner', e.target.files?.[0] || null); e.target.value = '' }}
            className="hidden"
            id="banner-upload"
          />
        </label>

        {/* Logo + name preview row */}
        <div className="relative -mt-10 flex flex-col gap-3 px-5 pb-5 pt-5 sm:flex-row sm:items-end">
          <label
            htmlFor="logo-upload"
            className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-nxp to-nxp/70 text-[22px] font-extrabold tracking-[-0.02em] text-white shadow-[0_4px_12px_hsl(0_0%_0%/0.10)]"
          >
            {logoPreview ? (
              <>
                <Image
                  src={buildSrc(API_URL, logoPreview)}
                  alt="Logo"
                  width={80}
                  height={80}
                  unoptimized={logoPreview.startsWith('blob:') || logoPreview.startsWith('data:')}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
              </>
            ) : (
              <>
                {initials(formData.name)}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => { handleFileSelect('logo', e.target.files?.[0] || null); e.target.value = '' }}
              className="hidden"
              id="logo-upload"
            />
          </label>

          <div className="min-w-0 flex-1 pt-2 sm:pt-0">
            <h2
              className={cn(
                'truncate text-[20px] font-extrabold tracking-[-0.025em]',
                formData.name ? 'text-nxi1' : 'text-nxi3',
              )}
            >
              {displayName}
            </h2>
            <p
              className={cn(
                'mt-1 line-clamp-2 text-[13px] leading-relaxed',
                formData.description ? 'text-nxi2' : 'italic text-nxi3',
              )}
            >
              {displayDesc}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-nxp/[0.06] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxp ring-1 ring-inset ring-nxp/15 sm:self-end">
            <Store className="h-3 w-3" strokeWidth={2} />
            Pré-visualização
          </span>
        </div>
      </div>

      {/* ─── Dialogs de crop ───────────────────────────────────────────── */}
      <ImageCropDialog
        open={cropTarget?.type === 'banner'}
        onClose={() => setCropTarget(null)}
        imageSrc={cropTarget?.imageSrc ?? ''}
        aspect={4}
        cropShape="rect"
        fileName={cropTarget?.fileName ?? 'banner.jpg'}
        onCropDone={(file, url) => handleCropDone('banner', file, url)}
      />
      <ImageCropDialog
        open={cropTarget?.type === 'logo'}
        onClose={() => setCropTarget(null)}
        imageSrc={cropTarget?.imageSrc ?? ''}
        aspect={1}
        cropShape="round"
        fileName={cropTarget?.fileName ?? 'logo.jpg'}
        onCropDone={(file, url) => handleCropDone('logo', file, url)}
      />

      {/* ─── Form de identidade textual ────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          title="Identidade textual"
          description="Como sua loja é encontrada e apresentada nos buscadores."
        />

        <div className="space-y-5">
          <FieldGrid columns={1}>
            <Field full>
              <FieldLabel htmlFor="name" required>Nome da loja</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex.: Casa Bonita Decoração"
                className={nxInputClass(!!errors.name)}
              />
              {errors.name ? (
                <FieldHelp variant="error">{errors.name}</FieldHelp>
              ) : (
                <FieldHelp>
                  {(formData.name?.length || 0)}/100 · aparece no cabeçalho da loja e nos buscadores.
                </FieldHelp>
              )}
            </Field>

            <Field full>
              <FieldLabel htmlFor="description">Descrição curta</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Ex.: Peças únicas para decorar com afeto. Curadoria autoral, entrega em todo o Brasil."
                maxLength={170}
                className={cn(
                  'min-h-[90px] rounded-lg border bg-white px-3 py-2 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30',
                  errors.description
                    ? 'border-nxd focus-visible:border-nxd'
                    : 'border-nxborder focus-visible:border-nxp',
                )}
              />
              {errors.description ? (
                <FieldHelp variant="error">{errors.description}</FieldHelp>
              ) : (
                <FieldHelp>
                  {formData.description.length}/170 · usada como descrição padrão para SEO e redes sociais.
                </FieldHelp>
              )}
            </Field>
          </FieldGrid>
        </div>

        <FormActions>
          <NxButton variant="ghost" onClick={handleReset} disabled={!isDirty || isUpdating}>
            Descartar alterações
          </NxButton>
          <NxButton
            variant="primary"
            onClick={handleSave}
            disabled={!isDirty || !isFormValid}
            loading={isUpdating}
          >
            {isUpdating ? 'Salvando…' : 'Salvar alterações'}
          </NxButton>
        </FormActions>
      </SectionCard>
    </div>
  )
}
