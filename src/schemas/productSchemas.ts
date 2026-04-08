import * as yup from 'yup'

const normalizeNumber = (value: any, originalValue: any) => {
  if (originalValue === '' || originalValue === null || Number.isNaN(value)) {
    return undefined
  }
  return value
}

export const createProductSchema = yup.object({
  name: yup
    .string()
    .required('Nome do produto é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .optional()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  price: yup
    .number()
    .transform(normalizeNumber)
    .required('Preço é obrigatório')
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço não pode ser maior que R$ 999.999,99')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()).optional(),
  colors: yup.array().of(yup.string()).optional(),
  color: yup
    .string()
    .optional()
    .max(50, 'Cor deve ter no máximo 50 caracteres'),
  specifications: yup
    .string()
    .optional()
    .max(2000, 'Especificações devem ter no máximo 2000 caracteres'),
  stock: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .min(0, 'Estoque não pode ser negativo')
    .max(999999, 'Estoque não pode ser maior que 999.999')
    .typeError('Estoque deve ser um número válido'),
  discount_price: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .nullable()
    .min(0.01, 'Valor de desconto deve ser maior que zero')
    .max(999999.99, 'Valor de desconto não pode ser maior que R$ 999.999,99')
    .typeError('Valor de desconto deve ser um número válido'),
  category_id: yup
    .number()
    .transform(normalizeNumber)
    .required('Categoria é obrigatória')
    .typeError('Categoria é obrigatória'),
  featured: yup.boolean().optional(),
  save_as_draft: yup.boolean().optional(),
  promo_price: yup.number().transform(normalizeNumber).optional().nullable().min(0.01).max(999999.99)
    .test('less-than-price', 'Preço promocional deve ser menor que o preço original', function (value) {
      if (!value) return true
      const { price } = this.parent
      return !price || value < price
    }),
  promo_starts_at: yup.string().optional().nullable(),
  promo_ends_at: yup.string().optional().nullable()
    .test('after-start', 'Data de fim deve ser após a data de início', function (value) {
      const { promo_starts_at } = this.parent
      if (!value || !promo_starts_at) return true
      return new Date(value) > new Date(promo_starts_at)
    }),
  meta_title: yup.string().optional().max(200),
  meta_description: yup.string().optional().max(500),
  meta_keywords: yup.string().optional().max(300),
  tags: yup.array().of(yup.string()).optional(),
  variant_stocks: yup.array().of(
    yup.object({ color: yup.string().required(), size: yup.string().required(), stock: yup.number().min(0).required() })
  ).optional(),
})

export const updateProductSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  price: yup
    .number()
    .transform(normalizeNumber)
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço não pode ser maior que R$ 999.999,99')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()),
  colors: yup.array().of(yup.string()),
  stock: yup
    .number()
    .transform(normalizeNumber)
    .min(0, 'Estoque não pode ser negativo')
    .max(999999, 'Estoque não pode ser maior que 999.999')
    .typeError('Estoque deve ser um número válido'),
  discount_price: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .nullable()
    .min(0.01, 'Valor de desconto deve ser maior que zero')
    .max(999999.99, 'Valor de desconto não pode ser maior que R$ 999.999,99')
    .typeError('Valor de desconto deve ser um número válido'),
  category_id: yup
    .number()
    .transform(normalizeNumber)
    .required('Categoria é obrigatória')
    .typeError('Categoria é obrigatória'),
  featured: yup.boolean(),
  promo_price: yup.number().transform(normalizeNumber).optional().nullable().min(0.01).max(999999.99)
    .test('less-than-price', 'Preço promocional deve ser menor que o preço original', function (value) {
      if (!value) return true
      const { price } = this.parent
      return !price || value < price
    }),
  promo_starts_at: yup.string().optional().nullable(),
  promo_ends_at: yup.string().optional().nullable()
    .test('after-start', 'Data de fim deve ser após a data de início', function (value) {
      const { promo_starts_at } = this.parent
      if (!value || !promo_starts_at) return true
      return new Date(value) > new Date(promo_starts_at)
    }),
  meta_title: yup.string().optional().max(200),
  meta_description: yup.string().optional().max(500),
  meta_keywords: yup.string().optional().max(300),
  tags: yup.array().of(yup.string()).optional(),
  variant_stocks: yup.array().of(
    yup.object({ color: yup.string().required(), size: yup.string().required(), stock: yup.number().min(0).required() })
  ).optional(),
})

export type CreateProductFormData = yup.InferType<typeof createProductSchema>
export type UpdateProductFormData = yup.InferType<typeof updateProductSchema>

