'use client'

import { useMemo, useState, useCallback } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { formatPrice } from '@/lib/utils'

const today = new Date().toISOString().slice(0, 10)

export function useDashboardPage() {
  const [dateRange, setDateRange] = useState<{ dateFrom: string; dateTo: string } | null>({ dateFrom: today, dateTo: today })
  const [inputFrom, setInputFrom] = useState(today)
  const [inputTo, setInputTo] = useState(today)

  const dateFilter = useMemo(() => {
    if (!dateRange) return undefined
    const { dateFrom, dateTo } = dateRange
    if (!dateFrom || !dateTo) return undefined
    return { dateFrom, dateTo }
  }, [dateRange])

  const {
    summary,
    recentOrders,
    topProducts,
    isLoading,
    isError,
  } = useDashboard(dateFilter)

  const applyFilter = useCallback(() => {
    if (inputFrom && inputTo && inputFrom <= inputTo) {
      setDateRange({ dateFrom: inputFrom, dateTo: inputTo })
    }
  }, [inputFrom, inputTo])

  const clearFilter = useCallback(() => {
    setDateRange(null)
    setInputFrom('')
    setInputTo('')
  }, [])

  const onRangeSelect = useCallback((range: { dateFrom: string; dateTo: string } | null) => {
    if (!range) {
      setDateRange(null)
      setInputFrom('')
      setInputTo('')
      return
    }
    setDateRange(range)
    setInputFrom(range.dateFrom)
    setInputTo(range.dateTo)
  }, [])

  const setQuickRange = useCallback((days: number) => {
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - days)
    const from = start.toISOString().slice(0, 10)
    const to = end.toISOString().slice(0, 10)
    setInputFrom(from)
    setInputTo(to)
    setDateRange({ dateFrom: from, dateTo: to })
  }, [])

  const updateDateFrom = useCallback((value: string) => {
    if (dateRange) {
      setDateRange((r) => (r ? { ...r, dateFrom: value } : null))
    } else {
      setInputFrom(value)
    }
  }, [dateRange])

  const updateDateTo = useCallback((value: string) => {
    if (dateRange) {
      setDateRange((r) => (r ? { ...r, dateTo: value } : null))
    } else {
      setInputTo(value)
    }
  }, [dateRange])

  const revenueValue = useMemo(() => {
    return formatPrice(summary?.today?.revenue || 0)
  }, [summary?.today?.revenue])

  return {
    // Dados
    summary,
    recentOrders,
    topProducts,
    // Estado de loading/erro
    isLoading,
    isError,
    // Filtro de período
    dateFilter,
    dateFromInput: dateRange?.dateFrom ?? inputFrom,
    dateToInput: dateRange?.dateTo ?? inputTo,
    updateDateFrom,
    updateDateTo,
    applyFilter,
    clearFilter,
    onRangeSelect,
    setQuickRange,
    hasDateFilter: !!dateRange,
    isViewingToday: dateRange?.dateFrom === today && dateRange?.dateTo === today,
    // Valores derivados para os cards
    revenueValue,
  }
}
