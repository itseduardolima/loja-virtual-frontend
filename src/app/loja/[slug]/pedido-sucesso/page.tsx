'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StoreHeader, CartSidebar, ProductCard, ErrorState, LoadingPage } from '@/components'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { AppFooter } from '@/components/Layout'
import { Product } from '@/types/product'

export default function PedidoSucessoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const orderCode = searchParams.get('codigo') ?? ''

  const [isCartOpen, setIsCartOpen] = useState(false)

  const { storeInfo, loading: storeLoading, error: storeError, refetch: refetchStore } = useStoreInfo(slug)
  const { products, loading: productsLoading } = useStoreProducts({
    slug,
    limit: 8,
    page: 1,
    sort: 'DESC',
    sort_field: 'created_at',
  })
  const storeId = storeInfo?.id
  useCart(storeId)

  const handleViewDetails = (product: Product) => {
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  if (storeLoading && !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (storeError && !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={storeError} onRetry={refetchStore} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
        {/* Sucesso */}
        <section className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 text-green-600 mb-4 sm:mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-integral mb-2">
            Pedido realizado com sucesso
          </h1>
          {orderCode && (
            <p className="text-gray-600 mb-1">
              Código do pedido: <strong className="text-gray-900">#{orderCode}</strong>
            </p>
          )}
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Você foi redirecionado ao WhatsApp para contato com o vendedor.
          </p>
        </section>

        {/* Aviso pagamento e entrega */}
        <section className="max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="flex gap-3 p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <h2 className="font-bold text-amber-900 text-sm sm:text-base mb-1">
                Próximos passos
              </h2>
              <p className="text-amber-800 text-sm sm:text-base">
                As questões de <strong>pagamento e entrega</strong> devem ser alinhadas diretamente com o vendedor pelo WhatsApp.
                Responda à conversa que abrimos para você e combine a forma de pagamento e o envio do pedido.
              </p>
            </div>
          </div>
        </section>

        {/* Continuar comprando */}
        <section className="text-center mb-10 sm:mb-14">
          <Link href={`/loja/${slug}/produtos`}>
            <Button size="lg" className="gap-2 rounded-full">
              <ShoppingBag className="w-5 h-5" />
              Continuar comprando
            </Button>
          </Link>
        </section>

        {/* Sugestões de produtos */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900  mb-6">
            Sugestões para você
          </h2>
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={() => handleViewDetails(product)}
                  onAddToFavorites={() => {}}
                  showFavorites={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum produto disponível no momento.
            </p>
          )}
        </section>
      </main>

      <AppFooter />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeId}
        storeSlug={slug}
      />
    </div>
  )
}
