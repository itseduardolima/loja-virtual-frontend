"use client"

import { useToastContext } from '@/contexts/ToastContext'
import { Toast } from '@/contexts/ToastContext'
import { CheckCircle, XCircle, AlertTriangle, Info, X, AlertOctagon } from 'lucide-react'

function StoreToastIcon({ variant }: { variant: string }) {
  switch (variant) {
    case 'success':
      return <CheckCircle size={17} />
    case 'warning':
      return <AlertTriangle size={17} strokeWidth={2.2} />
    case 'destructive':
      return <AlertOctagon size={17} strokeWidth={2.2} />
    default:
      return <Info size={17} strokeWidth={2.2} />
  }
}

const STORE_TONE: Record<string, string> = {
  success: 'text-nxs bg-nxs/10',
  destructive: 'text-nxd bg-nxd/10',
  warning: 'text-nxw bg-nxw/10',
  default: 'text-store bg-store/10',
}

function StoreToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const tone = STORE_TONE[toast.variant || 'default']

  return (
    <div
      className="pointer-events-auto relative w-[320px] max-w-[calc(100vw-32px)] rounded-[20px] border border-nxborder bg-white p-[18px] shadow-[0_20px_50px_-20px_rgba(7,8,21,0.35)] animate-[store-toast-in_.22s_cubic-bezier(.22,1,.36,1)]"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full ${tone}`}>
          <StoreToastIcon variant={toast.variant || 'default'} />
        </span>
        <div className="min-w-0 flex-1 pr-4">
          {toast.title && <div className="text-[14px] font-extrabold text-nxi1">{toast.title}</div>}
          {toast.description && (
            <div className="mt-[3px] text-[13px] leading-[1.45] text-nxi2">{toast.description}</div>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="absolute right-[14px] top-[14px] flex h-6 w-6 items-center justify-center rounded-full text-nxi3 transition-colors hover:bg-nxbg hover:text-nxi1"
      >
        <X size={14} strokeWidth={2.4} />
      </button>
    </div>
  )
}

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
      {toasts.map((toast) =>
        toast.context === 'store' ? (
          <StoreToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ) : (
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
        )
      )}
    </div>
  )
}
