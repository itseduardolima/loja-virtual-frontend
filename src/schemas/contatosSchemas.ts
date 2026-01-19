import * as yup from 'yup'

// Validação para URL do Instagram
const instagramUrlRegex = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/.+$/i

// Validação para URL do Facebook
const facebookUrlRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+$/i

// Validação para número de celular (apenas dígitos, mínimo 8, máximo 15 caracteres)
const phoneNumberRegex = /^\d{8,15}$/

// Schema para atualização de contatos
export const updateContatosSchema = yup.object({
  whatsapp: yup
    .string()
    .optional()
    .test(
      'whatsapp-phone',
      'Número de celular inválido. Digite apenas números (8 a 15 dígitos)',
      (value) => {
        if (!value || value.trim() === '') return true // Campo opcional
        // Remove espaços, parênteses, hífens e outros caracteres não numéricos
        const cleanNumber = value.replace(/\D/g, '')
        // Valida se tem entre 8 e 15 dígitos
        return phoneNumberRegex.test(cleanNumber)
      }
    ),
  email: yup
    .string()
    .email('Email inválido')
    .optional(),
  instagram: yup
    .string()
    .optional()
    .test(
      'instagram-url',
      'Link inválido. Use: https://instagram.com/seu-usuario ou https://www.instagram.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true // Campo opcional
        return instagramUrlRegex.test(value)
      }
    ),
  facebook: yup
    .string()
    .optional()
    .test(
      'facebook-url',
      'Link inválido. Use: https://facebook.com/seu-usuario ou https://www.facebook.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true // Campo opcional
        return facebookUrlRegex.test(value)
      }
    )
})

// Tipo inferido do schema
export type UpdateContatosFormData = yup.InferType<typeof updateContatosSchema>

