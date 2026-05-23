const IG_PREFIX = 'https://instagram.com/'
const FB_PREFIX = 'https://facebook.com/'
const URL_PATTERN = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am|facebook\.com|fb\.com)\//

export function extractHandle(url: string): string {
  return url.replace(URL_PATTERN, '').replace(/^@/, '').trim()
}

export function toInstagramUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${IG_PREFIX}${h}` : ''
}

export function toFacebookUrl(handle: string): string {
  const h = extractHandle(handle)
  return h ? `${FB_PREFIX}${h}` : ''
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
