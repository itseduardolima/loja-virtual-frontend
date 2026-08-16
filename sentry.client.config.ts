// Inicialização do Sentry para o runtime do browser.
// Carregado automaticamente pelo SDK (via injeção no bundle de client) — não importar
// manualmente em outro lugar. Ver docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Sem DSN configurado (ex.: dev local sem env var setada), não inicializa o SDK —
// modo no-op silencioso: nenhuma chamada de rede, nenhum warning, build/dev não quebram.
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}
