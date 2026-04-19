import * as yup from 'yup'

// Validação para URL do Instagram
const instagramUrlRegex = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/.+$/i

// Validação para URL do Facebook
const facebookUrlRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+$/i

// Validação para número de celular (apenas dígitos, mínimo 8, máximo 15 caracteres)
const phoneNumberRegex = /^\d{8,15}$/

// Validação para CNPJ
const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/

// Validação para CPF
const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/

const normalizeNumber = (value: any, originalValue: any) => {
  if (originalValue === '' || originalValue === null || originalValue === undefined || Number.isNaN(value)) {
    return undefined
  }
  return value
}

// Schema para criação de loja - Step 1 (Informações Básicas)
export const createStoreStep1Schema = yup.object({
  name: yup
    .string()
    .required('Nome da loja é obrigatório')
    .min(3, 'Nome da loja deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da loja deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .optional()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
})

// Schema para criação de loja - Step 2 (Nicho)
export const createStoreStep2Schema = yup.object({
  niche_ids: yup
    .array()
    .of(yup.string())
    .min(1, 'Selecione pelo menos um nicho')
    .required('Selecione pelo menos um nicho'),
})

// Schema para criação de loja - Step 3 (Contato)
export const createStoreStep3Schema = yup.object({
  whatsapp: yup
    .string()
    .required('WhatsApp é obrigatório')
    .test(
      'whatsapp-phone',
      'Número de celular inválido. Digite apenas números (8 a 15 dígitos)',
      (value) => {
        if (!value || value.trim() === '') return false
        const cleanNumber = value.replace(/\D/g, '')
        return phoneNumberRegex.test(cleanNumber)
      }
    ),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  instagram: yup
    .string()
    .optional()
    .test(
      'instagram-url',
      'Link inválido. Use: https://instagram.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true
        return instagramUrlRegex.test(value)
      }
    ),
  facebook: yup
    .string()
    .optional()
    .test(
      'facebook-url',
      'Link inválido. Use: https://facebook.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true
        return facebookUrlRegex.test(value)
      }
    ),
})

// Schema para criação de loja - Step 4 (Configurações)
export const createStoreStep4Schema = yup.object({
  payment_methods: yup
    .array()
    .of(yup.string())
    .optional(),
  business_hours: yup
    .object()
    .optional()
})

// Schema completo para criação de loja (apenas campos essenciais obrigatórios)
export const createStoreSchema = yup.object({
  name: yup
    .string()
    .required('Nome da loja é obrigatório')
    .min(3, 'Nome da loja deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da loja deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .optional()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  niche_ids: yup
    .array()
    .of(yup.string())
    .min(1, 'Pelo menos um nicho é obrigatório')
    .required('Pelo menos um nicho é obrigatório'),
  primary_niche_id: yup
    .number()
    .optional()
    .typeError('ID do nicho principal deve ser um número válido'),
  whatsapp: yup
    .string()
    .required('WhatsApp é obrigatório')
    .test(
      'whatsapp-phone',
      'Número de celular inválido. Digite apenas números (8 a 15 dígitos)',
      (value) => {
        if (!value || value.trim() === '') return false
        const cleanNumber = value.replace(/\D/g, '')
        return phoneNumberRegex.test(cleanNumber)
      }
    ),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  instagram: yup
    .string()
    .optional()
    .test(
      'instagram-url',
      'Link inválido. Use: https://instagram.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true
        return instagramUrlRegex.test(value)
      }
    ),
  facebook: yup
    .string()
    .optional()
    .test(
      'facebook-url',
      'Link inválido. Use: https://facebook.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return true
        return facebookUrlRegex.test(value)
      }
    ),
})

// Tipos inferidos dos schemas
export type CreateStoreStep1FormData = yup.InferType<typeof createStoreStep1Schema>
export type CreateStoreStep2FormData = yup.InferType<typeof createStoreStep2Schema>
export type CreateStoreStep3FormData = yup.InferType<typeof createStoreStep3Schema>
export type CreateStoreStep4FormData = yup.InferType<typeof createStoreStep4Schema>
export type CreateStoreFormData = yup.InferType<typeof createStoreSchema>

