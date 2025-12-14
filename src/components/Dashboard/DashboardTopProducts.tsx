'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { TopProduct } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopProductsProps {
  products: TopProduct[]
}

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum produto vendido ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-primary">
          Produtos Mais Vendidos
        </CardTitle>
       
      </CardHeader>
      <CardContent 
        className="h-[500px] overflow-y-auto space-y-3 scrollbar-thin"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB transparent'
        }}
      >
        {products.map((product) => (
          <Link
            key={product.product_id}
            href={`/vendedor/produtos/${product.product_id}`}
            className="block"
          >
            <div className="rounded-xl p-2 ">
              <div className="flex items-center gap-4 pb-4 border-b">
                {/* Imagem do Produto */}
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm">
                      <Image
                        src={buildImageUrl(product.images[0])}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-primary truncate mb-2">
                    {product.product_name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.total_sold || 0} vendidos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

