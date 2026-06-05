'use client'

import { useRouter } from 'next/navigation'
import { CreditCard, Plus, Pencil } from 'lucide-react'
import { Table, Column, ConfirmDialog } from '@/components'
import { AdminPlan } from '@/types/admin'
import { formatBRL } from '@/lib/utils'
import { Meta } from '@/types'
import { usePlanosPage } from './usePlanosPage'
import { SectionCard, NxButton } from '../_shared'
import { LoadingPage } from '@/components/Layout'

export default function AdminPlanosPage() {
  const router = useRouter()
  const { plans, meta, isLoading, page, setPage, confirmDelete, setConfirmDelete, handleDelete } = usePlanosPage()

  const columns: Column<AdminPlan>[] = [
    { key: 'name', header: 'Nome', accessor: 'name' },
    { key: 'price_monthly', header: 'Preço Mensal', accessor: (row) => formatBRL(Number(row.price_monthly)), type: 'price' },
    { key: 'price_yearly',  header: 'Preço Anual',  accessor: (row) => row.price_yearly != null ? formatBRL(Number(row.price_yearly)) : '—', type: 'price' },
    { key: 'max_products',  header: 'Produtos Máx.', accessor: (row) => row.max_products ?? 'Ilimitado' },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => ({ label: row.status === 1 ? 'Ativo' : 'Inativo', color: row.status === 1 ? 'active' : 'inactive' }),
      type: 'badge',
      options: {
        badgeColors: {
          active:   { bg: 'bg-nxs/[0.08]', text: 'text-nxs', border: 'ring-1 ring-nxs/20' },
          inactive: { bg: 'bg-nxi3/[0.08]', text: 'text-nxi3', border: 'ring-1 ring-nxborder' },
        },
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      accessor: 'id',
      type: 'actions',
      options: {
        align: 'right',
        actions: [{ type: 'button', icon: Pencil, variant: 'ghost', onClick: (row) => router.push(`/admin/planos/editar/${row.id}`) }],
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Planos</h1>
          <p className="mt-0.5 text-[13px] text-nxi2">Gerencie os planos de assinatura</p>
        </div>
        <NxButton variant="primary" onClick={() => router.push('/admin/planos/criar')}>
          <Plus className="h-4 w-4" />
          Novo Plano
        </NxButton>
      </div>

      <SectionCard flush>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingPage />
          </div>
        ) : (
          <Table
            columns={columns}
            data={plans}
            meta={meta as Meta}
            onPageChange={setPage}
            emptyState={{ icon: CreditCard, title: 'Nenhum plano encontrado', description: 'Crie um plano para começar.' }}
          />
        )}
      </SectionCard>

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}
        title="Desativar Plano"
        description={`Tem certeza que deseja desativar o plano "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
