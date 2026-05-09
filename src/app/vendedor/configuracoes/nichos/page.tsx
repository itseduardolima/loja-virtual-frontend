'use client'

import { useNichos } from './useNichos'
import { LoadingSpinner, Checkbox } from '@/components'
import { cn } from '@/lib/utils'
import { Star, Layers, Sparkles } from 'lucide-react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldHelp,
  FormActions,
  NxButton,
} from '../_shared'

export default function NichosPage() {
  const {
    isLoading,
    isUpdating,
    nichesData,
    nichesLoading,
    nicheIds,
    errors,
    isDirty,
    isFormValid,
    handleNicheToggle,
    handleSave,
    handleReset,
  } = useNichos()

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  const totalNiches = nichesData?.data?.length || 0
  const selectedCount = nicheIds.length
  // Nicho primário = primeiro selecionado (ordem de seleção)
  const primaryNicheId = nicheIds[0]

  return (
    <SectionCard>
      <SectionHeader
        title="Nichos da loja"
        description="Selecione os nichos que melhor descrevem o que sua loja vende."
        right={
          <div className="inline-flex items-center gap-1.5 rounded-full bg-nxp/[0.08] px-3 py-1.5 ring-1 ring-inset ring-nxp/15">
            <Layers className="h-3.5 w-3.5 text-nxp" strokeWidth={2} />
            <span className="text-[12px] font-bold tabular-nums text-nxp">
              {selectedCount}
            </span>
            <span className="text-[11px] text-nxp/70">/ {totalNiches}</span>
          </div>
        }
      />

      {/* Helper bar quando há seleção */}
      {selectedCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-nxborder bg-nxbg/40 px-3 py-2 text-[12px]">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-nxp" strokeWidth={2} />
          <span className="text-nxi2">
            <strong className="text-nxi1">Primeiro selecionado</strong> vira o{' '}
            <strong className="text-nxp">nicho primário</strong> da loja —
            usado em SEO e categorização.
          </span>
        </div>
      )}

      <Field full>
        {nichesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {nichesData?.data?.map((niche: any) => {
              const id = niche.id.toString()
              const isSelected = nicheIds.includes(id)
              const isPrimary = isSelected && id === primaryNicheId
              return (
                <div
                  key={niche.id}
                  onClick={() => handleNicheToggle(id)}
                  className={cn(
                    'group relative flex cursor-pointer items-start gap-2.5 overflow-hidden rounded-xl border p-3 transition-all',
                    isPrimary
                      ? 'border-nxp/40 bg-gradient-to-br from-nxp/[0.06] to-nxp/[0.02] shadow-[0_2px_8px_hsl(237_49%_33%/0.08)]'
                      : isSelected
                        ? 'border-nxp/25 bg-nxp/[0.03]'
                        : 'border-nxborder bg-white hover:border-nxi3/30 hover:bg-nxbg/40',
                  )}
                >
                  {/* Badge "primário" */}
                  {isPrimary && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-nxp px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)]">
                      <Star className="h-2 w-2" fill="currentColor" strokeWidth={2.5} />
                      Primário
                    </span>
                  )}

                  <Checkbox
                    id={id}
                    checked={isSelected}
                    onCheckedChange={() => handleNicheToggle(id)}
                    className="mt-0.5"
                  />
                  <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
                    <span
                      className={cn(
                        'block text-[13.5px] font-semibold',
                        isPrimary
                          ? 'text-nxp'
                          : isSelected
                            ? 'text-nxi1'
                            : 'text-nxi1',
                      )}
                    >
                      {niche.name}
                    </span>
                    {niche.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-nxi3">
                        {niche.description}
                      </p>
                    )}
                  </label>
                </div>
              )
            })}
          </div>
        )}
        {errors.niche_ids && <FieldHelp variant="error">{errors.niche_ids}</FieldHelp>}
      </Field>

      <FormActions>
        <NxButton
          variant="ghost"
          onClick={handleReset}
          disabled={!isDirty || isUpdating}
        >
          Descartar alterações
        </NxButton>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || !isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar nichos'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
