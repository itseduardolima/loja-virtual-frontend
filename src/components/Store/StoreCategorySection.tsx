'use client'

import Link from 'next/link'
import { ProductCard, LoadingPage } from '@/components'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'
import type { StoreCategory } from '@/types/store'

const PRODUCTS_PER_SECTION = 4

interface StoreCategorySectionProps {
  slug: string
  category: StoreCategory
  onViewDetails: (product: Product) => void
  onAddToFavorites: (product: Product) => void
  /** Quando fornecido, usa estes produtos diretamente e não faz fetch interno */
  products?: Product[]
}

export function StoreCategorySection({
  slug,
  category,
  onViewDetails,
  onAddToFavorites,
  products: productsProp,
}: StoreCategorySectionProps) {
  // Se produtos já foram passados diretamente, não faz fetch (slug vazio impede a requisição)
  const { products: fetched, loading } = useStoreProducts({
    slug: productsProp ? '' : slug,
    page: 1,
    limit: PRODUCTS_PER_SECTION,
    sort: 'DESC',
    sort_field: 'created_at',
    category_id: category.id > 0 ? category.id : undefined,
  })

  const products = productsProp ?? fetched

  if (!productsProp && loading) {
    return (
      <section className="mb-10 sm:mb-14">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wide mb-4 sm:mb-6">
          {category.name}
        </h2>
        <div className="flex items-center justify-center py-12 min-h-[200px]">
          <LoadingPage />
        </div>
      </section>
    )
  }

  if (!products.length) return null

  return (
    <section className="mb-10 sm:mb-14">
      <h2 className="text-lg sm:text-4xl font-bold text-gray-900 uppercase tracking-wide mb-4 sm:mb-6 text-center font-integral p-10">
        {category.name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, PRODUCTS_PER_SECTION).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToFavorites={onAddToFavorites}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" asChild>
          <Link href={
            category.id > 0
              ? `/loja/${slug}/produtos?category=${category.id}`
              : `/loja/${slug}/produtos`
          }>
            Ver todos
          </Link>
        </Button>
      </div>
    </section>
  )
}
