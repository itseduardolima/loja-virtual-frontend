import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { buildImageUrl, buildImageUrls } from './imageUtils'

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(parseFloat(price.toString()))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  return value
}

export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 14) {
    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }
  return value
}

export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{5})(\d)/, "$1-$2")
  }
  return value
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 10) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")
  } else if (numbers.length <= 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
  }
  return value
}

export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value
  if (isNaN(numValue)) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

export function formatNumber(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value
  if (isNaN(numValue)) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)
}

export function removeFormatting(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatBillingCycle(cycle: string): string {
  const cycles: { [key: string]: string } = {
    monthly: 'Mensal',
    yearly: 'Anual'
  }
  return cycles[cycle] || cycle
}

/** Formata um número como moeda BRL (ex: 19.9 → "R$ 19,90"). */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Valida email com regex simples (mesma semântica usada em equipe/page.tsx). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

/** Data curta sem hora: dd/mm/aaaa. */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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