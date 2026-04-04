import * as yup from 'yup'

export const createCouponSchema = yup.object({
  code: yup
    .string()
    .required('Código é obrigatório')
    .min(2, 'Código deve ter no mínimo 2 caracteres')
    .max(20, 'Código deve ter no máximo 20 caracteres'),
  type: yup
    .string()
    .oneOf(['percent', 'fixed'], 'Tipo inválido')
    .required('Tipo de desconto é obrigatório'),
  value: yup
    .number()
    .typeError('Informe um valor numérico')
    .required('Valor é obrigatório')
    .positive('O valor deve ser maior que zero')
    .when('type', {
      is: 'percent',
      then: (schema) => schema.max(100, 'O percentual não pode ultrapassar 100%'),
    }),
  min_order: yup
    .number()
    .typeError('Informe um valor numérico')
    .min(0, 'O pedido mínimo não pode ser negativo')
    .max(99999, 'Máximo R$ 99.999')
    .nullable()
    .optional(),
  max_uses: yup
    .number()
    .typeError('Informe um número inteiro')
    .integer('Informe um número inteiro')
    .min(1, 'O limite mínimo é 1 uso')
    .max(999, 'Máximo 999 usos')
    .nullable()
    .optional(),
  expires_at: yup
    .date()
    .nullable()
    .optional(),
})

export type CreateCouponFormData = yup.InferType<typeof createCouponSchema>

export const updateCouponSchema = yup.object({
  type: yup
    .string()
    .oneOf(['percent', 'fixed'], 'Tipo inválido')
    .required('Tipo de desconto é obrigatório'),
  value: yup
    .number()
    .typeError('Informe um valor numérico')
    .required('Valor é obrigatório')
    .positive('O valor deve ser maior que zero')
    .when('type', {
      is: 'percent',
      then: (schema) => schema.max(100, 'O percentual não pode ultrapassar 100%'),
    }),
  min_order: yup
    .number()
    .typeError('Informe um valor numérico')
    .min(0, 'O pedido mínimo não pode ser negativo')
    .max(99999, 'Máximo R$ 99.999')
    .nullable()
    .optional(),
  max_uses: yup
    .number()
    .typeError('Informe um número inteiro')
    .integer('Informe um número inteiro')
    .min(1, 'O limite mínimo é 1 uso')
    .max(999, 'Máximo 999 usos')
    .nullable()
    .optional(),
  expires_at: yup
    .date()
    .nullable()
    .optional(),
})

export type UpdateCouponFormData = yup.InferType<typeof updateCouponSchema>
