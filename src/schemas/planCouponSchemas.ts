import * as Yup from 'yup'

export const createPlanCouponSchema = Yup.object({
  code: Yup.string()
    .required('Código é obrigatório')
    .matches(/^[A-Z0-9_-]{3,50}$/, 'Use 3-50 caracteres maiúsculos, números, _ ou -'),
  description: Yup.string().optional(),
  discount_type: Yup.string()
    .oneOf(['percent', 'fixed'], 'Tipo inválido')
    .required('Tipo é obrigatório'),
  discount_value: Yup.number()
    .typeError('Valor deve ser um número')
    .positive('Deve ser positivo')
    .when('discount_type', {
      is: 'percent',
      then: (s) => s.max(100, 'Máximo 100%'),
    })
    .required('Valor é obrigatório'),
  applies_to_cycle: Yup.string()
    .oneOf(['monthly', 'yearly', 'both'])
    .default('both'),
  duration_type: Yup.string()
    .oneOf(['forever', 'once', 'months'], 'Duração inválida')
    .required('Duração é obrigatória'),
  duration_months: Yup.number()
    .transform((_, original) => (original === '' || original == null ? null : Number(original)))
    .nullable()
    .when('duration_type', {
      is: 'months',
      then: (s) => s.typeError('Informe os meses').min(1, 'Mínimo 1 mês').required('Meses é obrigatório'),
    }),
  plan_ids: Yup.array().of(Yup.number()).optional(),
  max_uses: Yup.number()
    .transform((_, original) => (original === '' || original == null ? null : Number(original)))
    .nullable()
    .min(1, 'Mínimo 1 uso'),
  expires_at: Yup.string().optional().nullable(),
  status: Yup.number().oneOf([0, 1]).default(1),
})
