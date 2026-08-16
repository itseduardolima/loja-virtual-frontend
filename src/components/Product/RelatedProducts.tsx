'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { getProductImageUrl } from '@/lib/imageUtils'
import { Stars } from '@/components/Store/Product'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

interface RelatedProductsProps {
  slug: string
  currentProductId: number
  categoryId?: number
}

function RelatedCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const imageUrl = getProductImageUrl(product)
  const hasDiscount =
    product.promo_active && product.discount_percentage != null && product.discount_percentage > 0

  return (
    <button
      onClick={onClick}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-nxborder bg-white text-left transition-shadow hover:shadow-[0_8px_24px_rgba(3,7,18,0.08)]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-nxbg">
        {imageUrl && (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-nxa px-2 py-0.5 text-[10px] font-bold text-white">
            -{Math.floor(product.discount_percentage!)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <p className="line-clamp-1 text-[12.5px] font-semibold tracking-[-0.01em] text-nxi1">
          {product.name}
        </p>
        <div className="mt-1 flex items-center gap-1">
          <Stars rating={product.average_rating ?? 0} size={11} />
          {!!product.total_reviews && (
            <span className="text-[10px] text-nxi3">({product.total_reviews})</span>
          )}
        </div>
        <div className="mt-auto flex items-baseline gap-1.5 pt-2">
          <span className="text-[13px] font-bold text-nxi1">
            {formatPrice(String(product.final_price ?? product.price))}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-nxi3 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function RelatedProducts({ slug, currentProductId, categoryId }: RelatedProductsProps) {
  const router = useRouter()
  const { products, loading } = useStoreProducts({
    slug,
    category_id: categoryId,
    limit: 9,
  })

  if (loading) {
    return (
      <section className="border-t border-nxborder py-12 md:py-14">
        <div className="mb-6 h-6 w-56 animate-pulse rounded bg-nxbg" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-nxbg" />
          ))}
        </div>
      </section>
    )
  }

  const related = products.filter((p) => p.id !== currentProductId).slice(0, 4)

  if (related.length < 2) return null

  return (
    <section className="border-t border-nxborder py-12 md:py-14">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
        Você também pode gostar
      </span>
      <h2 className="mb-6 mt-2 font-integral text-[20px] font-bold uppercase tracking-[-0.01em] text-nxi1 sm:text-[23px]">
        Para completar o pedido
      </h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {related.map((product) => (
          <RelatedCard
            key={product.id}
            product={product}
            onClick={() => router.push(`/loja/${slug}/produto/${product.id}`)}
          />
        ))}
      </div>
    </section>
  )
}
