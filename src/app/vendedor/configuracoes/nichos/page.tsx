'use client'

import { useNichos } from './useNichos'
import { LoadingSpinner, Checkbox } from '@/components'
import { cn } from '@/lib/utils'
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

  return (
    <SectionCard>
      <SectionHeader
        title="Nichos da loja"
        description="Selecione os nichos que melhor descrevem o que sua loja vende."
      />

      <Field full>
        {nichesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {nichesData?.data?.map((niche: any) => {
              const isSelected = nicheIds.includes(niche.id.toString())
              return (
                <div
                  key={niche.id}
                  onClick={() => handleNicheToggle(niche.id.toString())}
                  className={cn(
                    'flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors',
                    isSelected
                      ? 'border-nxp/30 bg-nxp/[0.04]'
                      : 'border-nxborder bg-white hover:border-nxi3/30 hover:bg-nxbg/40',
                  )}
                >
                  <Checkbox
                    id={niche.id.toString()}
                    checked={isSelected}
                    onCheckedChange={() => handleNicheToggle(niche.id.toString())}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={niche.id.toString()}
                    className="flex-1 cursor-pointer"
                  >
                    <span
                      className={cn(
                        'block text-[13.5px] font-semibold',
                        isSelected ? 'text-nxp' : 'text-nxi1',
                      )}
                    >
                      {niche.name}
                    </span>
                    {niche.description && (
                      <p className="mt-0.5 text-[11.5px] leading-snug text-nxi3">
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
