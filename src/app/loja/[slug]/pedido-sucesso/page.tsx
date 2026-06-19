'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { StoreHeader, CartSidebar, ErrorState, LoadingPage } from '@/components'
import { WhatsAppChatWidget, StoreNewFooter } from '@/components/Store'
import { usePedidoSucessoPage } from './usePedidoSucessoPage'
import { SuccessHero } from './_components/SuccessHero'
import { WhatsAppContinueCard } from './_components/WhatsAppContinueCard'
import { OrderTimeline } from './_components/OrderTimeline'
import { OrderRecap } from './_components/OrderRecap'
import { SuggestionCard } from './_components/SuggestionCard'

export default function PedidoSucessoPage() {
  const {
    slug,
    orderCode,
    isCartOpen,
    setIsCartOpen,
    storeInfo,
    storeLoading,
    storeError,
    refetchStore,
    storeId,
    productsLoading,
    snapshot,
    whatsappHref,
    handleCopyCode,
    handleTrack,
    handleOpenProduct,
    suggestions,
  } = usePedidoSucessoPage()

  if (storeLoading && !storeInfo) {
    return <LoadingPage />
  }

  if (storeError && !storeInfo) {
    return <ErrorState fullScreen message={storeError} onRetry={refetchStore} />
  }

  return (
    <div className="min-h-screen bg-nxbg">
      <StoreHeader storeInfo={storeInfo} slug={slug} onCartClick={() => setIsCartOpen(true)} />

      <SuccessHero
        orderCode={orderCode}
        customerName={snapshot?.customer_name}
        onCopy={handleCopyCode}
      />

      <div className="mx-auto max-w-[760px] px-4 py-10">
        {/* card WhatsApp */}
        {whatsappHref && (
          <WhatsAppContinueCard storeName={storeInfo?.name} whatsappHref={whatsappHref} />
        )}

        {/* timeline de passos */}
        <div className="mt-8">
          <OrderTimeline />
        </div>

        {/* recap do pedido — só quando snapshot disponível */}
        {snapshot && (
          <div className="mt-8">
            <OrderRecap snapshot={snapshot} />
          </div>
        )}

        {/* continuar / acompanhar */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href={`/loja/${slug}/produtos`}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-nxborder bg-white px-6 text-[13.5px] font-bold text-nxi1 transition-colors hover:border-nxp hover:text-nxp"
          >
            <ShoppingBag size={17} />
            Continuar comprando
          </Link>

          {orderCode && (
            <button
              type="button"
              onClick={handleTrack}
              className="text-[12.5px] font-semibold text-nxi3 hover:text-nxi1"
            >
              Acompanhar pedido
            </button>
          )}
        </div>
      </div>

      {/* seção de sugestões — oculta quando a loja não tem produtos */}
      {(productsLoading || suggestions.length > 0) && (
        <div className="mx-auto max-w-[1180px] border-t border-nxborder px-4 py-12 md:px-10">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            Você pode gostar
          </span>
          <h2 className="mb-6 mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-nxi1 sm:text-[26px]">
            Sugestões para você
          </h2>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {productsLoading
              ? [0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-nxbg" />
                ))
              : suggestions.map((product) => (
                  <SuggestionCard
                    key={product.id}
                    product={product}
                    onOpen={() => handleOpenProduct(product.id)}
                  />
                ))}
          </div>
        </div>
      )}

      {storeInfo && <StoreNewFooter storeInfo={storeInfo} slug={slug} />}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeId}
        storeSlug={slug}
      />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
