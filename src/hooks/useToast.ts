import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ 
    title, 
    description, 
    variant = 'default', 
    duration = 5000 
  }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    
    setToasts((prev) => [...prev, { id, title, description, variant, duration }])
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
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

  return {
    toasts,
    toast,
    dismiss,
    success,
    error,
    warning
  }
}
