import * as yup from 'yup'

// Schema para atualização de endereço
export const updateEnderecoSchema = yup.object({
  address: yup
    .string()
    .optional()
    .max(255, 'Endereço deve ter no máximo 255 caracteres'),
  city: yup
    .string()
    .optional()
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  state: yup
    .string()
    .optional()
    .max(2, 'Estado deve ter 2 caracteres'),
  zipcode: yup
    .string()
    .optional()
    .max(10, 'CEP deve ter no máximo 10 caracteres'),
  neighborhood: yup
    .string()
    .optional()
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  number: yup
    .string()
    .optional()
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  complement: yup
    .string()
    .optional()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
})

// Tipo inferido do schema
export type UpdateEnderecoFormData = yup.InferType<typeof updateEnderecoSchema>

