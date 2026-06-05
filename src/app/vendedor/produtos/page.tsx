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
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Package, CheckCircle2, Star, Boxes, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useProdutosPage } from './useProdutosPage'
import { LoadingPage } from '@/components/Layout'

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

          <div className="w-40">
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

          <div className="w-40">
            <NxSelectNative
              value={filters.sort}
              onChange={(v) => setFilters((prev) => ({ ...prev, sort: v, page: 1 }))}
              options={SORT_OPTIONS}
            />
          </div>
        </TableToolbar>

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
