'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Plus, Ticket, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, type Column } from '@/components/Table/Table'
import { ConfirmDialog } from '@/components'
import { useToastContext } from '@/contexts/ToastContext'
import { useAdminPlanCoupons, useAdminDeletePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import type { AdminPlanCoupon } from '@/types/admin'

const CYCLE_LABEL: Record<string, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
  both: 'Ambos',
}

const DURATION_LABEL = (c: AdminPlanCoupon): string => {
  if (c.duration_type === 'forever') return 'Vitalício'
  if (c.duration_type === 'once') return '1º pagamento'
  return `${c.duration_months} meses`
}

const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export default function AdminPlanCouponsPage() {
  const router = useRouter()
  const { success, error } = useToastContext()
  const [page, setPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState<AdminPlanCoupon | null>(null)

  const { data, isLoading } = useAdminPlanCoupons({ page, limit: 20 })
  const deleteMutation = useAdminDeletePlanCoupon()

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteMutation.mutateAsync(confirmDelete.id)
      success('Cupom desativado')
      setConfirmDelete(null)
    } catch {
      error('Erro ao desativar cupom')
    }
  }

  const columns: Column<AdminPlanCoupon>[] = [
    { key: 'code', header: 'Código', accessor: 'code', options: { className: 'font-mono font-bold' } },
    {
      key: 'discount',
      header: 'Desconto',
      accessor: (c) =>
        c.discount_type === 'percent'
          ? `${Number(c.discount_value)}%`
          : formatBRL(Number(c.discount_value)),
    },
    {
      key: 'cycle',
      header: 'Ciclo',
      accessor: (c) => CYCLE_LABEL[c.applies_to_cycle] ?? c.applies_to_cycle,
    },
    {
      key: 'duration',
      header: 'Duração',
      accessor: (c) => DURATION_LABEL(c),
    },
    {
      key: 'uses',
      header: 'Usos',
      accessor: (c) => (c.max_uses != null ? `${c.used_count}/${c.max_uses}` : `${c.used_count}`),
    },
    {
      key: 'plans',
      header: 'Planos',
      accessor: (c) => (c.plans.length === 0 ? 'Todos' : c.plans.map((p) => p.plan.name).join(', ')),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (c) => ({
        label: c.status === 1 ? 'Ativo' : 'Inativo',
        color: c.status === 1 ? 'active' : 'inactive',
      }),
      type: 'badge',
      options: {
        badgeColors: {
          active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
          inactive: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
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
        actions: [
          {
            type: 'button',
            icon: Pencil,
            variant: 'ghost',
            onClick: (c) => router.push(`/admin/cupons-plano/editar/${c.id}`),
          },
          {
            type: 'button',
            icon: Trash2,
            variant: 'ghost',
            onClick: (c) => setConfirmDelete(c),
            className: 'text-red-600 hover:bg-red-50 hover:text-red-700',
          },
        ],
      },
    },
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cupons de Planos</h1>
          <p className="text-gray-500 text-sm mt-1">Crie cupons de desconto para assinaturas</p>
        </div>
        <Button onClick={() => router.push('/admin/cupons-plano/criar')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={data?.data ?? []}
          meta={data?.meta as any}
          onPageChange={setPage}
          emptyState={{
            icon: Ticket,
            title: 'Nenhum cupom encontrado',
            description: 'Crie um cupom para aplicar desconto em assinaturas.',
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Desativar cupom"
        description={`Tem certeza que deseja desativar o cupom "${confirmDelete?.code}"?`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