export const SIZE_OPTIONS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
export const COLOR_OPTIONS = [
  // Cores básicas
  'Preto', 'Branco', 'Cinza', 'Bege',
  // Azuis
  'Azul', 'Azul Marinho', 'Azul Claro', 'Azul Escuro', 'Azul Turquesa', 'Azul Céu', 'Azul Royal',
  // Vermelhos
  'Vermelho', 'Vermelho Escuro', 'Vermelho Claro', 'Vinho', 'Bordeaux', 'Coral', 'Salmão',
  // Verdes
  'Verde', 'Verde Escuro', 'Verde Claro', 'Verde Oliva', 'Verde Lima', 'Verde Menta', 'Verde Esmeralda',
  // Amarelos e Laranjas
  'Amarelo', 'Amarelo Claro', 'Amarelo Ouro', 'Laranja', 'Laranja Queimado', 'Pêssego', 'Abricó',
  // Rosas e Roxos
  'Rosa', 'Rosa Claro', 'Rosa Choque', 'Rosa Bebê', 'Roxo', 'Roxo Escuro', 'Lavanda', 'Lilás', 'Magenta',
  // Marrons e Terrosos
  'Marrom', 'Marrom Claro', 'Marrom Escuro', 'Caramelo', 'Café', 'Chocolate', 'Cobre', 'Terracota',
  // Metálicos e Especiais
  'Dourado', 'Prata', 'Bronze', 'Platina',
  // Outras cores
  'Turquesa', 'Ciano', 'Índigo', 'Violeta', 'Púrpura', 'Creme', 'Off White', 'Nude', 'Camel'
]

export function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    // Cores básicas
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Cinza': '#6B7280',
    'Bege': '#F5F5DC',
    // Azuis
    'Azul': '#3B82F6',
    'Azul Marinho': '#1E40AF',
    'Azul Claro': '#93C5FD',
    'Azul Escuro': '#1E3A8A',
    'Azul Turquesa': '#06B6D4',
    'Azul Céu': '#0EA5E9',
    'Azul Royal': '#2563EB',
    // Vermelhos
    'Vermelho': '#EF4444',
    'Vermelho Escuro': '#DC2626',
    'Vermelho Claro': '#F87171',
    'Vinho': '#7F1D1D',
    'Bordeaux': '#991B1B',
    'Coral': '#FF7F50',
    'Salmão': '#FA8072',
    // Verdes
    'Verde': '#10B981',
    'Verde Escuro': '#059669',
    'Verde Claro': '#6EE7B7',
    'Verde Oliva': '#65A30D',
    'Verde Lima': '#84CC16',
    'Verde Menta': '#A7F3D0',
    'Verde Esmeralda': '#059669',
    // Amarelos e Laranjas
    'Amarelo': '#FBBF24',
    'Amarelo Claro': '#FDE047',
    'Amarelo Ouro': '#F59E0B',
    'Laranja': '#F97316',
    'Laranja Queimado': '#EA580C',
    'Pêssego': '#FFE5B4',
    'Abricó': '#FFB347',
    // Rosas e Roxos
    'Rosa': '#EC4899',
    'Rosa Claro': '#F9A8D4',
    'Rosa Choque': '#DB2777',
    'Rosa Bebê': '#FBCFE8',
    'Roxo': '#8B5CF6',
    'Roxo Escuro': '#6D28D9',
    'Lavanda': '#C4B5FD',
    'Lilás': '#D8B4FE',
    'Magenta': '#D946EF',
    // Marrons e Terrosos
    'Marrom': '#92400E',
    'Marrom Claro': '#A16207',
    'Marrom Escuro': '#78350F',
    'Caramelo': '#D97706',
    'Café': '#6F4518',
    'Chocolate': '#5C4033',
    'Cobre': '#B45309',
    'Terracota': '#C2410C',
    // Metálicos e Especiais
    'Dourado': '#F59E0B',
    'Prata': '#9CA3AF',
    'Bronze': '#CD7F32',
    'Platina': '#E5E4E2',
    // Outras cores
    'Turquesa': '#14B8A6',
    'Ciano': '#06B6D4',
    'Índigo': '#4F46E5',
    'Violeta': '#7C3AED',
    'Púrpura': '#9333EA',
    'Creme': '#FFFDD0',
    'Off White': '#FAFAFA',
    'Nude': '#E3BC9A',
    'Camel': '#C19A6B'
  }
  return colorMap[color] || '#6B7280'
}
