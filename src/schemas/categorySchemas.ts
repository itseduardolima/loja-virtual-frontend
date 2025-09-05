import * as yup from 'yup'

// Schema para criação de categoria
export const createCategorySchema = yup.object({
  name: yup
    .string()
    .required('Nome da categoria é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .optional()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
})

// Schema para atualização de categoria
export const updateCategorySchema = yup.object({
  name: yup
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
})

// Tipos inferidos dos schemas
export type CreateCategoryFormData = yup.InferType<typeof createCategorySchema>
export type UpdateCategoryFormData = yup.InferType<typeof updateCategorySchema>
