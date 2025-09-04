/**
 * Constrói a URL completa da imagem concatenando o domínio da API com o caminho
 * @param imagePath - Caminho da imagem retornado pela API (ex: "/minha-loja-de-roupas/products/image.png")
 * @returns URL completa da imagem
 */
export function buildImageUrl(imagePath: string): string {
  if (!imagePath) return ''
  
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
