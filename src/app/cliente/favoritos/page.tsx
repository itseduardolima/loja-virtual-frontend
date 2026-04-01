'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarCliente } from '@/components/Layout/SidebarCliente'
import { UserHeaderCliente } from '@/components/Layout/UserHeaderCliente'
import { api } from '@/lib/api'
import { buildImageUrl, formatPrice } from '@/lib/utils'
import { EmptyImageState } from '@/components/Product/EmptyImageState'
import { Heart, Package, ExternalLink } from 'lucide-react'
import { Product } from '@/types/product'

interface WishlistProductsResponse {
  data: Product[]
}

export default function FavoritosPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { wishlistIds, toggleWishlist, isLoading: wishlistLoading } = useWishlist()

  // Busca os produtos completos da wishlist (apenas para usuário logado)
  const { data: productsData, isLoading: productsLoading } = useQuery<WishlistProductsResponse>({
    queryKey: ['wishlist-products'],
    queryFn: async () => {
      const response = await api.get<WishlistProductsResponse>('/customers/wishlist/products')
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 60000,
  })

  // Proteção de rota
  if (!authLoading && !isAuthenticated) {
    router.replace('/login?redirect=/cliente/favoritos')
    return null
  }

  const products = productsData?.data ?? []
  const isLoading = authLoading || productsLoading

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarCliente currentPath="/cliente/favoritos" />

      <div className="flex-1 flex flex-col min-w-0">
        <UserHeaderCliente currentPath="/cliente/favoritos" />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Título */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meus Favoritos</h1>
                <p className="text-sm text-gray-500">Produtos que você salvou</p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Estado vazio */
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-300" />
              </div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Você não tem favoritos ainda
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Explore as lojas e adicione produtos aos seus favoritos clicando no coração.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="rounded-xl gap-2"
              >
                <Package className="h-4 w-4" />
                Explorar produtos
              </Button>
            </div>
          ) : (
            /* Grid de produtos */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                // Obter primeira imagem disponível
                let imageUrl: string | null = null
                if (product.images_by_color && Object.keys(product.images_by_color).length > 0) {
                  const firstColor = Object.keys(product.images_by_color)[0]
                  const firstImage = product.images_by_color[firstColor]?.[0]
                  if (firstImage) imageUrl = buildImageUrl(firstImage)
                } else if (Array.isArray(product.images) && product.images.length > 0) {
                  imageUrl = buildImageUrl(product.images[0])
                }

                const storeSlug = product.store?.slug

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    {/* Imagem */}
                    <div className="relative aspect-square bg-gray-50">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <EmptyImageState iconSize="sm" />
                      )}

                      {/* Botão remover */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        disabled={wishlistLoading}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-200"
                        aria-label="Remover dos favoritos"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-base font-bold text-primary mb-3">
                        {formatPrice(product.final_price?.toString() ?? product.price)}
                      </p>

                      {storeSlug && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-xl gap-1.5 text-xs"
                          onClick={() => router.push(`/loja/${storeSlug}/produto/${product.id}`)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ver produto
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
