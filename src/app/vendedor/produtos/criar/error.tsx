'use client'

import { ErrorState } from '@/components/Layout'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16">
      <ErrorState fullScreen={false} message="Erro ao carregar o formulário de criação de produto" onRetry={reset} />
    </div>
  )
}
