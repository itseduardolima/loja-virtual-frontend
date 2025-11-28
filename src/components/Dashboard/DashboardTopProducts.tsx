'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { TopProduct } from '@/hooks/useDashboard'
import Image from 'next/image'
import { TrendingUp, Package, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopProductsProps {
  products: TopProduct[]
}

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Produtos Mais Vendidos
        </CardTitle>
        <Link
          href="/vendedor/produtos"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product, index) => (
            <Link
              key={product.product_id}
              href={`/vendedor/produtos/${product.product_id}`}
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 relative">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={buildImageUrl(product.images[0])}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                    {product.product_name}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      {product.total_sold} vendidos
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {product.total_orders} pedidos
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <Badge
                      variant={product.stock < 10 ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      Estoque: {product.stock}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

