/**
 * Construção segura de links de redes sociais/website da loja.
 *
 * Defesa em profundidade contra XSS armazenado (issue de segurança F11): o valor
 * salvo pode ser um handle (`minhaloja`) ou uma URL. Nunca renderize esse valor
 * cru em href — um valor como `javascript:...` executaria script no clique.
 * Este helper força o domínio da plataforma (para handles) e só aceita http(s)
 * (para URLs completas), devolvendo `undefined` para qualquer coisa suspeita.
 */

type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube'

const PLATFORM_BASE: Record<SocialPlatform, string> = {
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  tiktok: 'https://tiktok.com/@',
  youtube: 'https://youtube.com/@',
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function extractUsername(value: string): string {
  return value
    .replace(/^https?:\/\/(www\.)?[^/]+\//i, '')
    .replace(/^@/, '')
    .replace(/\/$/, '')
    .split('?')[0]
    .split('/')[0]
}

/** Retorna um href seguro para a plataforma, ou undefined se o valor for inválido. */
export function safeSocialHref(
  platform: SocialPlatform,
  value?: string | null,
): string | undefined {
  const raw = (value ?? '').trim()
  if (!raw) return undefined

  // URL completa: só aceita http(s).
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    return isHttpUrl(raw) ? raw : undefined
  }

  // Handle: reconstrói forçando o domínio da plataforma.
  const username = extractUsername(raw)
  if (!/^[A-Za-z0-9._-]+$/.test(username)) return undefined
  return PLATFORM_BASE[platform] + username
}

/** Retorna um href http(s) seguro para o website, ou undefined. */
export function safeWebsiteHref(value?: string | null): string | undefined {
  const raw = (value ?? '').trim()
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw) && isHttpUrl(raw)) return raw
  // Sem esquema: assume https.
  if (!/:/.test(raw) && isHttpUrl(`https://${raw}`)) return `https://${raw}`
  return undefined
}
