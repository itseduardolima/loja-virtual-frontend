'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { StoreEditorialCard } from '@/components/Store/StoreEditorialCard'
import { Product } from '@/types/product'

interface StoreProductRowProps {
  title: string
  icon?: ReactNode
  products: Product[]
  loading: boolean
  slug: string
  categoryId?: number
}

export function StoreProductRow({
  title,
  icon,
  products,
  loading,
  slug,
  categoryId,
}: StoreProductRowProps) {
  const router = useRouter()
  const viewAllHref = categoryId
    ? `/loja/${slug}/produtos?category_id=${categoryId}`
    : `/loja/${slug}/produtos`

  return (
    <div className="pt-10 pb-1">
      <div className="px-4 md:px-20 flex items-center justify-between pb-4">
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      {loading ? (
        <div className="scroll-row-wrap">
          <div className="flex gap-2 px-4 md:px-20 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[160px] sm:w-[190px] md:w-[230px] flex-shrink-0 aspect-[3/4] rounded-[8px] overflow-hidden animate-pulse bg-[#ede8e3]"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="scroll-row-wrap">
          <div className="flex gap-2 px-4 md:px-20 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="w-[160px] sm:w-[190px] md:w-[230px] flex-shrink-0 aspect-[3/4] overflow-hidden rounded-[8px] flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <StoreEditorialCard
                  product={product}
                  index={index}
                  onViewDetails={() => router.push(`/loja/${slug}/produto/${product.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
