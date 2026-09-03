// Espelha as regras de src/files/files.service.ts (allowedMimeTypes + maxFileSize) no
// backend — mesmo conjunto de tipos aceitos e mesma mensagem de erro, para o usuário
// ver o problema na hora de escolher o arquivo, em vez de só depois do upload falhar.
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]

export const ACCEPTED_IMAGE_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(',')

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export const INVALID_IMAGE_TYPE_MESSAGE =
  'Tipo de arquivo não permitido. Apenas imagens JPEG, PNG e WebP são aceitas.'

export const IMAGE_TOO_LARGE_MESSAGE = 'Arquivo muito grande. Tamanho máximo permitido é 5MB.'

/** Valida um arquivo de imagem. Retorna a mensagem de erro, ou null se válido. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return INVALID_IMAGE_TYPE_MESSAGE
  if (file.size > MAX_IMAGE_SIZE_BYTES) return IMAGE_TOO_LARGE_MESSAGE
  return null
}

/** Separa uma lista de arquivos entre válidos e as mensagens de erro dos rejeitados. */
export function partitionValidImageFiles(files: File[]): { valid: File[]; errors: string[] } {
  const valid: File[] = []
  const errors: string[] = []
  for (const file of files) {
    const error = validateImageFile(file)
    if (error) errors.push(`${file.name}: ${error}`)
    else valid.push(file)
  }
  return { valid, errors }
}
