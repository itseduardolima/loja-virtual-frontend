'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ErrorState, ConfirmDialog } from '@/components'
import {
  ListPageHeader,
  StatusTabs,
  SearchField,
  TableCard,
  TableToolbar,
  TableEmptyState,
  TablePagination,
  RowActionsMenu,
  thClass,
  type StatusTab,
  type RowAction,
} from '@/components/VendorList'
import { NxButton, NxBadge, NxSelectNative } from '@/components/ProductForm'
import {
  Plus,
  Tag,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  CircleSlash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCategoriesPage } from './useCategoriesPage'
import { LoadingPage } from '@/components/Layout'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/category'

const SORT_OPTIONS = [
  { value: 'ASC', label: 'Nome A–Z' },
  { value: 'DESC', label: 'Nome Z–A' },
  { value: 'DATE_DESC', label: 'Mais recentes' },
  { value: 'DATE_ASC', label: 'Mais antigas' },
]

const STATUS_TABS: StatusTab<number | undefined>[] = [
  { value: undefined, label: 'Todas' },
  { value: 1, label: 'Ativas' },
  { value: 0, label: 'Inativas' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default function CategoriesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    filters,
    setFilters,
    categories,
    isLoading,
    error,
    meta,
    isSearching,
    handleEdit,
    handlePageChange,
    handleToggleStatus,
    isUpdatingStatus,
    deleteTarget,
    setDeleteTarget,
    handleConfirmDelete,
    isDeleting,
  } = useCategoriesPage()

  if (authLoading) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado para gerenciar categorias" />
  if (isLoading) return <LoadingPage />
  if (error) return <ErrorState message="Erro ao carregar categorias" />

  const rowActions = (category: Category): RowAction[] => [
    { label: 'Editar', icon: Pencil, onClick: () => handleEdit(category) },
    {
      label: category.status === 1 ? 'Desativar' : 'Ativar',
      icon: category.status === 1 ? EyeOff : Eye,
      onClick: () => handleToggleStatus(category),
      disabled: isUpdatingStatus,
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: () => setDeleteTarget(category),
      destructive: true,
      separatorBefore: true,
    },
  ]

  const hasFilters = !!(filters.search || filters.status !== undefined)
  const total = meta?.total ?? categories.length

  return (
    <div className="w-full">
      <ListPageHeader
        title="Categorias"
        subtitle={`${total} ${total === 1 ? 'categoria' : 'categorias'} para organizar seus produtos.`}
        action={
          <NxButton icon={Plus} onClick={() => router.push('/vendedor/categorias/criar')}>
            Nova categoria
          </NxButton>
        }
      />

      <TableCard>
        <TableToolbar>
          <StatusTabs
            tabs={STATUS_TABS}
            active={filters.status}
            onChange={(status) => setFilters((prev) => ({ ...prev, status, page: 1 }))}
          />

          <SearchField
            value={filters.search ?? ''}
            onChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
            placeholder="Buscar categorias…"
            isSearching={isSearching}
            className="ml-auto w-full sm:w-64"
          />

          <div className="w-40">
            <NxSelectNative
              value={filters.sort ?? 'ASC'}
              onChange={(sort) => setFilters((prev) => ({ ...prev, sort, page: 1 }))}
              options={SORT_OPTIONS}
            />
          </div>
        </TableToolbar>

        {categories.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className={cn(thClass, 'px-4')}>Nome</th>
                    <th className={cn(thClass, 'hidden md:table-cell')}>Descrição</th>
                    <th className={thClass}>Produtos</th>
                    <th className={cn(thClass, 'hidden sm:table-cell')}>Criada em</th>
                    <th className={thClass}>Status</th>
                    <th className={cn(thClass, 'w-12')}></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const isActive = category.status === 1
                    return (
                      <tr
                        key={category.id}
                        className="border-t border-nxborder text-[13px] transition-colors hover:bg-nxbg/60"
                      >
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="max-w-[260px] truncate text-left font-semibold text-nxi1 transition-colors hover:text-nxp"
                          >
                            {category.name}
                          </button>
                        </td>
                        <td className="hidden px-2 py-3 md:table-cell">
                          <span className="line-clamp-1 max-w-xs text-[12.5px] text-nxi2">
                            {category.description || '—'}
                          </span>
                        </td>
                        <td className="px-2 py-3 font-bold tabular-nums text-nxi1">
                          {category._count?.products ?? 0}
                        </td>
                        <td className="hidden px-2 py-3 text-[12.5px] text-nxi2 sm:table-cell">
                          {fmtDate(category.created_at)}
                        </td>
                        <td className="px-2 py-3">
                          <NxBadge
                            tone={isActive ? 'nxs' : 'nxw'}
                            icon={isActive ? CheckCircle2 : CircleSlash}
                          >
                            {isActive ? 'Ativa' : 'Inativa'}
                          </NxBadge>
                        </td>
                        <td className="px-2 py-3">
                          <RowActionsMenu actions={rowActions(category)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination
              shown={categories.length}
              total={total}
              currentPage={meta?.currentPage ?? 1}
              lastPage={meta?.lastPage ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <TableEmptyState
            icon={Tag}
            title={hasFilters ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
            description={
              hasFilters
                ? 'Ajuste os filtros ou o termo de busca para encontrar o que procura.'
                : 'Crie sua primeira categoria para organizar seus produtos.'
            }
            action={
              !hasFilters && (
                <NxButton icon={Plus} onClick={() => router.push('/vendedor/categorias/criar')}>
                  Criar primeira categoria
                </NxButton>
              )
            }
          />
        )}
      </TableCard>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir a categoria "${deleteTarget?.name ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
