import * as Yup from 'yup'

export const createPlanSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  slug: Yup.string()
    .required('Slug é obrigatório')
    .matches(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: Yup.string().optional(),
  price: Yup.number().typeError('Preço deve ser um número').positive('Preço deve ser positivo').required('Preço é obrigatório'),
  billing_cycle: Yup.string().oneOf(['monthly', 'yearly'], 'Ciclo inválido').required('Ciclo é obrigatório'),
  max_products: Yup.number().nullable().optional(),
  max_stores: Yup.number().min(1).optional(),
  features: Yup.string().optional(),
  status: Yup.number().oneOf([0, 1]).default(1),
  sort_order: Yup.number().min(0).default(0),
})
