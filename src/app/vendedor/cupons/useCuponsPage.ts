'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'

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

export type CouponFilter = 'all' | 'active' | 'paused' | 'expired'

export function isExpired(expires_at: string | null) {
  if (!expires_at) return false
  return new Date(expires_at) < new Date()
}

export function isExhausted(coupon: Coupon) {
  return coupon.max_uses !== null && coupon.used_count >= coupon.max_uses
}

export function useCuponsPage(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options
  const router = useRouter()
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastContext()

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<CouponFilter>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<{ id: number; code: string } | null>(null)

  const { data: allCoupons = [], isLoading, error } = useQuery({
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
      success(status === 1 ? 'Cupom ativado!' : 'Cupom pausado!', 'Status atualizado')
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

  const stats = useMemo(() => ({
    active: allCoupons.filter(c => c.status === 1 && !isExpired(c.expires_at) && !isExhausted(c)).length,
    totalUses: allCoupons.reduce((sum, c) => sum + c.used_count, 0),
    expired: allCoupons.filter(c => isExpired(c.expires_at)).length,
    paused: allCoupons.filter(c => c.status === 0).length,
    total: allCoupons.length,
  }), [allCoupons])

  const coupons = useMemo(() => {
    let list = allCoupons

    if (activeFilter === 'active') {
      list = list.filter(c => c.status === 1 && !isExpired(c.expires_at) && !isExhausted(c))
    } else if (activeFilter === 'paused') {
      list = list.filter(c => c.status === 0)
    } else if (activeFilter === 'expired') {
      list = list.filter(c => isExpired(c.expires_at))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c => c.code.toLowerCase().includes(q))
    }

    return list
  }, [allCoupons, activeFilter, search])

  return {
    coupons,
    isLoading,
    error,
    stats,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    deleteDialogOpen,
    setDeleteDialogOpen,
    couponToDelete,
    handleDeleteConfirm,
    isDeleting: deleteMutation.isPending,
    handleEdit,
    handleDeleteClick,
    handleToggleStatus,
    toggleStatusMutation,
  }
}
