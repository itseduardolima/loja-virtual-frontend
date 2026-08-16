'use client'

import { cn } from '@/lib/utils'
import { SectionCard } from './SectionCard'
import { Field, inputCls } from './Field'

interface CustomerDataSectionProps {
  formData: {
    customer_name: string
    customer_email: string
    customer_phone: string
    notes: string
  }
  errors: Record<string, string>
  dadosDone: boolean
  handleInput: (field: string, value: string) => void
}

/** Formata telefone: (11) 99999-9999 */
function fmtPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function CustomerDataSection({
  formData,
  errors,
  dadosDone,
  handleInput,
}: CustomerDataSectionProps) {
  return (
    <SectionCard
      n="1"
      title="Seus dados"
      desc="Usados para identificar o pedido e o contato."
      done={dadosDone}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Nome */}
        <div className="sm:col-span-2">
          <Field label="Nome completo" required error={errors.customer_name}>
            <input
              value={formData.customer_name}
              onChange={(e) => handleInput('customer_name', e.target.value.slice(0, 100))}
              autoComplete="name"
              placeholder="Seu nome"
              className={inputCls(!!errors.customer_name)}
            />
          </Field>
        </div>

        {/* E-mail */}
        <Field label="E-mail" required error={errors.customer_email}>
          <input
            type="email"
            value={formData.customer_email}
            onChange={(e) => handleInput('customer_email', e.target.value.slice(0, 100))}
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            className={inputCls(!!errors.customer_email)}
          />
        </Field>

        {/* WhatsApp */}
        <Field
          label="WhatsApp"
          required
          error={errors.customer_phone}
          hint={!errors.customer_phone ? 'Para a loja falar com você.' : undefined}
        >
          <input
            type="tel"
            value={formData.customer_phone}
            onChange={(e) => handleInput('customer_phone', fmtPhone(e.target.value))}
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            className={inputCls(!!errors.customer_phone)}
          />
        </Field>

        {/* Observações */}
        <div className="sm:col-span-2">
          <Field label="Observações" counter={`${formData.notes.length}/230`}>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInput('notes', e.target.value.slice(0, 230))}
              rows={2}
              maxLength={230}
              placeholder="Algum detalhe sobre o pedido? (opcional)"
              className={cn(inputCls(false), 'h-auto resize-none py-2.5 leading-relaxed')}
            />
          </Field>
        </div>
      </div>
    </SectionCard>
  )
}
