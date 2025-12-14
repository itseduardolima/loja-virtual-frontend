/**
 * Placeholder padrão em formato SVG (data URI)
 */
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='

/**
 * Constrói a URL completa da imagem concatenando o domínio da API com o caminho
 * @param imagePath - Caminho da imagem retornado pela API (ex: "/minha-loja-de-roupas/products/image.png")
 * @returns URL completa da imagem ou placeholder padrão
 */
export function buildImageUrl(imagePath: string): string {
  if (!imagePath) return PLACEHOLDER_IMAGE
  
  // Se for uma URL do via.placeholder.com, retorna placeholder padrão
  if (imagePath.includes('via.placeholder.com')) {
    return PLACEHOLDER_IMAGE
  }
  
  // Se já é uma URL completa, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Remove barra inicial se existir para evitar dupla barra
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  // Constrói a URL completa
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return `${apiUrl}/${cleanPath}`
}

/**
 * Constrói URLs para múltiplas imagens
 * @param imagePaths - Array de caminhos de imagens
 * @returns Array de URLs completas
 */
export function buildImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(buildImageUrl)
}
