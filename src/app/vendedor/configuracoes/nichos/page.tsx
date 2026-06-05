'use client'

import { useNichos } from './useNichos'
import { LoadingSpinner } from '@/components'
import { cn } from '@/lib/utils'
import { Layers, Star } from 'lucide-react'
import { getNicheIcon } from '@/components/ProductForm/data'
import {
  SectionCard,
  SectionHeader,
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
  const primaryNicheId = nicheIds[0]

  return (
    <SectionCard>
      <SectionHeader
        title="Nichos da loja"
        description="Selecione os nichos que melhor descrevem o que sua loja vende."
        right={
          <div className="inline-flex items-center gap-1.5 rounded-full bg-nxp/[0.08] px-3 py-1.5 ring-1 ring-inset ring-nxp/15">
            <Layers className="h-3.5 w-3.5 text-nxp" strokeWidth={2} />
            <span className="text-[12px] font-bold tabular-nums text-nxp">{selectedCount}</span>
            <span className="text-[11px] text-nxp/70">/ {totalNiches}</span>
          </div>
        }
      />

      {nichesLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {nichesData?.data?.map((niche: any) => {
            const id = niche.id.toString()
            const isSelected = nicheIds.includes(id)
            const isPrimary = isSelected && id === primaryNicheId
            const NicheIcon = getNicheIcon(niche.slug)

            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => handleNicheToggle(id)}
                className={cn(
                  'group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                  isSelected
                    ? 'border-nxp bg-nxp/[0.06] shadow-[0_1px_2px_hsl(237_49%_33%/0.12)]'
                    : 'border-nxborder bg-white hover:border-nxp/40 hover:bg-nxbg',
                )}
              >
                {isPrimary && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-nxp px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
                    <Star className="h-2 w-2" fill="currentColor" strokeWidth={0} />
                    Primário
                  </span>
                )}

                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    isSelected ? 'bg-nxp text-white' : 'bg-nxi3/10 text-nxi2 group-hover:text-nxp',
                  )}
                >
                  <NicheIcon size={18} />
                </span>

                <span
                  className={cn(
                    'text-[12.5px] font-semibold leading-tight',
                    isSelected ? 'text-nxp' : 'text-nxi1',
                  )}
                >
                  {niche.name}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {errors.niche_ids && (
        <FieldHelp variant="error">{errors.niche_ids}</FieldHelp>
      )}

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
          {isUpdating ? 'Salvando…' : 'Salvar nichos'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
