'use client'

import { useState, useEffect } from 'react'
import { useDocumentos } from './useDocumentos'
import { Input, LoadingSpinner } from '@/components'
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

type DocType = 'cnpj' | 'cpf'

export default function DocumentosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    handleCNPJChange,
    handleCPFChange,
    handleSave,
  } = useDocumentos()

  const [docType, setDocType] = useState<DocType>('cnpj')

  useEffect(() => {
    if (formData.cnpj) setDocType('cnpj')
    else if (formData.cpf) setDocType('cpf')
  }, [formData.cnpj, formData.cpf])

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
        title="Documentos"
        description="Usados para emitir nota fiscal e comprovar a titularidade da loja. Valide com calma — alterar depois requer suporte."
      />

      <FieldGrid columns={1}>
        {/* Tipo de cadastro (segmented control no padrão Nexo) */}
        <Field full>
          <FieldLabel>Tipo de cadastro</FieldLabel>
          <div
            role="radiogroup"
            aria-label="Tipo de cadastro"
            className="inline-flex w-fit items-center rounded-xl border border-nxborder bg-white p-1 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]"
          >
            {(['cnpj', 'cpf'] as DocType[]).map((t) => {
              const active = docType === t
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDocType(t)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold tabular-nums transition-colors',
                    active
                      ? 'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)]'
                      : 'text-nxi2 hover:text-nxi1',
                  )}
                >
                  {t === 'cnpj' ? 'Pessoa Jurídica (CNPJ)' : 'Pessoa Física (CPF)'}
                </button>
              )
            })}
          </div>
        </Field>

        {docType === 'cnpj' ? (
          <Field full>
            <FieldLabel htmlFor="cnpj" required>CNPJ</FieldLabel>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={handleCNPJChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              inputMode="numeric"
              className={nxInputClass(!!errors.cnpj)}
            />
            {errors.cnpj ? (
              <FieldHelp variant="error">{errors.cnpj}</FieldHelp>
            ) : (
              <FieldHelp>CNPJ da empresa (formato: 00.000.000/0000-00)</FieldHelp>
            )}
          </Field>
        ) : (
          <Field full>
            <FieldLabel htmlFor="cpf" required>CPF</FieldLabel>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              inputMode="numeric"
              className={nxInputClass(!!errors.cpf)}
            />
            {errors.cpf ? (
              <FieldHelp variant="error">{errors.cpf}</FieldHelp>
            ) : (
              <FieldHelp>CPF do lojista (formato: 000.000.000-00)</FieldHelp>
            )}
          </Field>
        )}
      </FieldGrid>

      <FormActions>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar alterações'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
