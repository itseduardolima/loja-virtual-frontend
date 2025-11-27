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
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  description: yup
    .string()
    .optional()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  price: yup
    .number()
    .transform(normalizeNumber)
    .required('Preço é obrigatório')
    .min(0.01, 'Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()).optional(),
  colors: yup.array().of(yup.string()).optional(),
  stock: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .min(0, 'Estoque não pode ser negativo')
    .typeError('Estoque deve ser um número válido'),
  discount_price: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .nullable()
    .min(0, 'Preço com desconto não pode ser negativo')
    .typeError('Preço com desconto deve ser um número válido'),
  category_id: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .typeError('Categoria deve ser um número válido'),
  featured: yup.boolean().optional()
})

export const updateProductSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  description: yup
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  price: yup
    .number()
    .transform(normalizeNumber)
    .min(0.01, 'Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()),
  colors: yup.array().of(yup.string()),
  stock: yup
    .number()
    .transform(normalizeNumber)
    .min(0, 'Estoque não pode ser negativo')
    .typeError('Estoque deve ser um número válido'),
  discount_price: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .nullable()
    .min(0, 'Preço com desconto não pode ser negativo')
    .typeError('Preço com desconto deve ser um número válido'),
  category_id: yup
    .number()
    .transform(normalizeNumber)
    .typeError('Categoria deve ser um número válido'),
  featured: yup.boolean()
})

export type CreateProductFormData = yup.InferType<typeof createProductSchema>
export type UpdateProductFormData = yup.InferType<typeof updateProductSchema>

export const SIZE_OPTIONS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
export const COLOR_OPTIONS = [
  'Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 
  'Rosa', 'Roxo', 'Laranja', 'Marrom', 'Cinza', 'Bege'
]

export function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    'Azul': '#3B82F6',
    'Vermelho': '#EF4444',
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Verde': '#10B981',
    'Amarelo': '#F59E0B',
    'Rosa': '#EC4899',
    'Roxo': '#8B5CF6',
    'Laranja': '#F97316',
    'Cinza': '#6B7280',
    'Marrom': '#92400E',
    'Bege': '#F3E8FF',
    'Azul Marinho': '#1E40AF',
    'Verde Oliva': '#65A30D',
    'Coral': '#FB7185',
    'Turquesa': '#06B6D4',
    'Magenta': '#D946EF',
    'Dourado': '#F59E0B',
    'Prata': '#9CA3AF',
    'Cobre': '#B45309'
  }
  return colorMap[color] || '#6B7280'
}
