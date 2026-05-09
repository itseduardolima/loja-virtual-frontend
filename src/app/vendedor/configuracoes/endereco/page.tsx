'use client'

import { useEndereco } from './useEndereco'
import { Input, LoadingSpinner } from '@/components'
import { Loader2 } from 'lucide-react'
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
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-nxi3" />
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
