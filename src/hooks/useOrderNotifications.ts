'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { api } from '@/lib/axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const QUERY_KEY = ['notifications']

export interface OrderNotification {
  id: string
  orderId: number | null
  orderCode: string | null
  customerName: string | null
  total: number
  read: boolean
  timestamp: Date
}

async function fetchNotifications(): Promise<OrderNotification[]> {
  const res = await api.get<OrderNotification[]>('/notifications')
  return res.data.map((n) => ({ ...n, timestamp: new Date(n.timestamp) }))
}

export function useOrderNotifications(enabled: boolean) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)

  const { data: notifications = [] } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchNotifications,
    enabled,
    staleTime: 1000 * 60, // 1 min
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const prev = queryClient.getQueryData<OrderNotification[]>(QUERY_KEY)
      queryClient.setQueryData<OrderNotification[]>(QUERY_KEY, (old = []) =>
        old.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev)
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const prev = queryClient.getQueryData<OrderNotification[]>(QUERY_KEY)
      queryClient.setQueryData<OrderNotification[]>(QUERY_KEY, (old = []) =>
        old.map((n) => ({ ...n, read: true })),
      )
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev)
    },
  })

  const dismissMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notifications/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const prev = queryClient.getQueryData<OrderNotification[]>(QUERY_KEY)
      queryClient.setQueryData<OrderNotification[]>(QUERY_KEY, (old = []) =>
        old.filter((n) => n.id !== id),
      )
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev)
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: () => api.delete('/notifications/clear-all'),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const prev = queryClient.getQueryData<OrderNotification[]>(QUERY_KEY)
      queryClient.setQueryData<OrderNotification[]>(QUERY_KEY, [])
      return { prev }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev)
    },
  })

  const markAsRead = (id: string) => markAsReadMutation.mutate(id)
  const markAllAsRead = () => markAllAsReadMutation.mutate()
  const dismiss = (id: string) => dismissMutation.mutate(id)
  const clearAll = () => clearAllMutation.mutate()

  // WebSocket: quando chega novo pedido, invalida a query para buscar do banco
  useEffect(() => {
    if (!enabled) return

    const socket = io(API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('new_order', () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    })

    socket.on('cancellation_request', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [enabled, queryClient])

  return { notifications, unreadCount, markAsRead, markAllAsRead, dismiss, clearAll }
}
