'use client'

import { ErrorState, ConfirmDialog } from '@/components'
import { ProductsTable } from '@/components/ProductList'
import {
  ListPageHeader,
  KpiStrip,
  StatusTabs,
  SearchField,
  TableCard,
  TableToolbar,
  TableEmptyState,
  TablePagination,
  type KpiItem,
  type StatusTab,
} from '@/components/VendorList'
import { NxButton, NxSelectNative } from '@/components/ProductForm'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Package, CheckCircle2, Star, Boxes, PackageSearch, SlidersHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useProdutosPage } from './useProdutosPage'
import { LoadingPage } from '@/components/Layout'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'price_asc', label: 'Menor preço' },
]

export default function ProdutosPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirected = useRef(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const {
    filters,
    setFilters,
    products,
    meta,
    stats,
    storeSlug,
    isLoading,
    error,
    handlePageChange,
    isSearching,
    handleToggleStatus,
    isUpdatingStatus,
    handleDuplicate,
    isDuplicating,
    deleteTarget,
    setDeleteTarget,
    handleConfirmDelete,
    isDeleting,
  } = useProdutosPage()

  if (authLoading) return <LoadingPage />

  if (!user || user.profile !== 'Vendedor') {
    if (!redirected.current) {
      redirected.current = true
      router.push('/login')
    }
    return <LoadingPage />
  }

  if (isLoading) return <LoadingPage />

  if (error) {
    return (
      <ErrorState
        message="Erro ao carregar produtos"
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
        retryText="Tentar novamente"
      />
    )
  }

  const kpis: KpiItem[] = [
    { label: 'Total de produtos', value: stats.total, icon: Package, tone: 'nxp' },
    { label: 'Ativos na vitrine', value: stats.active, icon: CheckCircle2, tone: 'nxs' },
    { label: 'Em destaque', value: stats.featured, icon: Star, tone: 'nxa' },
    { label: 'Itens em estoque', value: stats.totalStock, icon: Boxes, tone: 'nxw' },
  ]

  const statusTabs: StatusTab<number | undefined>[] = [
    { value: undefined, label: 'Todos', count: stats.total },
    { value: 1, label: 'Ativos', count: stats.active },
    { value: 2, label: 'Rascunhos' },
    { value: 0, label: 'Inativos' },
  ]

  const hasFilters = !!(filters.search || filters.status !== undefined || filters.featured)

  return (
    <div className="w-full">
      <ListPageHeader
        title="Produtos"
        subtitle={`${stats.total} ${stats.total === 1 ? 'produto' : 'produtos'} · ${stats.active} ativos na sua vitrine.`}
        action={
          <NxButton icon={Plus} onClick={() => router.push('/vendedor/produtos/criar')}>
            Novo produto
          </NxButton>
        }
      />

      <div className="mb-5">
        <KpiStrip items={kpis} />
      </div>

      <TableCard>
        {/* Desktop toolbar */}
        <div className="hidden sm:block">
          <TableToolbar>
            <StatusTabs
              tabs={statusTabs}
              active={filters.status}
              onChange={(status) => setFilters((prev) => ({ ...prev, status, page: 1 }))}
            />

            <SearchField
              value={filters.search}
              onChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
              placeholder="Buscar produtos…"
              isSearching={isSearching}
              className="ml-auto w-full sm:w-64"
            />

            <div className="w-full sm:w-40">
              <NxSelectNative
                value={filters.featured ? 'featured' : 'all'}
                onChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    featured: v === 'featured' ? true : undefined,
                    page: 1,
                  }))
                }
                options={[
                  { value: 'all', label: 'Todos os produtos' },
                  { value: 'featured', label: 'Em destaque' },
                ]}
              />
            </div>

            <div className="w-full sm:w-40">
              <NxSelectNative
                value={filters.sort}
                onChange={(v) => setFilters((prev) => ({ ...prev, sort: v, page: 1 }))}
                options={SORT_OPTIONS}
              />
            </div>
          </TableToolbar>
        </div>

        {/* Mobile toolbar */}
        <div className="flex items-center gap-2 border-b border-nxborder p-3 sm:hidden">
          <SearchField
            value={filters.search}
            onChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
            placeholder="Buscar produtos…"
            isSearching={isSearching}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className={cn(
              'relative flex h-[38px] shrink-0 items-center gap-[6px] rounded-[11px] border px-[12px] text-[12.5px] font-bold transition-colors',
              hasFilters
                ? 'border-nxp bg-[#EEF0FB] text-nxp'
                : 'border-nxborder bg-white text-nxi2',
            )}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {hasFilters && (
              <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-nxp px-[4px] text-[10px] font-extrabold text-white">
                {[filters.status !== undefined, !!filters.featured].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-[20px] px-0 pb-0">
            <SheetHeader className="border-b border-nxborder px-[16px] pb-[14px] pt-[18px]">
              <SheetTitle className="text-[16px] font-extrabold text-nxi1">Filtros</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto px-[16px] pb-[env(safe-area-inset-bottom,24px)] pt-[16px]">
              {/* Status */}
              <div className="mb-[18px]">
                <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.06em] text-nxi3">
                  Status
                </div>
                <div className="flex flex-col gap-[6px]">
                  {statusTabs.map((tab) => {
                    const active = filters.status === tab.value
                    return (
                      <button
                        key={String(tab.value)}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, status: tab.value, page: 1 }))
                        }}
                        className={cn(
                          'flex h-[42px] items-center justify-between rounded-[12px] border px-[14px] text-[13.5px] font-bold',
                          active
                            ? 'border-nxp bg-[#EEF0FB] text-nxp'
                            : 'border-nxborder bg-white text-nxi2',
                        )}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count !== null && (
                          <span className={cn('text-[12px] font-bold', active ? 'text-nxp' : 'text-nxi3')}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Destaque */}
              <div className="mb-[18px]">
                <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.06em] text-nxi3">
                  Destaque
                </div>
                <div className="flex flex-col gap-[6px]">
                  {[
                    { value: undefined, label: 'Todos os produtos' },
                    { value: true, label: 'Em destaque' },
                  ].map((opt) => {
                    const active = filters.featured === opt.value
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, featured: opt.value as boolean | undefined, page: 1 }))
                        }
                        className={cn(
                          'flex h-[42px] items-center rounded-[12px] border px-[14px] text-[13.5px] font-bold',
                          active
                            ? 'border-nxp bg-[#EEF0FB] text-nxp'
                            : 'border-nxborder bg-white text-nxi2',
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Ordenação */}
              <div className="mb-[18px]">
                <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.06em] text-nxi3">
                  Ordenar por
                </div>
                <div className="flex flex-col gap-[6px]">
                  {SORT_OPTIONS.map((opt) => {
                    const active = filters.sort === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, sort: opt.value, page: 1 }))
                        }
                        className={cn(
                          'flex h-[42px] items-center rounded-[12px] border px-[14px] text-[13.5px] font-bold',
                          active
                            ? 'border-nxp bg-[#EEF0FB] text-nxp'
                            : 'border-nxborder bg-white text-nxi2',
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-[10px] pb-[8px]">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        status: undefined,
                        featured: undefined,
                        sort: 'newest',
                        page: 1,
                      }))
                    }}
                    className="flex h-[44px] flex-1 items-center justify-center gap-[6px] rounded-[12px] border border-nxborder text-[13.5px] font-bold text-nxi2"
                  >
                    <X size={15} />
                    Limpar filtros
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="flex h-[44px] flex-1 items-center justify-center rounded-[12px] bg-nxp text-[13.5px] font-bold text-white"
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {products.length > 0 ? (
          <>
            <ProductsTable
              products={products}
              storeSlug={storeSlug}
              onEdit={(id) => router.push(`/vendedor/produtos/editar/${id}`)}
              onView={(id) => router.push(`/vendedor/produtos/editar/${id}`)}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
              onDelete={setDeleteTarget}
              isDuplicating={isDuplicating}
              isUpdatingStatus={isUpdatingStatus}
            />
            <TablePagination
              shown={products.length}
              total={meta?.total ?? stats.total}
              currentPage={meta?.currentPage ?? 1}
              lastPage={meta?.lastPage ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <TableEmptyState
            icon={PackageSearch}
            title={hasFilters ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            description={
              hasFilters
                ? 'Ajuste os filtros ou o termo de busca para encontrar o que procura.'
                : 'Cadastre um novo produto para começar a vender.'
            }
            action={
              <NxButton icon={Plus} onClick={() => router.push('/vendedor/produtos/criar')}>
                Novo produto
              </NxButton>
            }
          />
        )}
      </TableCard>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
