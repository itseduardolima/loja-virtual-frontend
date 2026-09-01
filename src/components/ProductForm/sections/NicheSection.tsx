'use client'

// Espelha NicheSection de /tmp/nexo-design/nexo-criar-produto/project/sections.jsx.
// Dados de nichos/campos vêm das props (API), não hardcode. Campos de cor são
// ordenados primeiro (mantém o comportamento de DynamicFields atual), depois sort_order.
import * as React from 'react'
import { Info, LayoutGrid, MousePointerClick, Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { Category, Niche, NicheField, NicheFieldValue } from '@/types'
import type { CreateProductFormData } from '@/schemas'
import { cn } from '@/lib/utils'
import { getNicheIcon } from '../data'
import { ColorPickerField } from '../ColorPickerField'
import {
  CheckChips,
  Field,
  FieldGrid,
  FieldHelp,
  FieldLabel,
  Notice,
  RadioPills,
  SectionCard,
  SectionHeader,
} from '../primitives'
import { NxInput, NxSelectNative, NxTextarea } from '../inputs'

// ── Um único campo dinâmico ──────────────────────────────────────────────────
function DynamicField({
  field,
  value,
  onChange,
  showErrors,
}: {
  field: NicheField
  value: string | string[] | undefined
  onChange: (v: string | string[]) => void
  showErrors: boolean
}) {
  const required = field.required === 1
  const isEmpty = Array.isArray(value) ? value.length === 0 : !value || String(value).trim() === ''
  const err = showErrors && required && isEmpty

  // 'select'/'color' lidam com array; normaliza string com vírgulas → array ao ler.
  const asArray = (v: string | string[] | undefined): string[] => {
    if (Array.isArray(v)) return v
    if (!v) return []
    const s = String(v).trim()
    return s.includes(',')
      ? s
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
      : [s]
  }
  const asString = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v[0] || '' : v || ''

  let control: React.ReactNode
  if (field.field_type === 'color') {
    control = (
      <ColorPickerField
        value={asArray(value)}
        onChange={(v) => onChange(v)}
        options={field.options}
      />
    )
  } else if (field.field_type === 'select') {
    control = (
      <CheckChips value={asArray(value)} onChange={(v) => onChange(v)} options={field.options} />
    )
  } else if (field.field_type === 'radio') {
    control = (
      <RadioPills
        value={asString(value)}
        onChange={(v) => onChange(v)}
        options={field.options}
        error={err}
      />
    )
  } else if (field.field_type === 'textarea') {
    control = (
      <NxTextarea
        value={asString(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Informe ${field.name.toLowerCase()}`}
        error={err}
      />
    )
  } else if (field.field_type === 'number') {
    control = (
      <NxInput
        type="number"
        value={asString(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        error={err}
      />
    )
  } else {
    control = (
      <NxInput
        value={asString(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Informe ${field.name.toLowerCase()}`}
        error={err}
      />
    )
  }

  const full =
    field.field_type === 'color' ||
    field.field_type === 'select' ||
    field.field_type === 'textarea' ||
    (field.field_type === 'radio' && field.options.length > 4)

  return (
    <Field full={full} className="nx-fade">
      <FieldLabel required={required}>{field.name}</FieldLabel>
      {control}
      {err && <FieldHelp variant="error">Campo obrigatório.</FieldHelp>}
    </Field>
  )
}

export function NicheSection({
  form,
  niches,
  categories,
  selectedNicheId,
  onNicheChange,
  nicheFields,
  dynamicFieldValues,
  onDynamicFieldChange,
  onCreateCategory,
  showErrors,
}: {
  form: UseFormReturn<CreateProductFormData>
  niches: Niche[]
  categories: Category[]
  selectedNicheId: number | null
  onNicheChange: (id: number | null) => void
  nicheFields: NicheField[]
  dynamicFieldValues: Record<string, NicheFieldValue>
  onDynamicFieldChange: (fieldId: number, value: string | string[]) => void
  onCreateCategory?: () => void
  showErrors: boolean
}) {
  const { setValue, watch } = form
  const categoryId = watch('category_id')

  const niche = niches.find((n) => n.id === selectedNicheId) || null
  const hasColorField = nicheFields.some((f) => f.field_type === 'color')

  const handleSelectNiche = (id: number | null) => {
    onNicheChange(id)
    setValue('category_id', undefined as never, { shouldValidate: false })
  }

  // Campos de cor primeiro, depois sort_order (igual ao DynamicFields atual).
  const sortedFields = React.useMemo(
    () =>
      [...nicheFields].sort((a, b) => {
        const aColor = a.field_type === 'color' || a.name.toLowerCase() === 'cor'
        const bColor = b.field_type === 'color' || b.name.toLowerCase() === 'cor'
        if (aColor && !bColor) return -1
        if (!aColor && bColor) return 1
        return a.sort_order - b.sort_order
      }),
    [nicheFields],
  )

  return (
    <SectionCard id="sec-nicho">
      <SectionHeader
        icon={LayoutGrid}
        title="Tipo e nicho"
        description="O nicho define os campos específicos e os filtros na vitrine."
      />

      {/* grid de nichos */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {niches.map((n) => {
          const on = selectedNicheId === n.id
          const NicheIcon = getNicheIcon(n.slug)
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => handleSelectNiche(on ? null : n.id)}
              className={cn(
                'group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                on
                  ? 'border-nxp bg-nxp/[0.06] shadow-[0_1px_2px_hsl(237_49%_33%/0.12)]'
                  : 'border-nxborder bg-white hover:border-nxp/40 hover:bg-nxbg',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                  on ? 'bg-nxp text-white' : 'bg-nxi3/10 text-nxi2 group-hover:text-nxp',
                )}
              >
                <NicheIcon size={18} />
              </span>
              <span
                className={cn(
                  'text-[12.5px] font-semibold leading-tight',
                  on ? 'text-nxp' : 'text-nxi1',
                )}
              >
                {n.name}
              </span>
            </button>
          )
        })}
      </div>
      {showErrors && !selectedNicheId && (
        <div className="mt-3">
          <FieldHelp variant="error">Selecione um nicho.</FieldHelp>
        </div>
      )}

      {!niche && (
        <div className="mt-5">
          <Notice variant="info" icon={MousePointerClick}>
            Escolha um nicho acima para liberar a categoria e os campos específicos.
          </Notice>
        </div>
      )}

      {niche && (
        <div className="mt-5 border-t border-nxborder pt-5 nx-fade">
          <FieldGrid columns={2}>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel required>Categoria</FieldLabel>
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={onCreateCategory}
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-nxp transition-colors hover:text-nxp/80"
                  >
                    <Plus size={12} /> Nova categoria
                  </button>
                )}
              </div>
              <NxSelectNative
                value={categoryId != null ? String(categoryId) : ''}
                onChange={(v) =>
                  setValue('category_id', v ? (Number(v) as never) : (undefined as never), {
                    shouldValidate: true,
                  })
                }
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Selecione a categoria"
                error={showErrors && !categoryId}
              />
              {showErrors && !categoryId && (
                <FieldHelp variant="error">Categoria é obrigatória.</FieldHelp>
              )}
            </Field>
            <Field>
              <FieldLabel>Nicho selecionado</FieldLabel>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-nxborder bg-nxbg px-3">
                {(() => {
                  const NicheIcon = getNicheIcon(niche.slug)
                  return <NicheIcon size={15} className="text-nxp" />
                })()}
                <span className="text-[13px] font-semibold text-nxi1">{niche.name}</span>
                <button
                  type="button"
                  onClick={() => handleSelectNiche(null)}
                  className="ml-auto text-[11.5px] font-semibold text-nxi3 transition-colors hover:text-nxd"
                >
                  Trocar
                </button>
              </div>
            </Field>
          </FieldGrid>

          {hasColorField && (
            <div className="mt-4">
              <Notice variant="amber" icon={Info}>
                <b>As cores que você selecionar aqui</b> criam abas separadas para upload de imagens
                e linhas na tabela de estoque por variante.
              </Notice>
            </div>
          )}

          {/* Campos dinâmicos só aparecem depois da categoria escolhida — alguns
              campos são restritos por categoria (NICHE_FIELD_CATEGORY, backend);
              mostrar antes disso exibiria a lista sem filtro, que pode nem
              corresponder à categoria que o vendedor vai escolher. */}
          {!categoryId && sortedFields.length > 0 && (
            <div className="mt-5">
              <Notice variant="info" icon={MousePointerClick}>
                Escolha uma categoria para ver os campos específicos dela.
              </Notice>
            </div>
          )}

          {categoryId && sortedFields.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.07em] text-nxi3">
                Campos de {niche.name}
              </div>
              <FieldGrid columns={2}>
                {sortedFields.map((f) => (
                  <DynamicField
                    key={f.id}
                    field={f}
                    value={dynamicFieldValues[String(f.id)]?.value}
                    onChange={(v) => onDynamicFieldChange(f.id, v)}
                    showErrors={showErrors}
                  />
                ))}
              </FieldGrid>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}
