'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star } from 'lucide-react'
import {
  StoreHeader,
  CartSidebar,
  ErrorState,
  LoadingPage,
} from '@/components'
import { useStoreHomePage } from './useStoreHomePage'
import { useStoreReviews } from '@/hooks/useStoreReviews'
import { StoreHero } from '@/components/Store/StoreHero'
import { StoreCategoryPills } from '@/components/Store/StoreCategoryPills'
import { StoreProductRow } from '@/components/Store/StoreProductRow'
import { StoreProductGrid } from '@/components/Store/StoreProductGrid'
import { StoreReviewsSection } from '@/components/Store/StoreReviewsSection'
import { StoreNewFooter } from '@/components/Store/StoreNewFooter'
import { WhatsAppChatWidget } from '@/components/Store/WhatsAppChatWidget'
import { AnnouncementBar } from '@/components/Store/AnnouncementBar'

export default function StoreHomePage() {
  const params = useParams()
  const slug = params.slug as string

  const {
    storeInfo,
    storeError,
    categoriesToShow,
    products,
    featuredProducts,
    topRatedProducts,
    productsLoading,
    search,
    setSearch,
    isCartOpen,
    setIsCartOpen,
    handleSearchSubmit,
  } = useStoreHomePage(slug)

  const { reviews: storeReviews, total: storeReviewsTotal, isLoading: storeReviewsLoading } = useStoreReviews(slug, 20, 4)

  const productsRef = useRef<HTMLDivElement>(null)
  const [barVisible, setBarVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 460)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToProducts = () => {
    if (!productsRef.current) return
    const top = productsRef.current.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Category filter state
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [novidadesActive, setNovidadesActive] = useState(false)
  const [viewMode, setViewMode] = useState<'editorial' | 'list'>('editorial')

  // Products considered "new" = created in the last 30 days
  const NOVIDADES_DAYS = 30
  const novidadesThreshold = new Date(Date.now() - NOVIDADES_DAYS * 24 * 60 * 60 * 1000)

  const handleNovidades = () => {
    setNovidadesActive(true)
    setActiveCategory('Todos')
    setSearch('')
    scrollToProducts()
  }

  const handleResetFilters = () => {
    setNovidadesActive(false)
    setActiveCategory('Todos')
    scrollToProducts()
  }

  if (storeError && !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={storeError} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (productsLoading && !storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  // Build category list for pills
  const categoryNames = ['Todos', ...categoriesToShow.map((c) => c.name)]

  // Category counts
  const categoryCounts: Record<string, number> = categoryNames.reduce((acc, cat) => {
    acc[cat] = cat === 'Todos' ? products.length : products.filter((p) => p.category?.name === cat).length
    return acc
  }, {} as Record<string, number>)

  // Client-side search filter (guards against backend returning all products)
  const searchTerm = search.trim().toLowerCase()
  const searchFilteredProducts = searchTerm
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category?.name.toLowerCase().includes(searchTerm) ||
        (p.description ?? '').toLowerCase().includes(searchTerm)
      )
    : products

  // Filter products by active category or novidades
  const categoryFilteredProducts = novidadesActive
    ? searchFilteredProducts.filter((p) => new Date(p.created_at) >= novidadesThreshold)
    : activeCategory === 'Todos'
      ? searchFilteredProducts
      : searchFilteredProducts.filter((p) => p.category?.name === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      {barVisible && <AnnouncementBar onDismiss={() => setBarVisible(false)} />}

      {/* Sticky Navbar */}
      <StoreHeader
        storeInfo={storeInfo ?? undefined}
        slug={slug}
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
        scrolled={scrolled}
        categories={categoryNames}
      />

      {/* Hero */}
      <StoreHero
        banner={storeInfo?.banner}
        name={storeInfo?.name}
        onVerColecao={handleResetFilters}
        onNovidades={handleNovidades}
      />

      {/* Category Pills */}
      <StoreCategoryPills
        categories={categoryNames}
        active={activeCategory}
        counts={categoryCounts}
        onSelect={(cat) => {
          setActiveCategory(cat)
          setNovidadesActive(false)
          if (search) setSearch('')
        }}
      />

      {/* Featured Row */}
      {!search && featuredProducts.length > 0 && (
        <StoreProductRow
          title="Em Destaque"
          products={featuredProducts}
          loading={productsLoading}
          slug={slug}
        />
      )}

      {/* Top Rated Row */}
      {!search && topRatedProducts.length > 0 && (
        <StoreProductRow
          title="Mais Avaliados"
          icon={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          products={topRatedProducts}
          loading={productsLoading}
          slug={slug}
        />
      )}

      {/* Product Grid */}
      <div ref={productsRef} />
      <StoreProductGrid
        products={categoryFilteredProducts}
        loading={productsLoading}
        categoryKey={novidadesActive ? 'novidades' : activeCategory}
        search={search}
        novidadesActive={novidadesActive}
        onClearSearch={() => {
          setSearch('')
          setActiveCategory('Todos')
          setNovidadesActive(false)
        }}
        slug={slug}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

  
      {/* Reviews */}
      <StoreReviewsSection reviews={storeReviews} total={storeReviewsTotal} loading={storeReviewsLoading} />

      {/* Footer */}
      {storeInfo && <StoreNewFooter storeInfo={storeInfo} />}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}`}
      />

      {/* WhatsApp */}
      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
