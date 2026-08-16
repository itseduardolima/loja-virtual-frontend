'use client'

import Link from 'next/link'
import { ShoppingBag, Clock } from 'lucide-react'
import { StoreHeader, CartSidebar, ErrorState, LoadingPage } from '@/components'
import { StoreNewFooter } from '@/components/Store'
import { storeAccentStyle } from '@/lib/storefront'
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
    <div className="min-h-screen bg-nxbg" style={storeAccentStyle(storeInfo)}>
      <StoreHeader storeInfo={storeInfo} slug={slug} onCartClick={() => setIsCartOpen(true)} />

      <SuccessHero
        orderCode={orderCode}
        customerName={snapshot?.customer_name}
        storeName={storeInfo?.name}
        onCopy={handleCopyCode}
      />

      <div className="mx-auto max-w-[640px] px-4 py-7">
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

        {/* continuar / acompanhar — peso visual igual */}
        <div className={`mt-6 grid gap-3 ${orderCode ? 'sm:grid-cols-2' : ''}`}>
          <Link
            href={`/loja/${slug}/produtos`}
            className="flex h-[50px] items-center justify-center gap-2 rounded-full border-[1.5px] border-nxborder bg-white text-[13.5px] font-extrabold text-nxi1 transition-colors hover:border-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
          >
            <ShoppingBag size={16} />
            Continuar comprando
          </Link>

          {orderCode && (
            <button
              type="button"
              onClick={handleTrack}
              className="flex h-[50px] items-center justify-center gap-2 rounded-full bg-store text-[13.5px] font-extrabold text-white transition-[background,filter] hover:brightness-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
            >
              <Clock size={16} />
              Acompanhar pedido
            </button>
          )}
        </div>
      </div>

      {/* seção de sugestões — oculta quando a loja não tem produtos */}
      {(productsLoading || suggestions.length > 0) && (
        <div className="mx-auto max-w-store border-t border-nxborder px-4 py-12 md:px-10">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            Adicione ao próximo pedido
          </span>
          <h2 className="mb-6 mt-2 font-integral text-[20px] font-bold uppercase tracking-[-0.01em] text-nxi1 sm:text-[23px]">
            Para combinar com a compra
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
      {/* sem FAB de WhatsApp aqui — o "Abrir conversa" é o único CTA verde da tela */}
    </div>
  )
}
