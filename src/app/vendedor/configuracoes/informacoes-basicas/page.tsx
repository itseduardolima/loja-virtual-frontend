'use client'

import { useInformacoesBasicas } from './useInformacoesBasicas'
import { Input, Textarea, LoadingSpinner } from '@/components'
import { cn } from '@/lib/utils'
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

export default function InformacoesBasicasPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    handleInputChange,
    handleSave,
    handleReset,
  } = useInformacoesBasicas()

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
    <div className="flex flex-col gap-4">
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
