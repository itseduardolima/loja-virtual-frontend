import * as yup from 'yup'

const normalizeNumber = (value: any, originalValue: any) => {
  if (originalValue === '' || originalValue === null || originalValue === undefined || Number.isNaN(value)) {
    return undefined
  }
  return value
}

// Schema para atualização de entrega
export const updateEntregaSchema = yup.object({
  delivery_fee: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .min(0, 'Taxa de entrega não pode ser negativa')
    .typeError('Taxa de entrega deve ser um número válido'),
  free_delivery_min: yup
    .number()
    .transform(normalizeNumber)
    .optional()
    .min(0, 'Valor mínimo não pode ser negativo')
    .typeError('Valor mínimo deve ser um número válido'),
  delivery_time: yup
    .string()
    .optional()
    .max(50, 'Tempo de entrega deve ter no máximo 50 caracteres')
})

// Tipo inferido do schema
export type UpdateEntregaFormData = yup.InferType<typeof updateEntregaSchema>

