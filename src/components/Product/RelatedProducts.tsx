'use client'

import { useStoreProducts } from '@/hooks/useStoreProducts'
import { ProductCard } from './ProductCard'

interface RelatedProductsProps {
  slug: string
  currentProductId: number
  categoryId?: number
}

export function RelatedProducts({ slug, currentProductId, categoryId }: RelatedProductsProps) {
  const { products, loading } = useStoreProducts({
    slug,
    category_id: categoryId,
    limit: 9,
  })

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-20 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    )
  }

  const related = products.filter((p) => p.id !== currentProductId).slice(0, 8)

  if (related.length < 2) return null

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 sm:py-14">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary font-integral">
          Produtos Relacionados
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
