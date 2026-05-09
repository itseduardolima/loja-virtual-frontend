'use client'

import { useInformacoesBasicas } from './useInformacoesBasicas'
import { Input, Textarea, LoadingSpinner } from '@/components'
import Image from 'next/image'
import { Upload } from 'lucide-react'
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
    isFormValid,
    logoPreview,
    bannerPreview,
    handleInputChange,
    handleFileChange,
    handleSave,
  } = useInformacoesBasicas()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

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
        title="Informações básicas"
        description="Como sua loja aparece para clientes e nos buscadores."
      />

      <div className="space-y-5">
        {/* Nome da loja */}
        <Field full>
          <FieldLabel htmlFor="name" required>Nome da loja</FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Digite o nome da loja"
            className={nxInputClass(!!errors.name)}
          />
          {errors.name ? (
            <FieldHelp variant="error">{errors.name}</FieldHelp>
          ) : (
            <FieldHelp>Aparece no cabeçalho da loja e em resultados de busca.</FieldHelp>
          )}
        </Field>

        {/* Descrição */}
        <Field full>
          <FieldLabel htmlFor="description">Descrição da loja</FieldLabel>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva sua loja..."
            maxLength={170}
            className={cn(
              'min-h-[100px] rounded-lg border bg-white px-3 py-2 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30',
              errors.description
                ? 'border-nxd focus-visible:border-nxd'
                : 'border-nxborder focus-visible:border-nxp',
            )}
          />
          {errors.description ? (
            <FieldHelp variant="error">{errors.description}</FieldHelp>
          ) : (
            <FieldHelp>
              {formData.description.length}/170 caracteres · usada como descrição padrão para SEO.
            </FieldHelp>
          )}
        </Field>

        {/* Logo + Banner */}
        <FieldGrid columns={2}>
          <Field>
            <FieldLabel>Logo da loja</FieldLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-nxborder bg-nxbg/40 transition-colors hover:border-nxp/40 hover:bg-nxp/[0.04]"
            >
              <Upload className="mb-1.5 h-7 w-7 text-nxi3" strokeWidth={1.75} />
              <span className="text-[12.5px] font-medium text-nxi2">
                Clique para fazer upload
              </span>
            </label>
            {logoPreview && (
              <div className="mt-3 h-40 w-40 overflow-hidden rounded-xl border border-nxborder bg-white">
                <Image
                  src={
                    logoPreview.startsWith('data:') || logoPreview.startsWith('http')
                      ? logoPreview
                      : `${API_URL}${logoPreview}`
                  }
                  alt="Logo preview"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel>Banner da loja</FieldLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('banner', e.target.files?.[0] || null)}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-nxborder bg-nxbg/40 transition-colors hover:border-nxp/40 hover:bg-nxp/[0.04]"
            >
              <Upload className="mb-1.5 h-7 w-7 text-nxi3" strokeWidth={1.75} />
              <span className="text-[12.5px] font-medium text-nxi2">
                Clique para fazer upload
              </span>
            </label>
            {bannerPreview && (
              <div className="mt-3 h-40 w-full overflow-hidden rounded-xl border border-nxborder bg-white">
                <Image
                  src={
                    bannerPreview.startsWith('data:') || bannerPreview.startsWith('http')
                      ? bannerPreview
                      : `${API_URL}${bannerPreview}`
                  }
                  alt="Banner preview"
                  width={400}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </Field>
        </FieldGrid>
      </div>

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
