"use client"

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
  context?: 'store'
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    duration,
    context,
  }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const resolvedDuration = duration ?? (variant === 'destructive' ? 6500 : 5000)

    setToasts((prev) => [...prev, { id, title, description, variant, duration: resolvedDuration, context }])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, resolvedDuration)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string, title?: string) => {
    toast({ title, description: message, variant: 'success' })
  }, [toast])

  const error = useCallback((message: string, title?: string) => {
    toast({ title, description: message, variant: 'destructive' })
  }, [toast])

  const warning = useCallback((message: string, title?: string) => {
    toast({ title, description: message, variant: 'warning' })
  }, [toast])

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}
