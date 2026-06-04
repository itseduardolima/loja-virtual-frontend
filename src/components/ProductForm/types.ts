// Tipos compartilhados do fluxo "Criar/Editar Produto" (página única, seções ancoradas)

export type OrderedImage = { type: 'existing'; url: string } | { type: 'new'; file: File }

export interface CompletionItem {
  label: string
  anchor: string
  done: boolean
  required: boolean
}

export interface StorefrontPreviewData {
  name: string
  description?: string
  price?: number
  promoPrice?: number | null
  promoEndsAt?: string | null
  nicheName?: string | null
  categoryName?: string | null
  colors: string[]
  sizes: string[]
  variantStocks: { color: string; size: string; stock: number }[]
  singleStock?: number
  imagesByColor: Record<string, string[]> // srcs prontos para exibir
  simpleImages: string[] // srcs prontos para exibir
  specificationsHtml?: string
  dynSpecs: [string, string][] // [nome do campo, valor] dos campos dinâmicos não-cor/não-tamanho
  slug?: string
}
