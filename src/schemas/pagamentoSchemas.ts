import * as yup from 'yup'

// Schema para atualização de métodos de pagamento
export const updatePagamentoSchema = yup.object({
  payment_methods: yup
    .array()
    .of(yup.string())
    .optional()
})

// Tipo inferido do schema
export type UpdatePagamentoFormData = yup.InferType<typeof updatePagamentoSchema>

