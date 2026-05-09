'use client'

import { useContatos } from './useContatos'
import { Input, LoadingSpinner } from '@/components'
import { Instagram, Facebook, Mail } from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'
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

  return (
    <SectionCard>
      <SectionHeader
        title="Contatos"
        description="Como clientes podem falar com sua loja. Aparece no rodapé e na página de contato."
      />

      <FieldGrid columns={2}>
        {/* WhatsApp */}
        <Field full>
          <FieldLabel htmlFor="whatsapp">
            <WhatsappIcon /> WhatsApp para vendas
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
            <Mail className="h-3.5 w-3.5 text-nxi3" /> Email público
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
            <Instagram className="h-3.5 w-3.5 text-pink-600" /> Instagram
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
            <Facebook className="h-3.5 w-3.5 text-blue-600" /> Facebook
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
  )
}
