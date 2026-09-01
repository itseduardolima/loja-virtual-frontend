import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { buildImageUrl, buildImageUrls } from './imageUtils'

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parseFloat(price.toString()))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return value
}

export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 14) {
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return value
}

export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{5})(\d)/, '$1-$2')
  }
  return value
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  } else if (numbers.length <= 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  return value
}

export function formatCurrency(value: string | number): string {
  const numValue =
    typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value
  if (isNaN(numValue)) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}

export function formatNumber(value: string | number): string {
  const numValue =
    typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value
  if (isNaN(numValue)) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

export function removeFormatting(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatBillingCycle(cycle: string): string {
  const cycles: { [key: string]: string } = {
    monthly: 'Mensal',
    yearly: 'Anual',
  }
  return cycles[cycle] || cycle
}

/**
 * Resolve a imagem de um item do carrinho. O backend declara `images: string[]`,
 * mas produtos com variação de cor entregam um mapa `Record<cor, string[]>` —
 * tratar os dois formatos (prioriza a cor escolhida no item).
 */
export function getCartItemImage(item: {
  color?: string | null
  product: { images: unknown }
}): string | null {
  const images = item.product.images
  if (Array.isArray(images) && images.length > 0) return images[0] as string
  if (images && typeof images === 'object' && !Array.isArray(images)) {
    const byColor = images as Record<string, string[]>
    const forColor = item.color ? byColor[item.color] : null
    if (Array.isArray(forColor) && forColor.length > 0) return forColor[0]
    const first = Object.values(byColor)[0]
    if (first?.length) return first[0]
  }
  return null
}

/** Formata um número como moeda BRL (ex: 19.9 → "R$ 19,90"). */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Dias até a data fornecida (negativo se já passou). */
export function daysUntil(date: string | Date): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

/** Retorna true se a data fornecida já passou. */
export function isExpired(date: string | Date | null | undefined): boolean {
  if (!date) return false
  return daysUntil(date) <= 0
}

/** Data curta sem hora: dd/mm/aaaa. Passa `{ utc: true }` para forçar fuso UTC. */
export function formatDateShort(date: string | Date, options?: { utc?: boolean }): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(options?.utc ? { timeZone: 'UTC' } : {}),
  })
}

/** Data longa com mês por extenso, fuso UTC (ex: "02 de junho de 2026"). */
export function formatDateLong(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
