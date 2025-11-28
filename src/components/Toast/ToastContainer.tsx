"use client"

import { useToastContext } from '@/contexts/ToastContext'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, dismiss } = useToastContext()

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'destructive':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getVariantClass = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'toast-success'
      case 'destructive':
        return 'toast-error'
      case 'warning':
        return 'toast-warning'
      default:
        return 'toast-info'
    }
  }

  return (
    <div 
      className="toast-container"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '420px',
        width: 'auto',
        minWidth: '300px',
        pointerEvents: 'none',
        margin: 0,
        padding: 0
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${getVariantClass(toast.variant || 'default')}`}
          style={{
            pointerEvents: 'auto',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            animation: 'slideInFromRight 0.3s ease-out, fadeIn 0.3s ease-out',
            transition: 'all 0.3s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="toast-content">
            <div className="toast-icon">
              {getIcon(toast.variant || 'default')}
            </div>
            <div className="toast-text">
              {toast.title && (
                <div className="toast-title">
                  {toast.title}
                </div>
              )}
              {toast.description && (
                <div className="toast-description">
                  {toast.description}
                </div>
              )}
            </div>
          </div>
          <button
            className="toast-close"
            onClick={() => dismiss(toast.id)}
            aria-label="Fechar notificação"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
