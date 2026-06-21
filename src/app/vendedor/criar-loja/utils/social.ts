const IG_PREFIX = 'https://instagram.com/'
const FB_PREFIX = 'https://facebook.com/'
const TIKTOK_PREFIX = 'https://tiktok.com/@'
const YOUTUBE_PREFIX = 'https://youtube.com/@'

// Domínios que removemos para extrair o handle (qualquer rede suportada)
const DOMAIN_PATTERN = /^(instagram\.com|instagr\.am|facebook\.com|fb\.com|tiktok\.com|youtube\.com|youtu\.be|m\.facebook\.com)\//i

// Handle válido: letras, números, ponto, underscore e hífen (cobre IG/FB/TikTok/YouTube)
const HANDLE_PATTERN = /^[a-zA-Z0-9._-]{1,80}$/

/**
 * Extrai o "@handle" de uma URL ou texto colado, de forma resiliente:
 * remove protocolo, www, domínio, @ inicial, query/hash, barra final e
 * segmentos de path extras. Ex.: "https://www.instagram.com/Loja/?igsh=x" → "Loja"
 */
export function extractHandle(url: string): string {
  if (!url) return ''
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(DOMAIN_PATTERN, '')
    .replace(/[?#].*$/, '') // remove query string / hash
    .replace(/\/.*$/, '') // mantém só o primeiro segmento do path
    .replace(/^@/, '') // remove @ inicial
    .trim()
}

/** Valida se o handle (já extraído) tem um formato aceitável. Vazio é válido (campo opcional). */
export function isValidHandle(handle: string): boolean {
  const h = extractHandle(handle)
  return h === '' || HANDLE_PATTERN.test(h)
}

export function toInstagramUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${IG_PREFIX}${h}` : ''
}

export function toFacebookUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${FB_PREFIX}${h}` : ''
}

export function toTiktokUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${TIKTOK_PREFIX}${h}` : ''
}

export function toYoutubeUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${YOUTUBE_PREFIX}${h}` : ''
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
}
