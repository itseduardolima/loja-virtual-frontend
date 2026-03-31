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
  } catch (error) {
    // Fallback para localhost:3000 se houver erro ao parsear
    return {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
    }
  }
}

const apiConfig = parseApiUrl(apiUrl)

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: `${apiUrl}/files/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Configuração dinâmica para a API (funciona com localhost ou ngrok)
      // O hostname será extraído automaticamente do NEXT_PUBLIC_API_URL
      {
        protocol: apiConfig.protocol === 'https' ? 'https' : 'http',
        hostname: apiConfig.hostname,
        port: apiConfig.port,
        pathname: '/**',
      },
    ],
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

module.exports = nextConfig
