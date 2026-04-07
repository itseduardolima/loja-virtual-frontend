'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard, StorePagination, StoreSidebar, ErrorState, CartSidebar, StoreHeader, LoadingPage } from '@/components'
import { Star, Package, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStorePage } from './useStorePage'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreCategories } from '@/hooks/useStoreCategories'
import { useNiches, useStoreFields } from '@/hooks/useNiches'
import { useCart } from '@/hooks/useCart'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export default function StorePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const categoryFromUrl = searchParams.get('category')
  const parsedCategory = categoryFromUrl ? parseInt(categoryFromUrl, 10) : NaN
  const initialCategoryId = Number.isNaN(parsedCategory) ? undefined : parsedCategory
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
      // Em desktop, sidebar sempre aberta por padrão
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const {
    // Estado
    search,
    sort,
    sortField,
    filters,

    // Dados da API
    products,
    loading,
    error,
    meta,

    // Dados processados
    categories,
    availableColors,
    availableSizes,
    availableDynamicFieldNames,

    // Handlers
    handleSearch,
    handleSearchSubmit,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleAddToFavorites,
    handleViewDetails
  } = useStorePage({ slug, initialCategoryId })

  // Hook para buscar informações da loja
  const { storeInfo } = useStoreInfo(slug)

  // Categorias completas e niches para o sidebar
  const { categories: storeCategories } = useStoreCategories(slug)
  const { data: nichesData } = useNiches(storeInfo?.id || null)
  const { data: allStoreFields } = useStoreFields(storeInfo?.id || null)

  // Mapa categoria → nicho, acumulativo para não perder dados ao aplicar filtros
  const categoryNicheMapRef = useMemo(() => ({ current: {} as Record<number, number> }), [])

  const categoryNicheMap = useMemo(() => {
    if (!allStoreFields?.length || !products?.length) return categoryNicheMapRef.current

    // field_name → niche_id
    const fieldNicheMap: Record<string, number> = {}
    allStoreFields.forEach(field => {
      fieldNicheMap[field.name] = field.niche_id
    })

    // Acumula novas entradas sem remover as existentes
    products.forEach(product => {
      if (product.category?.id && product.dynamic_fields?.length > 0) {
        if (categoryNicheMapRef.current[product.category.id] !== undefined) return
        for (const df of product.dynamic_fields) {
          const nicheId = fieldNicheMap[df.field_name]
          if (nicheId) {
            categoryNicheMapRef.current[product.category.id] = nicheId
            break
          }
        }
      }
    })

    return { ...categoryNicheMapRef.current }
  }, [allStoreFields, products, categoryNicheMapRef])

  // Filtro client-side por nicho: quando nicho selecionado sem categoria específica,
  // filtra produtos cujo category.id pertence ao nicho selecionado
  const displayProducts = useMemo(() => {
    if (filters.nicheId && !filters.categoryId && Object.keys(categoryNicheMap).length > 0) {
      return products.filter(p => p.category?.id && categoryNicheMap[p.category.id] === filters.nicheId)
    }
    return products
  }, [products, filters.nicheId, filters.categoryId, categoryNicheMap])

  // Função para determinar o título da página
  const getPageTitle = () => {
    if (filters.nicheId && !filters.categoryId && nichesData?.data) {
      const niche = nichesData.data.find(n => n.id === filters.nicheId)
      if (niche) return niche.name
    }
    if (filters.categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === filters.categoryId)
      return selectedCategory ? selectedCategory.name : 'Todos os produtos'
    }
    return 'Todos os produtos'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Loja */}
      <StoreHeader
        storeInfo={storeInfo}
        slug={slug}
        searchValue={search}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="px-4 sm:px-6 lg:px-20">
        {/* Breadcrumbs */}
        <div className="pt-3 pb-1">
          <Breadcrumbs
            items={[
              { label: 'Início', href: `/loja/${slug}` },
              { label: getPageTitle() },
            ]}
          />
        </div>

        {/* Mobile Filter Button */}
        {isMobile && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-30 lg:hidden py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                className="flex-1 justify-center gap-2 h-10"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <AnimatePresence>
                {(filters.nicheId || filters.categoryId || filters.color || filters.size || filters.featured || filters.minPrice || filters.maxPrice) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {Object.values(filters).filter(v => v !== undefined && v !== false).length} ativo(s)
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

      <div className="flex gap-0 lg:gap-6">
        {/* Sidebar de Filtros - Desktop (sempre visível) / Mobile (drawer) */}
        {isMobile ? (
          <>
            {/* Overlay para mobile */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </AnimatePresence>
            {/* Drawer para mobile */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                  className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 lg:hidden flex flex-col"
                >
              {/* Header do Drawer */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8 p-0"
                  aria-label="Fechar filtros"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Conteúdo do Drawer - Scrollável */}
              <div className="flex-1 overflow-y-auto">
                <StoreSidebar
                  isOpen={true}
                  onClose={() => setIsSidebarOpen(false)}
                  onSearch={handleSearch}
                  onSortChange={(sort, sortField) => {
                    handleSortChange(sort, sortField)
                  }}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters)
                  }}
                  onClearFilters={() => {
                    handleClearFilters()
                  }}
                  searchValue={search}
                  sortValue={sort}
                  sortFieldValue={sortField}
                  activeFilters={filters}
                  categories={categories}
                  availableColors={availableColors}
                  availableSizes={availableSizes}
                  availableDynamicFieldNames={availableDynamicFieldNames}
                  storeId={storeInfo?.id || null}
                  storeCategories={storeCategories}
                  niches={nichesData?.data || []}
                  categoryNicheMap={categoryNicheMap}
                />
              </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Desktop Sidebar */
          <aside className="hidden lg:block w-full max-w-md flex-shrink-0">
            <div className="relative top-8">
              <StoreSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSearch={handleSearch}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                searchValue={search}
                sortValue={sort}
                sortFieldValue={sortField}
                activeFilters={filters}
                categories={categories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                availableDynamicFieldNames={availableDynamicFieldNames}
                storeId={storeInfo?.id || null}
                storeCategories={storeCategories}
                niches={nichesData?.data || []}
                categoryNicheMap={categoryNicheMap}
              />
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 min-w-0">
          <div className="py-4 sm:py-6 lg:py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingPage />
              </div>
            ) : (
              <>
                {/* Título e Contadores */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4 sm:mb-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2"
                      >
                        {getPageTitle()}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-sm sm:text-base text-gray-600"
                      >
                        {(() => {
                          const isNicheOnlyFilter = filters.nicheId && !filters.categoryId && Object.keys(categoryNicheMap).length > 0
                          const count = isNicheOnlyFilter ? displayProducts?.length || 0 : meta?.total || displayProducts?.length || 0
                          return `${count} ${count === 1 ? 'produto encontrado' : 'produtos encontrados'}`
                        })()}
                      </motion.p>
                    </div>
                  </div>

                  {/* Badges de Filtros Ativos */}
                  <motion.div
                    layout
                    className="flex flex-wrap items-center gap-2"
                  >
                    <AnimatePresence mode="popLayout">
                      {filters.nicheId && nichesData?.data?.find(n => n.id === filters.nicheId) && (
                        <motion.div
                          key="niche"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            Tipo: {nichesData.data.find(n => n.id === filters.nicheId)?.name}
                          </Badge>
                        </motion.div>
                      )}
                      {filters.featured && (
                        <motion.div
                          key="featured"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge className="bg-pink-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Em destaque
                          </Badge>
                        </motion.div>
                      )}
                      {filters.categoryId && categories.find(c => c.id === filters.categoryId) && (
                        <motion.div
                          key="category"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            {categories.find(c => c.id === filters.categoryId)?.name}
                          </Badge>
                        </motion.div>
                      )}
                      {filters.color && (
                        <motion.div
                          key="color"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            Cor: {filters.color}
                          </Badge>
                        </motion.div>
                      )}
                      {filters.size && (
                        <motion.div
                          key="size"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            Tamanho: {filters.size}
                          </Badge>
                        </motion.div>
                      )}
                      {(filters.nicheId || filters.categoryId || filters.color || filters.size || filters.featured || filters.minPrice || filters.maxPrice) && (
                        <motion.div
                          key="clear"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            onClick={handleClearFilters}
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-gray-600 hover:text-gray-900"
                          >
                            Limpar filtros
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Grid de Produtos */}
                  {displayProducts && Array.isArray(displayProducts) && displayProducts.length > 0 ? (
                    <>
                      <motion.div
                        layout
                        className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                      >
                        <AnimatePresence mode="popLayout">
                          {displayProducts.map((product, index) => (
                            <motion.div
                              key={product.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -20 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                              <ProductCard
                                product={product}
                                onAddToFavorites={handleAddToFavorites}
                                onViewDetails={handleViewDetails}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>

                      {/* Paginação - oculta quando filtragem client-side por nicho está ativa */}
                      {meta && meta.lastPage > 1 && !(filters.nicheId && !filters.categoryId) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="mt-6 sm:mt-8"
                        >
                          <StorePagination
                            currentPage={meta.currentPage}
                            totalPages={meta.lastPage}
                            totalItems={meta.total}
                            onPageChange={handlePageChange}
                            hasNextPage={meta.next !== null}
                            hasPrevPage={meta.prev !== null}
                          />
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-center py-8 sm:py-12 px-4"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                        className="text-gray-400 mb-4"
                      >
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-base sm:text-lg font-medium text-gray-900 mb-2"
                      >
                        Nenhum produto encontrado
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                      >
                        Tente ajustar os filtros ou termo de busca
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={handleClearFilters} variant="outline" className="w-full sm:w-auto">
                          Limpar filtros
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
          </div>
        </main>
      </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}`}
      />
    </div>
  )
}
