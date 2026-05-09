'use client'

import { useContatos } from './useContatos'
import { Input, LoadingSpinner } from '@/components'
import { Instagram, Facebook, Mail, CheckCircle2, Radio } from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'
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

export default function ContatosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    selectedCountry,
    countriesData,
    countriesLoading,
    handleInputChange,
    handleCountrySelect,
    handleSave,
  } = useContatos()

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  // Quais canais estão preenchidos (para o resumo de canais ativos)
  const channels = [
    { id: 'whatsapp', label: 'WhatsApp', filled: !!formData.whatsapp, color: '#25D366' },
    { id: 'email', label: 'Email', filled: !!formData.email, color: '#5965E0' },
    { id: 'instagram', label: 'Instagram', filled: !!formData.instagram, color: '#E1306C' },
    { id: 'facebook', label: 'Facebook', filled: !!formData.facebook, color: '#1877F2' },
  ]
  const activeCount = channels.filter((c) => c.filled).length

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Hero: status dos canais ativos ──────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="flex items-start gap-3 border-b border-nxborder bg-gradient-to-br from-nxp/[0.04] to-transparent px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-nxp ring-1 ring-inset ring-nxp/15">
            <Radio className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13.5px] font-bold tracking-[-0.005em] text-nxi1">
              Canais de atendimento
            </h3>
            <p className="mt-0.5 text-[12px] text-nxi2">
              <strong className="text-nxi1">{activeCount}</strong> de {channels.length} canais configurados ·
              aparecem no rodapé da loja.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {channels.map((c) => (
              <span
                key={c.id}
                title={c.filled ? `${c.label} configurado` : `${c.label} não configurado`}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold uppercase ring-1 ring-inset transition-all',
                  c.filled
                    ? 'bg-nxs/10 text-nxs ring-nxs/20'
                    : 'bg-nxbg text-nxi3 ring-nxborder',
                )}
              >
                {c.filled ? <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} /> : c.label[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SectionCard>
        <SectionHeader
          title="Contatos"
          description="Como clientes podem falar com sua loja."
        />

        <FieldGrid columns={2}>
          {/* WhatsApp */}
          <Field full>
            <FieldLabel htmlFor="whatsapp">
              <span className="inline-flex h-4 w-4 items-center justify-center text-emerald-600">
                <WhatsappIcon />
              </span>
              WhatsApp para vendas
              {formData.whatsapp && (
                <span className="inline-flex items-center gap-1 rounded-full bg-nxs/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
                  <CheckCircle2 className="h-2 w-2" strokeWidth={3} />
                  Ativo
                </span>
              )}
            </FieldLabel>
            <PhoneCountryInput
              id="whatsapp"
              value={formData.whatsapp}
              onValueChange={(val) => handleInputChange('whatsapp', val)}
              placeholder="(11) 99999-9999"
              selectedCountry={selectedCountry}
              onSelectedCountryChange={handleCountrySelect}
              countriesData={countriesData}
              countriesLoading={countriesLoading}
              inputClassName={nxInputClass(!!errors.whatsapp)}
            />
            {errors.whatsapp ? (
              <FieldHelp variant="error">{errors.whatsapp}</FieldHelp>
            ) : (
              <FieldHelp>Usado nos botões “Falar no WhatsApp” da loja.</FieldHelp>
            )}
          </Field>

          {/* Email */}
          <Field full>
            <FieldLabel htmlFor="email">
              <Mail className="h-3.5 w-3.5 text-nxi3" />
              Email público
              {formData.email && (
                <span className="inline-flex items-center gap-1 rounded-full bg-nxs/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
                  <CheckCircle2 className="h-2 w-2" strokeWidth={3} />
                  Ativo
                </span>
              )}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contato@sualoja.com.br"
              className={nxInputClass(!!errors.email)}
            />
            {errors.email ? (
              <FieldHelp variant="error">{errors.email}</FieldHelp>
            ) : (
              <FieldHelp>Aparece no rodapé. Diferente do email de login.</FieldHelp>
            )}
          </Field>

          {/* Instagram */}
          <Field>
            <FieldLabel htmlFor="instagram">
              <Instagram className="h-3.5 w-3.5 text-pink-600" />
              Instagram
              {formData.instagram && (
                <span className="inline-flex items-center gap-1 rounded-full bg-nxs/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
                  <CheckCircle2 className="h-2 w-2" strokeWidth={3} />
                  Ativo
                </span>
              )}
            </FieldLabel>
            <Input
              id="instagram"
              type="url"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="https://instagram.com/sualoja"
              className={nxInputClass(!!errors.instagram)}
            />
            {errors.instagram && <FieldHelp variant="error">{errors.instagram}</FieldHelp>}
          </Field>

          {/* Facebook */}
          <Field>
            <FieldLabel htmlFor="facebook">
              <Facebook className="h-3.5 w-3.5 text-blue-600" />
              Facebook
              {formData.facebook && (
                <span className="inline-flex items-center gap-1 rounded-full bg-nxs/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/20">
                  <CheckCircle2 className="h-2 w-2" strokeWidth={3} />
                  Ativo
                </span>
              )}
            </FieldLabel>
            <Input
              id="facebook"
              type="url"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/sualoja"
              className={nxInputClass(!!errors.facebook)}
            />
            {errors.facebook && <FieldHelp variant="error">{errors.facebook}</FieldHelp>}
          </Field>
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
    </div>
  )
}
