'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { CreateProductFormData } from '@/schemas'

export function useFormWatchers(form: UseFormReturn<CreateProductFormData>) {
  const name = form.watch('name')
  const description = form.watch('description')
  const price = form.watch('price')
  const promoPrice = form.watch('promo_price')
  const promoEndsAt = form.watch('promo_ends_at')
  const featured = form.watch('featured')
  const categoryId = form.watch('category_id')
  const specifications = form.watch('specifications')
  const stockValue = form.watch('stock')
  return { name, description, price, promoPrice, promoEndsAt, featured, categoryId, specifications, stockValue }
}
