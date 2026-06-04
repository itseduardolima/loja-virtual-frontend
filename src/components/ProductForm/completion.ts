// computeCompletion — espelha computeCompletion de
// /tmp/nexo-design/nexo-criar-produto/project/app.jsx, SEM o item de SEO
// (backend não suporta). 5 itens, na ordem das seções ancoradas.
import type { NicheField, NicheFieldValue } from '@/types'
import type { CreateProductFormData } from '@/schemas'
import type { CompletionItem } from './types'

const isFilled = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== ''

// texto puro do HTML das especificações (sem tags) — replica regex do protótipo
const plainText = (html?: string | null): string =>
  (html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

export function computeCompletion(args: {
  values: Partial<CreateProductFormData>
  selectedNicheId: number | null
  nicheFields: NicheField[]
  dynamicFieldValues: Record<string, NicheFieldValue>
  colors: string[]
  sizes: string[]
  variantStocks: { color: string; size: string; stock: number }[]
  imagesOk: boolean
}): CompletionItem[] {
  const {
    values,
    selectedNicheId,
    nicheFields,
    dynamicFieldValues,
    colors,
    sizes,
    variantStocks,
    imagesOk,
  } = args

  // Informações básicas: nome >= 3 e preço > 0
  const name = values.name || ''
  const basicDone = name.trim().length >= 3 && !!values.price && values.price > 0

  // Tipo e nicho: nicho + categoria + todos os NicheField obrigatórios preenchidos
  const reqDynDone = nicheFields
    .filter((f) => f.required === 1)
    .every((f) => isFilled(dynamicFieldValues[String(f.id)]?.value))
  const nicheDone = !!(selectedNicheId && values.category_id && reqDynDone)

  // Variantes e estoque (opcional): estoque total > 0
  const hasVariants = colors.length > 0 || sizes.length > 0
  const stockTotal = hasVariants
    ? variantStocks.reduce((a, b) => a + (b.stock || 0), 0)
    : values.stock || 0
  const stockDone = stockTotal > 0

  // Especificações (opcional): specifications sem tags, não-vazio
  const specsDone = plainText(values.specifications).length > 0

  return [
    { label: 'Informações básicas', anchor: 'sec-basico', done: basicDone, required: true },
    { label: 'Tipo e nicho', anchor: 'sec-nicho', done: nicheDone, required: true },
    { label: 'Variantes e estoque', anchor: 'sec-estoque', done: stockDone, required: false },
    { label: 'Imagens', anchor: 'sec-imagens', done: imagesOk, required: true },
    { label: 'Especificações', anchor: 'sec-specs', done: specsDone, required: false },
  ]
}
