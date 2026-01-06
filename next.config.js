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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: apiConfig.protocol,
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
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      }
    }
    return config
  },
}

module.exports = nextConfig
