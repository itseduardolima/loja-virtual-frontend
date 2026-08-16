const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Extrai hostname, porta e protocolo da URL da API
const parseApiUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return {
      protocol: urlObj.protocol.replace(':', ''),
      hostname: urlObj.hostname,
      port: urlObj.port || '',
    }
  } catch {
    return { protocol: 'http', hostname: 'localhost', port: '3000' }
  }
}

const apiConfig = parseApiUrl(apiUrl)

const r2Hostname = process.env.NEXT_PUBLIC_R2_HOSTNAME || ''

// Origem HTTP da API (para img-src/connect-src) e sua contraparte WS (usada pelo socket.io)
const apiOrigin = `${apiConfig.protocol}://${apiConfig.hostname}${apiConfig.port ? `:${apiConfig.port}` : ''}`
const apiWsOrigin = `${apiConfig.protocol === 'https' ? 'wss' : 'ws'}://${apiConfig.hostname}${apiConfig.port ? `:${apiConfig.port}` : ''}`

// CSP em modo Report-Only: o Next injeta estilos/scripts inline (e styled-components
// também), então 'unsafe-inline' é necessário para não quebrar a renderização.
// Report-Only só reporta violações (via reportingEndpoint do browser/devtools) sem
// bloquear nada — serve para observar antes de eventualmente migrar para enforced.
const buildContentSecurityPolicy = () => {
  const imgSrc = [
    "'self'",
    'data:',
    'blob:',
    'https://picsum.photos',
    'https://images.unsplash.com',
    'https://*.r2.dev',
    apiOrigin,
    ...(r2Hostname ? [`https://${r2Hostname}`] : []),
  ]
  const connectSrc = ["'self'", apiOrigin, apiWsOrigin]

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${imgSrc.join(' ')}`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc.join(' ')}`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ]

  return directives.join('; ')
}

const nextConfig = {
  // Necessário no Next 14 (estável a partir do Next 15) para que src/instrumentation.ts
  // seja carregado e inicialize o Sentry no runtime server/edge.
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: apiConfig.protocol === 'https' ? 'https' : 'http',
        hostname: apiConfig.hostname,
        port: apiConfig.port,
        pathname: '/**',
      },
      ...(r2Hostname ? [{
        protocol: 'https',
        hostname: r2Hostname,
        port: '',
        pathname: '/**',
      }] : []),
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 2 anos, aplica a subdomínios. Sem "preload" (submissão à lista do Chrome é
          // uma decisão à parte, fora do escopo deste ajuste).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy-Report-Only', value: buildContentSecurityPolicy() },
        ],
      },
    ]
  },
  // Previne loops infinitos de recompilação
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 500,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/dist/**',
          '**/build/**',
        ],
      }
    }
    return config
  },
}

// withSentryConfig envolve o next.config para habilitar a captura automática de erros
// server/edge (via src/instrumentation.ts) e, quando SENTRY_AUTH_TOKEN estiver setado,
// o upload de sourcemaps. Sem SENTRY_AUTH_TOKEN (dev local, PRs sem credenciais), o
// upload de sourcemaps fica desabilitado e o build não tenta nenhuma chamada de rede.
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  telemetry: false,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
})
