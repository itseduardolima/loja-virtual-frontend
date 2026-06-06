'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { ErrorState, CartSidebar, StoreHeader, LoadingPage } from '@/components'
import {
  StoreNewFooter,
  WhatsAppChatWidget,
  PlpHero,
  PlpFilterRail,
  PlpFilterPanel,
  PlpFilterDrawer,
  PlpToolbar,
  PlpActiveChips,
  PlpProductGrid,
  PlpEmptyState,
  PlpLoadMore,
} from '@/components/Store'
import { useStorePage } from './useStorePage'

export default function StoreProductsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  // Deep-link ?category=ID → filtro inicial de categoria
  const parsedCategory = parseInt(searchParams.get('category') ?? '', 10)
  const initialCategoryId = Number.isNaN(parsedCategory) ? undefined : parsedCategory

  const vm = useStorePage({ slug, initialCategoryId })

  if (vm.storeLoading && !vm.storeInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (vm.storeError && !vm.storeInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorState message={vm.storeError} onRetry={vm.refetch} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        storeInfo={vm.storeInfo}
        slug={slug}
        searchValue={vm.search}
        onSearchChange={vm.setSearch}
        onSearchSubmit={vm.setSearch}
        onCartClick={() => vm.setIsCartOpen(true)}
      />

      <PlpHero
        slug={slug}
        niche={vm.heroNiche}
        title={vm.pageTitle}
        resultCount={vm.resultCount}
        search={vm.debouncedSearch || undefined}
      />

      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        <div className="flex gap-7 py-6">
          <PlpFilterRail activeCount={vm.activeCount} onClearAll={vm.clearAll}>
            <PlpFilterPanel {...vm.panelProps} />
          </PlpFilterRail>

          <main className="min-w-0 flex-1">
            <PlpToolbar
              resultCount={vm.resultCount}
              activeCount={vm.activeCount}
              sort={vm.sort}
              onSortChange={vm.setSort}
              view={vm.view}
              onViewChange={vm.setView}
              onOpenDrawer={() => vm.setIsDrawerOpen(true)}
            />

            {vm.chips.length > 0 && <PlpActiveChips chips={vm.chips} onClearAll={vm.clearAll} />}

            {!vm.productsLoading && vm.products.length === 0 ? (
              <PlpEmptyState
                onClear={() => {
                  vm.clearAll()
                  vm.setSearch('')
                }}
              />
            ) : (
              <PlpProductGrid
                products={vm.products}
                view={vm.view}
                loading={vm.productsLoading}
                isWished={vm.isWished}
                onOpen={vm.openProduct}
                onQuickAdd={vm.quickAdd}
                onToggleWishlist={vm.toggleWishlistProduct}
              />
            )}

            {vm.nextCursor !== null && vm.products.length > 0 && (
              <PlpLoadMore
                shown={vm.products.length}
                total={vm.resultCount}
                isFetching={vm.isFetchingMore}
                error={vm.loadMoreError}
                onLoadMore={vm.loadMore}
              />
            )}
          </main>
        </div>
      </div>

      {vm.storeInfo && <StoreNewFooter storeInfo={vm.storeInfo} />}

      <PlpFilterDrawer
        open={vm.isDrawerOpen}
        onClose={() => vm.setIsDrawerOpen(false)}
        resultCount={vm.resultCount}
        onClearAll={vm.clearAll}
      >
        <PlpFilterPanel {...vm.panelProps} />
      </PlpFilterDrawer>

      <CartSidebar
        isOpen={vm.isCartOpen}
        onClose={() => vm.setIsCartOpen(false)}
        storeId={vm.storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}`}
      />

      <WhatsAppChatWidget whatsapp={vm.storeInfo?.whatsapp} storeName={vm.storeInfo?.name} />
    </div>
  )
}
