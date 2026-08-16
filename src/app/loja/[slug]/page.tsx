'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  StoreHeader,
  CartSidebar,
  ErrorState,
  LoadingPage,
} from '@/components'
import { useStoreHomePage } from './useStoreHomePage'
import {
  AnnouncementBar,
  StoreHomeHero,
  StoreMarquee,
  StoreCategoryPills,
  StoreCollectionSection,
  StoreProductRow,
  StoreNewFooter,
  WhatsAppChatWidget,
} from '@/components/Store'
import { marqueeItems, storeAccentStyle } from '@/lib/storefront'

export default function StoreHomePage() {
  const params = useParams()
  const slug = params.slug as string

  const {
    storeInfo,
    storeError,
    categoriesToShow,
    products,
    newProducts,
    promoProducts,
    showcaseProduct,
    loading,
    productsLoading,
    search,
    setSearch,
    sort,
    setSort,
    view,
    setView,
    activeCategory,
    setActiveCategory,
    isCartOpen,
    setIsCartOpen,
    openProduct,
    quickAdd,
    toggleWishlist,
    isWished,
    handleSearchSubmit,
    jumpTo,
    refetch,
  } = useStoreHomePage(slug)

  const [barVisible, setBarVisible] = useState(true)

  if (storeError && !storeInfo) {
    return <ErrorState fullScreen message={storeError} onRetry={refetch} />
  }

  if (loading && !storeInfo) {
    return <LoadingPage />
  }

  const categoryNames = ['Todos', ...categoriesToShow.map((c) => c.name)]
  const categoryCounts = categoriesToShow.reduce<Record<string, number>>((acc, c) => {
    acc[c.name] = c._count?.products ?? 0
    return acc
  }, {})

  const handleExplore = () => {
    setActiveCategory('Todos')
    setSearch('')
    jumpTo('colecao')
  }

  const handleNovidades = () => jumpTo('novidades')

  const cardHandlers = {
    onOpen: openProduct,
    onQuickAdd: quickAdd,
    onToggleWishlist: toggleWishlist,
    isWished,
  }

  return (
    <div className="min-h-screen bg-white" style={storeAccentStyle(storeInfo)}>
      {barVisible && (
        <AnnouncementBar storeInfo={storeInfo} onDismiss={() => setBarVisible(false)} />
      )}

      <StoreHeader
        storeInfo={storeInfo ?? undefined}
        slug={slug}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
        categories={categoryNames}
      />

      {storeInfo && (
        <StoreHomeHero
          storeInfo={storeInfo}
          showcase={showcaseProduct}
          onOpenProduct={openProduct}
          onExplore={handleExplore}
          onNovidades={handleNovidades}
        />
      )}

      <StoreMarquee items={marqueeItems(storeInfo)} />

      <StoreCategoryPills
        categories={categoryNames}
        active={activeCategory}
        counts={categoryCounts}
        onSelect={(cat) => {
          setActiveCategory(cat)
          if (search) setSearch('')
        }}
      />

      <StoreCollectionSection
        products={products}
        loading={productsLoading}
        activeCategory={activeCategory}
        search={search}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        onClearFilters={() => {
          setSearch('')
          setActiveCategory('Todos')
        }}
        slug={slug}
        {...cardHandlers}
      />

      <StoreProductRow
        id="novidades"
        eyebrow="Recém-chegados"
        title="Novidades"
        products={newProducts}
        {...cardHandlers}
      />

      <StoreProductRow
        id="ofertas"
        eyebrow="Por tempo limitado"
        title="Ofertas da semana"
        products={promoProducts}
        {...cardHandlers}
      />

      <div className="h-16" />

      {storeInfo && <StoreNewFooter storeInfo={storeInfo} slug={slug} />}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}`}
      />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
