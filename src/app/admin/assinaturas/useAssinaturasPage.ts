import { useState } from 'react'
import { useAdminSubscriptions, useSyncAdminSubscriptions } from '@/hooks/useAdminSubscriptions'
import { SUBSCRIPTION_STATUS } from '@/lib/vendor'
import toast from 'react-hot-toast'

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

  const syncMutation = useSyncAdminSubscriptions()

  const handleSync = async () => {
    try {
      const result = await syncMutation.mutateAsync()
      const parts: string[] = []
      if (result.migrated_plans > 0) parts.push(`${result.migrated_plans} plano(s) migrado(s)`)
      if (result.expired_subs > 0) parts.push(`${result.expired_subs} assinatura(s) expirada(s)`)
      toast.success(parts.length > 0 ? parts.join(', ') + '.' : 'Tudo já está sincronizado.')
    } catch {
      toast.error('Erro ao sincronizar assinaturas.')
    }
  }

  // SUBSCRIPTION_STATUS.*.tone not used here — page.tsx badge colors are keyed by status string
  const statusMap: Record<string, { label: string; color: string }> = Object.fromEntries(
    Object.entries(SUBSCRIPTION_STATUS).map(([key, { label }]) => [key, { label, color: key }])
  )

  const subs = data?.data ?? []
  const meta = data?.meta ?? null

  return {
    subs,
    meta,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusMap,
    handleSync,
    isSyncing: syncMutation.isPending,
  }
}
