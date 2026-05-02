import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type BlingImportType = 'products' | 'orders'
export type BlingImportStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'error'
  | 'cancelled'

export interface BlingImportError {
  blingId?: number
  message: string
}

export interface BlingImportJob {
  id: number
  type: BlingImportType
  status: BlingImportStatus
  total: number
  processed: number
  errorsCount: number
  dateFrom: string | null
  dateTo: string | null
  startedAt: string | null
  finishedAt: string | null
  errors: BlingImportError[]
  createdAt: string
}

export function useBlingImports(type?: BlingImportType, enabled = true) {
  return useQuery({
    queryKey: ['bling-imports', type ?? 'all'],
    queryFn: async (): Promise<BlingImportJob[]> => {
      const res = await api.get<BlingImportJob[]>('/integrations/bling/import', {
        params: type ? { type } : undefined,
      })
      return res.data
    },
    enabled,
    staleTime: 10_000,
  })
}

export function useBlingImportJob(jobId: number | null, enabled = true) {
  return useQuery({
    queryKey: ['bling-import', jobId],
    queryFn: async (): Promise<BlingImportJob> => {
      const res = await api.get<BlingImportJob>(`/integrations/bling/import/${jobId}`)
      return res.data
    },
    enabled: enabled && jobId !== null,
    refetchInterval: (query) => {
      const data = query.state.data as BlingImportJob | undefined
      if (!data) return 2000
      return data.status === 'running' || data.status === 'pending' ? 2000 : false
    },
  })
}

export function useBlingProductsImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<{ jobId: number }> => {
      const res = await api.post<{ jobId: number }>(
        '/integrations/bling/import/products',
      )
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bling-imports'] })
    },
  })
}

export function useBlingOrdersImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (opts: { dateFrom?: string; dateTo?: string }): Promise<{ jobId: number }> => {
      const res = await api.post<{ jobId: number }>(
        '/integrations/bling/import/orders',
        opts,
      )
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bling-imports'] })
    },
  })
}
