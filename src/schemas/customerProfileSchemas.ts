import * as yup from 'yup'

const phoneRegex = /^\+?\d{10,15}$/

export const updateCustomerProfileSchema = yup.object({
  name: yup
    .string()
    .required('O nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: yup
    .string()
    .required('O e-mail é obrigatório')
    .email('E-mail inválido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres')
    .trim(),
  phone: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim()))
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .test(
      'phone-format',
      'Telefone inválido. Use apenas números com DDI (10 a 15 dígitos), ex: 5511999999999',
      (value) => {
        if (!value || value.trim() === '') return true
        const normalized = value.replace(/[^\d+]/g, '')
        return phoneRegex.test(normalized)
      }
    ),
})

export type UpdateCustomerProfileFormData = yup.InferType<typeof updateCustomerProfileSchema>
