'use client'

import { RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { Table, Column, ConfirmDialog } from '@/components'
import { AdminRefund } from '@/types/admin'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SearchInput } from '@/components/ui/search-input'
import { useEstornosPage } from './useEstornosPage'
import { SectionCard } from '../_shared'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function AdminEstornosPage() {
  const {
    refunds, meta, isLoading,
    page, setPage,
    search, setSearch,
    confirmAction, setConfirmAction,
    handleAction,
    methodMap,
  } = useEstornosPage()

  const columns: Column<AdminRefund>[] = [
    { key: 'user',   header: 'Usuário', accessor: (row) => row.subscription?.user?.name ?? '-' },
    { key: 'email',  header: 'Email',   accessor: (row) => row.subscription?.user?.email ?? '-' },
    { key: 'plan',   header: 'Plano',   accessor: (row) => row.subscription?.plan?.name ?? '-' },
    {
      key: 'amount',
      header: 'Valor',
      accessor: (row) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(row.amount)),
      type: 'price',
    },
    { key: 'method', header: 'Método', accessor: (row) => methodMap[row.payment_method] ?? row.payment_method },
    {
      key: 'date',
      header: 'Data',
      accessor: (row) => row.updated_at ? format(new Date(row.updated_at), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      type: 'date',
    },
    {
      key: 'actions',
      header: 'Ações',
      accessor: 'id',
      type: 'actions',
      options: {
        align: 'right',
        actions: [
          {
            type: 'button',
            icon: CheckCircle,
            variant: 'ghost',
            className: 'h-8 w-8 p-0 text-nxs hover:text-nxs/80',
            onClick: (row) => setConfirmAction({ refund: row, action: 'approve' }),
          },
          {
            type: 'button',
            icon: XCircle,
            variant: 'ghost',
            className: 'h-8 w-8 p-0 text-nxd hover:text-nxd/80',
            onClick: (row) => setConfirmAction({ refund: row, action: 'reject' }),
          },
        ],
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Estornos</h1>
        <p className="mt-0.5 text-[13px] text-nxi2">Pedidos de estorno aguardando revisão</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          onClear={() => { setSearch(''); setPage(1) }}
          placeholder="Buscar por usuário…"
          className="w-full sm:max-w-xs bg-white h-12 rounded-xl"
        />
      </div>

      <SectionCard flush>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingPage />
          </div>
        ) : (
          <Table
            columns={columns}
            data={refunds}
            meta={meta as any}
            onPageChange={setPage}
            emptyState={{ icon: RotateCcw, title: 'Nenhum estorno encontrado', description: 'Não há pedidos de estorno no momento.' }}
          />
        )}
      </SectionCard>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
        title={confirmAction?.action === 'approve' ? 'Aprovar Estorno' : 'Rejeitar Estorno'}
        description={confirmAction?.action === 'approve'
          ? `Confirma a aprovação do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`
          : `Confirma a rejeição do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`}
        onConfirm={handleAction}
        variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'}
      />
    </div>
  )
}
