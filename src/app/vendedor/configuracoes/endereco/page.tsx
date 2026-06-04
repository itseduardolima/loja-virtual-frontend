'use client'

import { useEndereco } from './useEndereco'
import { Input, LoadingSpinner } from '@/components'
import { Loader2, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const UFS: Array<[string, string]> = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'],
  ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'],
  ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'],
  ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'],
  ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'],
  ['TO', 'Tocantins'],
]

const triggerCls = (error?: boolean) =>
  cn(
    'h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-nxi1 transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-nxp/30',
    error
      ? 'border-nxd focus:border-nxd'
      : 'border-nxborder focus:border-nxp',
  )

export default function EnderecoPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    isFetchingCep,
    cepError,
    handleZipcodeChange,
    handleInputChange,
    handleSave,
  } = useEndereco()

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
        title="Endereço da loja"
        description="Endereço completo do estabelecimento."
      />

      <FieldGrid columns={3}>
        {/* CEP */}
        <Field>
          <FieldLabel htmlFor="zipcode" required>CEP</FieldLabel>
          <div className="relative">
            <Input
              id="zipcode"
              value={formData.zipcode}
              onChange={(e) => handleZipcodeChange(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
              inputMode="numeric"
              autoComplete="postal-code"
              className={cn(nxInputClass(!!errors.zipcode || !!cepError), isFetchingCep && 'pr-10')}
            />
            {isFetchingCep && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-nxi3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
          </div>
          {cepError ? (
            <FieldHelp variant="error">{cepError}</FieldHelp>
          ) : errors.zipcode ? (
            <FieldHelp variant="error">{errors.zipcode}</FieldHelp>
          ) : (
            <FieldHelp>Digite o CEP para autopreencher.</FieldHelp>
          )}
        </Field>

        {/* Estado (UF) */}
        <Field>
          <FieldLabel htmlFor="state" required>Estado</FieldLabel>
          <Select
            value={formData.state || ''}
            onValueChange={(v) => handleInputChange('state', v)}
          >
            <SelectTrigger id="state" className={triggerCls(!!errors.state)}>
              <SelectValue placeholder="Selecione…" />
            </SelectTrigger>
            <SelectContent>
              {UFS.map(([uf, name]) => (
                <SelectItem key={uf} value={uf}>
                  {uf} — {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <FieldHelp variant="error">{errors.state}</FieldHelp>}
        </Field>

        {/* Cidade */}
        <Field>
          <FieldLabel htmlFor="city" required>Cidade</FieldLabel>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Digite a cidade"
            autoComplete="address-level2"
            className={nxInputClass(!!errors.city)}
          />
          {errors.city && <FieldHelp variant="error">{errors.city}</FieldHelp>}
        </Field>

        {/* Logradouro */}
        <Field full>
          <FieldLabel htmlFor="address" required>Rua / Logradouro</FieldLabel>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Digite o logradouro"
            autoComplete="street-address"
            className={nxInputClass(!!errors.address)}
          />
          {errors.address && <FieldHelp variant="error">{errors.address}</FieldHelp>}
        </Field>

        {/* Número */}
        <Field>
          <FieldLabel htmlFor="number" required>Número</FieldLabel>
          <Input
            id="number"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="Ex: 123"
            maxLength={12}
            className={nxInputClass(!!errors.number)}
          />
          {errors.number && <FieldHelp variant="error">{errors.number}</FieldHelp>}
        </Field>

        {/* Bairro */}
        <Field>
          <FieldLabel htmlFor="neighborhood" required>Bairro</FieldLabel>
          <Input
            id="neighborhood"
            value={formData.neighborhood}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            placeholder="Digite o bairro"
            className={nxInputClass(!!errors.neighborhood)}
          />
          {errors.neighborhood && <FieldHelp variant="error">{errors.neighborhood}</FieldHelp>}
        </Field>

        {/* Complemento */}
        <Field full>
          <FieldLabel htmlFor="complement">Complemento</FieldLabel>
          <Input
            id="complement"
            value={formData.complement}
            onChange={(e) => handleInputChange('complement', e.target.value)}
            placeholder="Ex.: Sala 12, Bloco B, Andar 3"
            maxLength={60}
            className={nxInputClass(!!errors.complement)}
          />
          {errors.complement ? (
            <FieldHelp variant="error">{errors.complement}</FieldHelp>
          ) : (
            <FieldHelp>Opcional · {formData.complement?.length || 0}/60</FieldHelp>
          )}
        </Field>
      </FieldGrid>

      {/* Address preview — formatado como em NF-e */}
      {(formData.address || formData.city) && (
        <div className="mt-5 overflow-hidden rounded-xl border border-nxborder bg-gradient-to-br from-nxbg/50 to-white">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxp/10 text-nxp ring-1 ring-inset ring-nxp/15">
              <MapPin className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
                Endereço completo
              </div>
              <div className="mt-1 space-y-0.5 break-words text-[13px] leading-relaxed text-nxi1">
                {formData.address && (
                  <p className="font-semibold">
                    {formData.address}
                    {formData.number ? `, ${formData.number}` : ''}
                    {formData.complement ? ` · ${formData.complement}` : ''}
                  </p>
                )}
                {(formData.neighborhood || formData.city || formData.state) && (
                  <p className="text-nxi2">
                    {[formData.neighborhood, formData.city, formData.state].filter(Boolean).join(' · ')}
                  </p>
                )}
                {formData.zipcode && (
                  <p className="font-mono text-[11.5px] text-nxi3">
                    CEP {formData.zipcode}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <FormActions>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar endereço'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
