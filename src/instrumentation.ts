// Hook nativo do Next.js (habilitado via `experimental.instrumentationHook` em
// next.config.js) chamado uma vez quando o servidor sobe. É o único ponto de entrada
// suportado pelo Next 14 para inicializar o Sentry nos runtimes server/edge — os
// arquivos sentry.server.config.ts e sentry.edge.config.ts, sozinhos, não são
// carregados automaticamente pelo SDK nessa versão.
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

// Reporta ao Sentry erros de renderização vindos de Server Components/rotas aninhadas
// que não passam pelos error.tsx locais nem pelo global-error.tsx.
export const onRequestError = Sentry.captureRequestError
