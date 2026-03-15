import { useState } from 'react'
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions'

export function useAssinaturasPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useAdminSubscriptions({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Ativa', color: 'active' },
    pending: { label: 'Pendente', color: 'pending' },
    expired: { label: 'Expirada', color: 'expired' },
    canceled: { label: 'Cancelada', color: 'canceled' },
  }

  const subs = data?.data ?? []
  const meta = data?.meta ?? null

  return { subs, meta, isLoading, page, setPage, search, setSearch, statusFilter, setStatusFilter, statusMap }
}
