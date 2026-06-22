'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isExpired } from '@/lib/utils'
import { useAdminPlanCoupons, useAdminDeletePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import { useToastContext } from '@/contexts/ToastContext'
import type { AdminPlanCoupon } from '@/types/admin'

// ─── domain helpers ──────────────────────────────────────────────────────────

export type DisplayStatus = 'active' | 'inactive' | 'expired'

export type FilterKey = 'all' | 'active' | 'inactive' | 'expired'

export const FILTERS = [
  { key: 'all'      as FilterKey, label: 'Todos' },
  { key: 'active'   as FilterKey, label: 'Ativos' },
  { key: 'inactive' as FilterKey, label: 'Inativos' },
  { key: 'expired'  as FilterKey, label: 'Expirados' },
]

export const COLS = ['Código', 'Desconto', 'Ciclo', 'Duração', 'Usos', 'Expira', 'Planos', 'Status', ''] as const

export const CYCLE_LABEL: Record<string, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
  both: 'Mensal e Anual',
}

export function getStatus(c: AdminPlanCoupon): DisplayStatus {
  if (c.status === 0) return 'inactive'
  if (isExpired(c.expires_at)) return 'expired'
  return 'active'
}

export function durationLabel(c: AdminPlanCoupon): string {
  if (c.duration_type === 'forever') return 'Vitalício'
  if (c.duration_type === 'once') return '1º pagamento'
  return `${c.duration_months} ${c.duration_months === 1 ? 'mês' : 'meses'}`
}

/**
 * Formata data com mês abreviado e fuso UTC.
 * Ex: "02 de jun. de 2026" → "02/jun./2026" (pt-BR, month:'short').
 * Não usa formatDateShort() pois aquela retorna dd/mm/aaaa (month:'2-digit').
 */
export function fmtDateShortMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// ─── page hook ───────────────────────────────────────────────────────────────

export function useAdminPlanCouponsPage() {
  const router = useRouter()
  const { success, error: toastError } = useToastContext()

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [confirmDelete, setConfirmDelete] = useState<AdminPlanCoupon | null>(null)

  const { data, isLoading, isError, refetch } = useAdminPlanCoupons({ page: 1, limit: 200 })
  const deleteMutation = useAdminDeletePlanCoupon()

  const allCoupons = data?.data ?? []

  const stats = useMemo(() => ({
    active:    allCoupons.filter(c => getStatus(c) === 'active').length,
    totalUses: allCoupons.reduce((s, c) => s + (c.used_count ?? 0), 0),
    expired:   allCoupons.filter(c => getStatus(c) === 'expired').length,
  }), [allCoupons])

  const filterCounts = useMemo(() => ({
    all:      allCoupons.length,
    active:   allCoupons.filter(c => getStatus(c) === 'active').length,
    inactive: allCoupons.filter(c => getStatus(c) === 'inactive').length,
    expired:  allCoupons.filter(c => getStatus(c) === 'expired').length,
  }), [allCoupons])

  const coupons = useMemo(() => {
    let list = [...allCoupons]
    if (search.trim()) {
      const q = search.trim().toUpperCase()
      list = list.filter(c => c.code.includes(q) || (c.description ?? '').toUpperCase().includes(q))
    }
    if (activeFilter !== 'all') list = list.filter(c => getStatus(c) === activeFilter)
    return list
  }, [allCoupons, search, activeFilter])

  const hasFilter = !!search.trim() || activeFilter !== 'all'

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return
    try {
      await deleteMutation.mutateAsync(confirmDelete.id)
      success('Cupom desativado')
      setConfirmDelete(null)
    } catch {
      toastError('Erro ao desativar cupom')
    }
  }, [confirmDelete, deleteMutation, success, toastError])

  const goToCreate = useCallback(() => router.push('/admin/cupons-plano/criar'), [router])
  const goToEdit   = useCallback((id: number) => router.push(`/admin/cupons-plano/editar/${id}`), [router])

  return {
    // state
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    confirmDelete,
    setConfirmDelete,
    // data
    isLoading,
    isError,
    refetch,
    coupons,
    stats,
    filterCounts,
    hasFilter,
    // handlers
    handleDelete,
    goToCreate,
    goToEdit,
    isDeleting: deleteMutation.isPending,
  }
}
