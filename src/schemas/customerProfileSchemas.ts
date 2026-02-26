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
  address_street: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim()))
    .max(255, 'Endereço deve ter no máximo 255 caracteres'),
  address_city: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim()))
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  address_state: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim().toUpperCase()))
    .max(2, 'Estado deve ter 2 caracteres (UF)'),
  address_zipcode: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim()))
    .max(10, 'CEP deve ter no máximo 10 caracteres')
    .test(
      'zipcode-format',
      'CEP inválido. Use o formato 12345-678 ou 12345678',
      (value) => {
        if (!value || value.trim() === '') return true
        const digits = value.replace(/\D/g, '')
        return digits.length === 8
      }
    ),
  address_country: yup
    .string()
    .optional()
    .transform((v) => (v?.trim() === '' ? undefined : v?.trim()))
    .max(100, 'País deve ter no máximo 100 caracteres'),
})

export type UpdateCustomerProfileFormData = yup.InferType<typeof updateCustomerProfileSchema>
