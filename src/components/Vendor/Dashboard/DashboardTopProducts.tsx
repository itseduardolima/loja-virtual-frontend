'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import type { TopProduct } from '@/hooks/useDashboard'
import { buildImageUrl } from '@/lib/utils'
import { getFirstProductImage } from '@/lib/imageUtils'
import { formatBRL } from '@/lib/vendor'

interface DashboardTopProductsProps {
  products: TopProduct[]
  isLoading: boolean
}

const MAX_ITEMS = 5

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      {children}
    </div>
  )
}

function CardHeader({ subLabel }: { subLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
      <div>
        <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em] text-nxi1">Top produtos</h3>
        <div className="mt-0.5 text-[12.5px] text-nxi2">{subLabel}</div>
      </div>
      <Link
        href="/vendedor/produtos"
        className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-nxp hover:underline"
      >
        Ver todos <ArrowRight size={12} />
      </Link>
    </div>
  )
}

function TopRowSkeleton() {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-center gap-3 px-3 py-2.5">
      <div className="h-10 w-10 animate-pulse rounded-[10px] bg-nxbg" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-nxbg" />
        <div className="h-[3px] w-full animate-pulse rounded-full bg-nxbg" />
      </div>
      <div className="h-3 w-16 animate-pulse rounded bg-nxbg" />
    </div>
  )
}

export function DashboardTopProducts({ products, isLoading }: DashboardTopProductsProps) {
  if (isLoading) {
    return (
      <CardShell>
        <CardHeader subLabel="Mais vendidos no período" />
        <div className="px-2 pt-1 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <TopRowSkeleton key={i} />
          ))}
        </div>
      </CardShell>
    )
  }

  const items = products.slice(0, MAX_ITEMS)

  if (items.length === 0) {
    return (
      <CardShell>
        <CardHeader subLabel="Mais vendidos no período" />
        <div className="px-4 py-8 text-center text-[12.5px] text-nxi3">
          Sem vendas ainda neste período
        </div>
      </CardShell>
    )
  }

  const max = Math.max(...items.map((p) => p.revenue), 1)

  return (
    <CardShell>
      <CardHeader subLabel="Mais vendidos no período" />
      <div className="px-2 pt-1 pb-3">
        {items.map((product) => {
          const imageUrl = getFirstProductImage(product.images)
          const fillPercent = (product.revenue / max) * 100

          return (
            <Link
              key={product.product_id}
              href={`/vendedor/produtos/editar/${product.product_id}`}
              className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-nxbg"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] border border-nxborder bg-[#F4F2EC]">
                {imageUrl ? (
                  <Image
                    src={buildImageUrl(imageUrl)}
                    alt={product.product_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-nxi3">
                    <Package size={16} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="line-clamp-2 text-[13px] font-medium leading-[1.3] text-nxi1">
                  {product.product_name}
                </div>
                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-nxborder">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,hsl(237_49%_33%),#5C5FBA)]"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-right">
                <div className="whitespace-nowrap text-[13px] font-bold tracking-[-0.015em] tabular-nums text-nxi1">
                  {formatBRL(product.revenue)}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-nxi3">
                  {product.total_sold} vendidos
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </CardShell>
  )
}
