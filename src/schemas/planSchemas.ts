import * as Yup from 'yup'

export const createPlanSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string().optional(),
  price_monthly: Yup.number()
    .typeError('Preço mensal deve ser um número')
    .positive('Preço mensal deve ser positivo')
    .required('Preço mensal é obrigatório'),
  price_yearly: Yup.number()
    .transform((_, original) => (original === '' || original == null ? null : Number(original)))
    .nullable()
    .optional(),
  max_products: Yup.number()
    .transform((_, original) => (original === '' || original == null ? null : Number(original)))
    .nullable()
    .optional(),
  feature_product_questions: Yup.boolean().default(false),
  feature_advanced_dashboard: Yup.boolean().default(false),
  feature_order_export: Yup.boolean().default(false),
  feature_coupons: Yup.boolean().default(false),
  trial_days: Yup.number()
    .transform((_, original) => {
      if (original === '' || original == null) return null
      const n = Number(original)
      // 0 vira null (sem trial); negativos rejeitados pela validação positive()
      return n === 0 ? null : n
    })
    .nullable()
    .integer('Trial deve ser em dias inteiros')
    .positive('Trial deve ser maior que 0'),
  status: Yup.number().oneOf([0, 1]).default(1),
  sort_order: Yup.number().min(0).default(0),
})
