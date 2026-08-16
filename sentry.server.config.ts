// Inicialização do Sentry para o runtime Node.js do servidor (Route Handlers, Server
// Components, etc). Importado por src/instrumentation.ts quando NEXT_RUNTIME === 'nodejs'.
// Ver docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Sem DSN configurado, não inicializa o SDK — modo no-op silencioso: nenhuma chamada
// de rede, nenhum warning, build/dev não quebram.
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}
