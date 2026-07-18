'use client'

import { useVitrine, type VitrineTextKey } from './useVitrine'
import { VitrinePreviewPanel } from './VitrinePreviewPanel'
import { Input, LoadingSpinner } from '@/components'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Megaphone, Palette, Store } from 'lucide-react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldGrid,
  FieldLabel,
  FieldHelp,
  NxButton,
} from '../configuracoes/_shared'

// Sugestões de cor de marca (a 1ª é o índigo Nexo padrão)
const BRAND_PRESETS = [
  '#2A2D7C', '#1D4ED8', '#0891B2', '#0E7490',
  '#2F6B4F', '#15803D', '#4D7C0F', '#B45309',
  '#C2410C', '#C1121F', '#BE185D', '#A21CAF',
  '#7C3AED', '#7C4A2D', '#334155', '#111827',
]

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

  // valor seguro p/ o <input type="color"> (só aceita #RRGGBB); fallback = índigo Nexo
  const swatchColor = /^#[0-9a-fA-F]{6}$/.test(formData.brand_color)
    ? formData.brand_color
    : '#2A2D7C'

  const counter = (key: VitrineTextKey): string =>
    formData[key] ? ` · ${formData[key].length}/${limits[key]}` : ''

  const fieldHelp = (key: VitrineTextKey, fallback: string) =>
    errors[key] ? (
      <FieldHelp variant="error">{errors[key]}</FieldHelp>
    ) : (
      <FieldHelp>
        {fallback}
        {counter(key)}
      </FieldHelp>
    )

  return (
    <div className="flex flex-col gap-5">
      {/* Header + ações */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-nxi1">
            Vitrine
          </h1>
          <p className="mt-1 text-[13.5px] leading-[1.5] text-nxi2">
            Personalize a cara da sua loja pública — veja a prévia ao lado enquanto edita.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NxButton variant="ghost" onClick={handleReset} disabled={!isDirty || isUpdating}>
            Descartar
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

      {/* Form (esquerda, compacto) + Preview (direita, protagonista) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        {/* ── Form ── */}
        <div className="flex min-w-0 flex-col gap-4">
          {/* Cor da marca */}
          <SectionCard>
            <SectionHeader
              title="Cor da marca"
              description="Pinta os destaques da sua loja — botões, links e realces."
              right={<Palette size={18} className="text-nxi3" strokeWidth={2} />}
            />
            <Field>
              <FieldLabel htmlFor="brand_color">Cor de destaque</FieldLabel>
              <div className="flex flex-wrap items-center gap-3">
                <label
                  className="relative h-11 w-11 flex-none cursor-pointer overflow-hidden rounded-xl border border-nxborder"
                  style={{ background: swatchColor }}
                  title="Escolher cor"
                >
                  <input
                    type="color"
                    value={swatchColor}
                    onChange={(e) => setField('brand_color', e.target.value.toUpperCase())}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Seletor de cor da marca"
                  />
                </label>
                <Input
                  id="brand_color"
                  value={formData.brand_color}
                  onChange={(e) => setField('brand_color', e.target.value)}
                  placeholder="#2A2D7C"
                  maxLength={9}
                  className="w-[150px] font-mono uppercase"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  {BRAND_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setField('brand_color', c)}
                      className="h-7 w-7 rounded-lg border border-nxborder transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/40"
                      style={{ background: c }}
                      title={c}
                      aria-label={`Usar ${c}`}
                    />
                  ))}
                </div>
                {formData.brand_color && (
                  <NxButton variant="ghost" onClick={() => setField('brand_color', '')}>
                    Restaurar padrão
                  </NxButton>
                )}
              </div>
              
            </Field>
          </SectionCard>

          {/* Hero */}
          <SectionCard>
            <SectionHeader
              title="Hero da loja"
              description="O destaque no topo da sua página. Deixe vazio para usar o padrão."
              right={<Store size={18} className="text-nxi3" strokeWidth={2} />}
            />
            <FieldGrid columns={1}>
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
              description="Faixa no topo da loja."
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
        </div>

        {/* ── Preview ── */}
        <div className="xl:sticky xl:top-2 xl:self-start">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            <Eye size={14} /> Prévia ao vivo
          </div>
          {previewStore && <VitrinePreviewPanel storeInfo={previewStore} />}
        </div>
      </div>
    </div>
  )
}
