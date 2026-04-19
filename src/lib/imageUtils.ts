const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * Constrói a URL completa da imagem.
 * O backend envia Cross-Origin-Resource-Policy: cross-origin nas rotas /files/*,
 * então podemos usar a URL direta sem proxy.
 */
export function buildImageUrl(imagePath: string): string {
  if (!imagePath) return PLACEHOLDER_IMAGE
  if (imagePath.includes('via.placeholder.com')) return PLACEHOLDER_IMAGE
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${API_URL}${path}`
}

/**
 * Constrói URLs para múltiplas imagens
 * @param imagePaths - Array de caminhos de imagens
 * @returns Array de URLs completas
 */
export function buildImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(buildImageUrl)
}

/**
 * Retorna a primeira URL de imagem de um produto.
 * Suporta dois formatos: array simples ou objeto por cor { "Preto": ["url"] }.
 */
export function getFirstProductImage(images: string[] | Record<string, string[]> | undefined): string | null {
  if (!images) return null
  if (Array.isArray(images)) return images[0] ?? null
  const firstKey = Object.keys(images)[0]
  if (!firstKey) return null
  const arr = images[firstKey]
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null
}
