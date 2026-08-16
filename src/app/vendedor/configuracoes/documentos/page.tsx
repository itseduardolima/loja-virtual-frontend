'use client'

import { useState, useEffect } from 'react'
import { useDocumentos } from './useDocumentos'
import { Input, LoadingSpinner } from '@/components'
import { cn } from '@/lib/utils'
import { Building2, User, ShieldCheck, CheckCircle2 } from 'lucide-react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldLabel,
  FieldHelp,
  FormActions,
  NxButton,
  nxInputClass,
} from '../_shared'

type DocType = 'cnpj' | 'cpf'

interface DocTypeMeta {
  id: DocType
  Icon: typeof Building2
  title: string
  subtitle: string
  bullets: string[]
}

const DOC_TYPES: DocTypeMeta[] = [
  {
    id: 'cnpj',
    Icon: Building2,
    title: 'Pessoa Jurídica',
    subtitle: 'CNPJ · Empresa formal',
    bullets: ['Emite nota fiscal como empresa', 'Mais credibilidade', 'Permite vender em marketplaces'],
  },
  {
    id: 'cpf',
    Icon: User,
    title: 'Pessoa Física',
    subtitle: 'CPF · Autônomo / MEI sem CNPJ',
    bullets: ['Cadastro simplificado', 'Sem necessidade de empresa', 'Limite de faturamento anual'],
  },
]

export default function DocumentosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    handleCNPJChange,
    handleCPFChange,
    handleSave,
    handleReset,
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

  // Document considered "filled" — used to show validation chip
  const isFilled = docType === 'cnpj'
    ? !!formData.cnpj && !errors.cnpj
    : !!formData.cpf && !errors.cpf

  return (
    <SectionCard>
      <SectionHeader
        title="Documentos"
        description="Identifique sua loja para emissão de notas fiscais e comprovação de titularidade."
      />

      {/* Cards de seleção de tipo */}
      <div>
        <FieldLabel className="mb-2.5">Tipo de cadastro</FieldLabel>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {DOC_TYPES.map((opt) => {
            const active = docType === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDocType(opt.id)}
                className={cn(
                  'group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all',
                  active
                    ? 'border-nxp/40 bg-nxp/[0.04] shadow-[0_2px_8px_hsl(237_49%_33%/0.08)]'
                    : 'border-nxborder bg-white hover:border-nxp/20 hover:bg-nxbg/30',
                )}
              >
                {/* Indicador "selecionado" */}
                <div
                  className={cn(
                    'absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full transition-all',
                    active
                      ? 'bg-nxp text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)]'
                      : 'border-2 border-nxborder bg-white',
                  )}
                >
                  {active && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                </div>

                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                    active ? 'bg-nxp/10 text-nxp ring-1 ring-inset ring-nxp/15' : 'bg-nxbg text-nxi3',
                  )}
                >
                  <opt.Icon size={22} strokeWidth={1.75} />
                </div>

                <div>
                  <div className={cn('text-[14px] font-bold tracking-[-0.005em]', active ? 'text-nxp' : 'text-nxi1')}>
                    {opt.title}
                  </div>
                  <div className="mt-0.5 text-[11.5px] font-medium uppercase tracking-[0.04em] text-nxi3">
                    {opt.subtitle}
                  </div>
                </div>

                <ul className="mt-1 space-y-1">
                  {opt.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5 text-[12px] leading-snug text-nxi2">
                      <CheckCircle2
                        className={cn('mt-0.5 h-3 w-3 shrink-0', active ? 'text-nxp/70' : 'text-nxi3')}
                        strokeWidth={2.5}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </div>

      {/* Input do documento — aparece após escolher o tipo */}
      <div className="mt-6">
        <div className="mb-2.5 flex items-center justify-between">
          <FieldLabel htmlFor={docType === 'cnpj' ? 'cnpj' : 'cpf'} required>
            {docType === 'cnpj' ? 'CNPJ da empresa' : 'CPF do lojista'}
          </FieldLabel>
          {isFilled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-nxs/10 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
              <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
              Válido
            </span>
          )}
        </div>

        {docType === 'cnpj' ? (
          <Field full>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={handleCNPJChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              inputMode="numeric"
              className={cn(nxInputClass(!!errors.cnpj), 'font-mono tracking-wide')}
            />
            {errors.cnpj ? (
              <FieldHelp variant="error">{errors.cnpj}</FieldHelp>
            ) : (
              <FieldHelp>Formato: 00.000.000/0000-00</FieldHelp>
            )}
          </Field>
        ) : (
          <Field full>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              inputMode="numeric"
              className={cn(nxInputClass(!!errors.cpf), 'font-mono tracking-wide')}
            />
            {errors.cpf ? (
              <FieldHelp variant="error">{errors.cpf}</FieldHelp>
            ) : (
              <FieldHelp>Formato: 000.000.000-00</FieldHelp>
            )}
          </Field>
        )}
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
  )
}
