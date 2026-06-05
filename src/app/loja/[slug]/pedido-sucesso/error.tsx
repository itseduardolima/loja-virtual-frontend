'use client'

import { ErrorState } from '@/components/Layout'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState message="Erro ao carregar a confirmação do pedido" onRetry={reset} />
}
