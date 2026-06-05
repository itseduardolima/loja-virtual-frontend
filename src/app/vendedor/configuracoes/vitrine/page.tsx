'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useVitrine, type VitrineFormData } from './useVitrine'
import { VitrinePreviewModal } from './VitrinePreviewModal'
import { Input, LoadingSpinner } from '@/components'
import { Textarea } from '@/components/ui/textarea'
import { ImageCropDialog } from '@/components/Dialog'
import { Eye, ImagePlus, Megaphone, Sparkles, Store, Trash2 } from 'lucide-react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldGrid,
  FieldLabel,
  FieldHelp,
  NxButton,
} from '../_shared'

export default function VitrinePage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    setField,
    handleSave,
    handleReset,
    limits,
    previewStore,
    campaignImagePreview,
    cropTarget,
    setCropTarget,
    handleCampaignImageSelect,
    handleCropDone,
    handleRemoveCampaignImage,
  } = useVitrine()

  const [previewOpen, setPreviewOpen] = useState(false)

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  const counter = (key: keyof VitrineFormData): string =>
    formData[key] ? ` · ${formData[key].length}/${limits[key]}` : ''

  const fieldHelp = (key: keyof VitrineFormData, fallback: string) =>
    errors[key] ? (
      <FieldHelp variant="error">{errors[key]}</FieldHelp>
    ) : (
      <FieldHelp>
        {fallback}
        {counter(key)}
      </FieldHelp>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NxButton variant="ghost" onClick={() => setPreviewOpen(true)} disabled={!previewStore}>
          <Eye size={15} className="mr-1.5" />
          Pré-visualizar
        </NxButton>
      </div>

      {/* Hero */}
      <SectionCard>
        <SectionHeader
          title="Hero da loja"
          description="O destaque no topo da sua página. Deixe vazio para usar o padrão."
          right={<Store size={18} className="text-nxi3" strokeWidth={2} />}
        />
        <FieldGrid columns={2}>
          <Field>
            <FieldLabel htmlFor="hero_eyebrow">Texto de apoio (eyebrow)</FieldLabel>
            <Input
              id="hero_eyebrow"
              value={formData.hero_eyebrow}
              onChange={(e) => setField('hero_eyebrow', e.target.value)}
              placeholder="Ex.: Coleção Inverno 2026"
              maxLength={limits.hero_eyebrow}
            />
            {fieldHelp('hero_eyebrow', 'Padrão: ano de fundação da loja')}
          </Field>
          <Field>
            <FieldLabel htmlFor="hero_title">Título</FieldLabel>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => setField('hero_title', e.target.value)}
              placeholder="Ex.: Vista o essencial."
              maxLength={limits.hero_title}
            />
            {fieldHelp('hero_title', 'Padrão: nome da loja')}
          </Field>
          <Field full>
            <FieldLabel htmlFor="hero_subtitle">Subtítulo</FieldLabel>
            <Textarea
              id="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => setField('hero_subtitle', e.target.value)}
              placeholder="Ex.: Peças atemporais em algodão e linho."
              maxLength={limits.hero_subtitle}
              rows={2}
            />
            {fieldHelp('hero_subtitle', 'Padrão: descrição da loja')}
          </Field>
        </FieldGrid>
      </SectionCard>

      {/* Barra de anúncio */}
      <SectionCard>
        <SectionHeader
          title="Barra de anúncio"
          description="Faixa no topo da loja. Sem texto e sem frete grátis configurado, ela fica oculta."
          right={<Megaphone size={18} className="text-nxi3" strokeWidth={2} />}
        />
        <Field>
          <FieldLabel htmlFor="announcement_text">Texto do anúncio</FieldLabel>
          <Input
            id="announcement_text"
            value={formData.announcement_text}
            onChange={(e) => setField('announcement_text', e.target.value)}
            placeholder="Ex.: Frete grátis acima de R$ 199"
            maxLength={limits.announcement_text}
          />
          {fieldHelp('announcement_text', 'Padrão: frete grátis configurado em Entrega')}
        </Field>
      </SectionCard>

      {/* Campanha */}
      <SectionCard>
        <SectionHeader
          title="Campanha em destaque"
          description="Seção promocional no meio da loja. Sem título, a seção não aparece."
          right={<Sparkles size={18} className="text-nxi3" strokeWidth={2} />}
        />
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="campaign_title">Título da campanha</FieldLabel>
            <Input
              id="campaign_title"
              value={formData.campaign_title}
              onChange={(e) => setField('campaign_title', e.target.value)}
              placeholder="Ex.: Edição limitada"
              maxLength={limits.campaign_title}
            />
            {fieldHelp('campaign_title', 'Deixe vazio para não exibir a campanha')}
          </Field>
          <Field>
            <FieldLabel htmlFor="campaign_text">Texto da campanha</FieldLabel>
            <Textarea
              id="campaign_text"
              value={formData.campaign_text}
              onChange={(e) => setField('campaign_text', e.target.value)}
              placeholder="Ex.: Peças pensadas para durar estações."
              maxLength={limits.campaign_text}
              rows={2}
            />
            {fieldHelp('campaign_text', 'Aparece abaixo do título da campanha')}
          </Field>
          <Field>
            <FieldLabel>Imagem da campanha</FieldLabel>
            <label
              htmlFor="campaign-image-upload"
              className="group relative flex cursor-pointer overflow-hidden rounded-xl border border-dashed border-nxborder bg-nxbg/60 transition-colors hover:border-nxp/40 hover:bg-nxbg"
              style={{ minHeight: 140 }}
            >
              {campaignImagePreview ? (
                <>
                  <Image
                    src={campaignImagePreview}
                    alt="Imagem da campanha"
                    fill
                    unoptimized={
                      campaignImagePreview.startsWith('blob:') ||
                      campaignImagePreview.startsWith('data:')
                    }
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-nxi1/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-nxi1">
                      Trocar imagem
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-nxi3">
                  <ImagePlus size={24} />
                  <span className="text-[12.5px] font-semibold">Adicionar imagem</span>
                  <span className="text-[11px]">Máx. 5 MB · proporção 16:9 recomendada</span>
                </div>
              )}
            </label>
            <input
              id="campaign-image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                handleCampaignImageSelect(e.target.files?.[0] ?? null)
                e.target.value = ''
              }}
            />
            {campaignImagePreview && (
              <button
                type="button"
                onClick={handleRemoveCampaignImage}
                className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-nxd hover:underline"
              >
                <Trash2 size={13} /> Remover imagem
              </button>
            )}
            <FieldHelp>
              Aparece no fundo direito da seção de campanha. Sem imagem, usa a capa da loja como fallback.
            </FieldHelp>
          </Field>
        </div>
      </SectionCard>

      {/* Form actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <NxButton
          variant="ghost"
          onClick={() => setPreviewOpen(true)}
          disabled={!previewStore}
        >
          <Eye size={15} className="mr-1.5" />
          Pré-visualizar
        </NxButton>
        <div className="flex items-center gap-2">
          <NxButton variant="ghost" onClick={handleReset} disabled={!isDirty || isUpdating}>
            Descartar alterações
          </NxButton>
          <NxButton
            variant="primary"
            onClick={handleSave}
            disabled={!isDirty || !isFormValid}
            loading={isUpdating}
          >
            {isUpdating ? 'Salvando…' : 'Salvar vitrine'}
          </NxButton>
        </div>
      </div>

      {/* Dialog de crop da imagem de campanha */}
      <ImageCropDialog
        open={!!cropTarget}
        onClose={() => setCropTarget(null)}
        imageSrc={cropTarget?.imageSrc ?? ''}
        aspect={16 / 9}
        cropShape="rect"
        fileName={cropTarget?.fileName ?? 'campanha.jpg'}
        onCropDone={handleCropDone}
      />

      {previewStore && (
        <VitrinePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          storeInfo={previewStore}
        />
      )}
    </div>
  )
}
