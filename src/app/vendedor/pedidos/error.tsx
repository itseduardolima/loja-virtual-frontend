'use client'

import { ErrorState } from '@/components/Layout'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16">
      <ErrorState fullScreen={false} message="Erro ao carregar os pedidos" onRetry={reset} />
    </div>
  )
}
