'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'

export interface ExportOrdersParams {
  search?: string
  date_from?: string
  date_to?: string
  status?: number
  sort?: string
}

export function useExportOrders() {
  const [isExporting, setIsExporting] = useState(false)
  const { success, error } = useToastContext()

  const exportOrders = async (params: ExportOrdersParams) => {
    setIsExporting(true)
    try {
      const response = await api.get('/orders/export', {
        params,
        responseType: 'blob',
        timeout: 60000,
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const today = new Date().toISOString().slice(0, 10)
      link.setAttribute('download', `pedidos_${today}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      success('Arquivo Excel baixado com sucesso.')
    } catch {
      error('Não foi possível exportar os pedidos.')
    } finally {
      setIsExporting(false)
    }
  }

  return { exportOrders, isExporting }
}
