import * as yup from 'yup'

// Schema para criação de produto
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
    .required('Preço é obrigatório')
    .min(0.01, 'Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()).optional(),
  colors: yup.array().of(yup.string()).optional(),
  stock: yup
    .number()
    .optional()
    .min(0, 'Estoque não pode ser negativo')
    .typeError('Estoque deve ser um número válido'),
  category_id: yup.number().optional().typeError('Categoria deve ser um número válido'),
  featured: yup.boolean().optional()
})

// Schema para atualização de produto
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
    .min(0.01, 'Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  sizes: yup.array().of(yup.string()),
  colors: yup.array().of(yup.string()),
  stock: yup
    .number()
    .min(0, 'Estoque não pode ser negativo')
    .typeError('Estoque deve ser um número válido'),
  category_id: yup.number().typeError('Categoria deve ser um número válido'),
  featured: yup.boolean()
})

// Tipos inferidos dos schemas
export type CreateProductFormData = yup.InferType<typeof createProductSchema>
export type UpdateProductFormData = yup.InferType<typeof updateProductSchema>

// Opções pré-definidas
export const SIZE_OPTIONS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
export const COLOR_OPTIONS = [
  'Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 
  'Rosa', 'Roxo', 'Laranja', 'Marrom', 'Cinza', 'Bege'
]

// Função auxiliar para obter cor hexadecimal
export function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    'Preto': '#000000',
    'Branco': '#FFFFFF',
    'Azul': '#3B82F6',
    'Vermelho': '#EF4444',
    'Verde': '#10B981',
    'Amarelo': '#F59E0B',
    'Rosa': '#EC4899',
    'Roxo': '#8B5CF6',
    'Laranja': '#F97316',
    'Marrom': '#A3A3A3',
    'Cinza': '#6B7280',
    'Bege': '#F3E8FF'
  }
  return colorMap[color] || '#6B7280'
}
