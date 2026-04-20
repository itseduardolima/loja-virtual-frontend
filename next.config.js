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

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
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
