import * as yup from 'yup'

export const checkoutFormSchema = yup.object({
  customer_name: yup
    .string()
    .required('Nome é obrigatório')
    .trim(),
  customer_email: yup
    .string()
    .required('Email é obrigatório')
    .email('Digite um email válido')
    .trim(),
  customer_phone: yup
    .string()
    .required('WhatsApp é obrigatório')
    .test(
      'phone-valid',
      'Digite um número válido (apenas números, 8 a 15 dígitos). Pode incluir + no início.',
      (value) => {
        if (!value || !value.trim()) return false
        const clean = value.replace(/\D/g, '')
        return clean.length >= 8 && clean.length <= 15
      }
    )
    .trim(),
  notes: yup.string().optional().trim()
})

export type CheckoutFormData = yup.InferType<typeof checkoutFormSchema>
