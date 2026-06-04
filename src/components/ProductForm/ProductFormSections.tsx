'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { Category, Niche, NicheField, NicheFieldValue } from '@/types'
import type { CreateProductFormData } from '@/schemas'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { NicheSection } from './sections/NicheSection'
import { VariantsSection } from './sections/VariantsSection'
import { SpecsSection } from './sections/SpecsSection'

interface ProductFormSectionsProps {
  form: UseFormReturn<CreateProductFormData>
  showErrors: boolean
  niches: Niche[]
  categories: Category[]
  selectedNicheId: number | null
  onNicheChange: (id: number | null) => void
  nicheFields: NicheField[]
  dynamicFieldValues: Record<string, NicheFieldValue>
  onDynamicFieldChange: (fieldId: number, value: string | string[]) => void
  onCreateCategory: () => void
  colors: string[]
  sizes: string[]
  variantStocks: { color: string; size: string; stock: number }[]
  setVariantStocks: (stocks: { color: string; size: string; stock: number }[]) => void
}

export function ProductFormSections({
  form,
  showErrors,
  niches,
  categories,
  selectedNicheId,
  onNicheChange,
  nicheFields,
  dynamicFieldValues,
  onDynamicFieldChange,
  onCreateCategory,
  colors,
  sizes,
  variantStocks,
  setVariantStocks,
}: ProductFormSectionsProps) {
  return (
    <>
      <BasicInfoSection form={form} showErrors={showErrors} />
      <NicheSection
        form={form}
        niches={niches}
        categories={categories}
        selectedNicheId={selectedNicheId}
        onNicheChange={onNicheChange}
        nicheFields={nicheFields}
        dynamicFieldValues={dynamicFieldValues}
        onDynamicFieldChange={onDynamicFieldChange}
        onCreateCategory={onCreateCategory}
        showErrors={showErrors}
      />
      <VariantsSection
        colors={colors}
        sizes={sizes}
        variantStocks={variantStocks}
        setVariantStocks={setVariantStocks}
        form={form}
      />
      <SpecsSection form={form} />
    </>
  )
}
