'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

// Só é acionado quando um erro escapa do próprio root layout (src/app/layout.tsx) —
// caso raro e catastrófico. Por isso precisa renderizar <html>/<body> própria e não
// pode depender de providers/CSS do layout raiz. É complementar aos error.tsx locais
// de cada rota (que tratam erros "normais" dentro do layout e hoje descartam o erro
// sem reportar); aqui reportamos ao Sentry antes de mostrar o fallback.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          margin: 0,
          padding: '1.5rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fafafa',
          color: '#111827',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Algo deu errado</h1>
        <p style={{ color: '#6b7280', maxWidth: '28rem', margin: 0 }}>
          Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada. Tente novamente
          ou recarregue a página.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #111827',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#111827',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Recarregar página
          </button>
        </div>
      </body>
    </html>
  )
}
