import type DOMPurifyType from 'dompurify'

const ALLOWED_TAGS = [
  'b', 'i', 'u', 'strong', 'em', 's',
  'ul', 'ol', 'li',
  'br', 'p',
  'h1', 'h2', 'h3', 'h4',
  'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a',
]

const ALLOWED_ATTR = ['href', 'target', 'rel']

let _purify: typeof DOMPurifyType | null = null

function getPurify(): typeof DOMPurifyType | null {
  if (typeof window === 'undefined') return null
  if (!_purify) {
    _purify = require('dompurify') as typeof DOMPurifyType
  }
  return _purify
}

/**
 * Sanitiza HTML usando DOMPurify no cliente.
 * No servidor (SSR), retorna o HTML sem alteração — o backend já sanitiza via sanitize-html no DTO ao salvar.
 * Mantém formatação visual (negrito, listas, títulos, links seguros).
 */
export function sanitizeHtml(html: string): string {
  const DOMPurify = getPurify()
  if (!DOMPurify) return html
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: true,
  })
}
