'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import { type Column } from '@/components/Table/Table'
import { Edit, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface Coupon {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: string
  min_order: string | null
  max_uses: number | null
  used_count: number
  expires_at: string | null
  status: number
  created_at: string
}

function isExpired(expires_at: string | null) {
  if (!expires_at) return false
  return new Date(expires_at) < new Date()
}

function isExhausted(coupon: Coupon) {
  return coupon.max_uses !== null && coupon.used_count >= coupon.max_uses
}

function getCouponStatus(coupon: Coupon): { label: string; color: string } {
  if (coupon.status === 0) return { label: 'Inativo', color: 'inactive' }
  if (isExpired(coupon.expires_at)) return { label: 'Expirado', color: 'expired' }
  if (isExhausted(coupon)) return { label: 'Esgotado', color: 'exhausted' }
  return { label: 'Ativo', color: 'active' }
}

export function useCuponsPage(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options
  const router = useRouter()
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastContext()

  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<{ id: number; code: string } | null>(null)

  const { data: coupons = [], isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await api.get<{ data: Coupon[] }>('/coupons')
      return res.data.data
    },
    enabled,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/coupons/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      success('Cupom excluído com sucesso!', 'Sucesso')
      setDeleteDialogOpen(false)
      setCouponToDelete(null)
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || 'Erro ao excluir cupom', 'Erro')
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: number }) => {
      const res = await api.patch(`/coupons/${id}`, { status })
      return res.data
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      success(status === 1 ? 'Cupom ativado!' : 'Cupom desativado!', 'Status atualizado')
    },
    onError: () => showError('Erro ao atualizar status', 'Erro'),
  })

  const handleEdit = (coupon: Coupon) => {
    router.push(`/vendedor/cupons/editar/${coupon.id}`)
  }

  const handleDeleteClick = (coupon: Coupon) => {
    setCouponToDelete({ id: coupon.id, code: coupon.code })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (couponToDelete) deleteMutation.mutate(couponToDelete.id)
  }

  const handleToggleStatus = (coupon: Coupon) => {
    toggleStatusMutation.mutate({ id: coupon.id, status: coupon.status === 1 ? 0 : 1 })
  }

  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupons
    const q = search.toLowerCase()
    return coupons.filter(c => c.code.toLowerCase().includes(q))
  }, [coupons, search])

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter(c => c.status === 1 && !isExpired(c.expires_at) && !isExhausted(c)).length,
    expired: coupons.filter(c => isExpired(c.expires_at)).length,
    inactive: coupons.filter(c => c.status === 0).length,
  }), [coupons])

  const columns = useMemo<Column<Coupon>[]>(() => [
    {
      key: 'code',
      header: 'Código',
      accessor: 'code',
      type: 'text',
      options: { className: 'font-mono font-bold' },
    },
    {
      key: 'discount',
      header: 'Desconto',
      accessor: (c: Coupon) =>
        c.type === 'percent'
          ? `${parseFloat(c.value)}%`
          : formatPrice(parseFloat(c.value)),
      type: 'text',
    },
    {
      key: 'min_order',
      header: 'Pedido Mínimo',
      accessor: (c: Coupon) =>
        c.min_order ? formatPrice(parseFloat(c.min_order)) : '—',
      type: 'text',
    },
    {
      key: 'uses',
      header: 'Usos',
      accessor: (c: Coupon) =>
        c.max_uses !== null ? `${c.used_count}/${c.max_uses}` : `${c.used_count}`,
      type: 'text',
    },
    {
      key: 'expires_at',
      header: 'Expira em',
      accessor: (c: Coupon) =>
        c.expires_at
          ? new Date(c.expires_at).toLocaleDateString('pt-BR')
          : '—',
      type: 'text',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (c: Coupon) => {
        const s = getCouponStatus(c)
        return { value: s.color, label: s.label, color: s.color }
      },
      type: 'badge',
      options: {
        badgeColors: {
          active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
          inactive: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
          expired: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
          exhausted: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
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
            type: 'switch',
            getChecked: (c: Coupon) => c.status === 1,
            onClick: (c: Coupon) => handleToggleStatus(c),
            getDisabled: () => toggleStatusMutation.isPending,
            className: 'data-[state=checked]:bg-green-500',
          },
          {
            type: 'button',
            icon: Edit,
            variant: 'ghost',
            onClick: (c: Coupon) => handleEdit(c),
            className: 'h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50',
          },
          {
            type: 'button',
            icon: Trash2,
            variant: 'ghost',
            onClick: (c: Coupon) => handleDeleteClick(c),
            getDisabled: () => deleteMutation.isPending,
            className: 'h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50',
          },
        ],
      },
    },
  ], [handleToggleStatus, handleEdit, handleDeleteClick, toggleStatusMutation.isPending, deleteMutation.isPending])

  return {
    coupons: filteredCoupons,
    isLoading,
    error,
    stats,
    search,
    setSearch,
    columns,
    deleteDialogOpen,
    setDeleteDialogOpen,
    couponToDelete,
    handleDeleteConfirm,
    isDeleting: deleteMutation.isPending,
  }
}
