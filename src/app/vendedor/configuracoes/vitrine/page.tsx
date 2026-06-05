'use client'

import { useVitrine, type VitrineFormData } from './useVitrine'
import { Input, LoadingSpinner } from '@/components'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone, Sparkles, Store } from 'lucide-react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldGrid,
  FieldLabel,
  FieldHelp,
  Notice,
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
    defaults,
    limits,
  } = useVitrine()

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
      <Notice variant="info">
        Todos os campos são opcionais. Quando vazios, a loja usa automaticamente os seus
        dados reais (nome, descrição, frete grátis etc.) como padrão.
      </Notice>

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
              placeholder={defaults.hero_eyebrow}
              maxLength={limits.hero_eyebrow}
            />
            {fieldHelp('hero_eyebrow', `Padrão: “${defaults.hero_eyebrow}”`)}
          </Field>
          <Field>
            <FieldLabel htmlFor="hero_title">Título</FieldLabel>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => setField('hero_title', e.target.value)}
              placeholder={defaults.hero_title}
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
              placeholder={defaults.hero_subtitle}
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
            placeholder={defaults.announcement_text}
            maxLength={limits.announcement_text}
          />
          {fieldHelp('announcement_text', 'Padrão: frete grátis configurado em Entrega')}
        </Field>
      </SectionCard>

      {/* Campanha */}
      <SectionCard>
        <SectionHeader
          title="Campanha em destaque"
          description="Seção promocional no meio da loja, com a imagem de capa. Sem título, a seção não aparece."
          right={<Sparkles size={18} className="text-nxi3" strokeWidth={2} />}
        />
        <FieldGrid columns={2}>
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
        </FieldGrid>
      </SectionCard>

      {/* Form actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
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
  )
}
