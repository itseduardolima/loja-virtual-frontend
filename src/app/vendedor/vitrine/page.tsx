'use client'

import { useVitrine, type VitrineTextKey } from './useVitrine'
import { VitrinePreviewPanel } from './VitrinePreviewPanel'
import { Input, LoadingSpinner } from '@/components'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Megaphone, Palette, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldGrid,
  FieldLabel,
  FieldHelp,
  NxButton,
} from '../configuracoes/_shared'

interface BrandPreset {
  name: string
  hex: string
  /** nichos onde a cor costuma funcionar bem — só contexto, não restringe a escolha */
  niches: string
}

// Paleta curada por nicho — a ink (variação escura) e o tom de fundo suave são
// derivados automaticamente do hex (ver storeAccentStyle em lib/storefront.ts),
// não precisam ser guardados aqui.
const BRAND_PRESETS: BrandPreset[] = [
  { name: 'Verde-floresta', hex: '#2F6B4F', niches: 'café, natural, orgânico' },
  { name: 'Amora (oxblood)', hex: '#8A2F43', niches: 'moda, boutique' },
  { name: 'Azul-petróleo', hex: '#1F6570', niches: 'beleza, cosmético, clínicas' },
  { name: 'Ameixa', hex: '#5B3A78', niches: 'perfumaria, joias, premium' },
  { name: 'Ocre queimado', hex: '#A85A24', niches: 'cerâmica, artesanal, decor' },
  { name: 'Caramelo couro', hex: '#7A4A28', niches: 'calçados, pet, marcenaria' },
  { name: 'Oliva', hex: '#5B6B2F', niches: 'outdoor, plantas' },
  { name: 'Bordô tinto', hex: '#6E2436', niches: 'vinhos, gourmet' },
  { name: 'Rosa-terroso', hex: '#A64D6B', niches: 'cosmético, floricultura' },
  { name: 'Grafite quente', hex: '#2C2C31', niches: 'tech, minimal, streetwear' },
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
                {formData.brand_color && (
                  <NxButton variant="ghost" onClick={() => setField('brand_color', '')}>
                    Restaurar padrão
                  </NxButton>
                )}
              </div>
            </Field>

            <Field full>
              <FieldLabel>Paleta sugerida por nicho</FieldLabel>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BRAND_PRESETS.map((preset) => {
                  const active = formData.brand_color.trim().toUpperCase() === preset.hex
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setField('brand_color', preset.hex)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/40',
                        active ? 'border-nxp bg-nxp/[0.06]' : 'border-nxborder hover:border-nxi3',
                      )}
                    >
                      <span
                        className="h-8 w-8 flex-none rounded-full ring-1 ring-inset ring-black/10"
                        style={{ background: preset.hex }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-bold text-nxi1">
                          {preset.name}
                        </span>
                        <span className="block truncate text-[11px] text-nxi3">
                          {preset.niches}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <FieldHelp>Só um ponto de partida — use a que combinar com a sua marca.</FieldHelp>
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
