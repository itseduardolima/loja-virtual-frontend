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
  niche_ids: yup
    .array()
    .of(yup.string())
    .min(1, 'Pelo menos um nicho é obrigatório')
    .required('Pelo menos um nicho é obrigatório')
})

// Schema para criação de loja - Step 2 (Contato)
export const createStoreStep2Schema = yup.object({
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
    .required('Instagram é obrigatório')
    .test(
      'instagram-url',
      'Link inválido. Use: https://instagram.com/seu-usuario ou https://www.instagram.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return false
        return instagramUrlRegex.test(value)
      }
    ),
  facebook: yup
    .string()
    .required('Facebook é obrigatório')
    .test(
      'facebook-url',
      'Link inválido. Use: https://facebook.com/seu-usuario ou https://www.facebook.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return false
        return facebookUrlRegex.test(value)
      }
    ),
  phone: yup
    .string()
    .optional()
    .test(
      'phone-phone',
      'Número de telefone inválido. Digite apenas números (8 a 15 dígitos)',
      (value) => {
        if (!value || value.trim() === '') return true
        const cleanNumber = value.replace(/\D/g, '')
        return phoneNumberRegex.test(cleanNumber)
      }
    ),
  website: yup
    .string()
    .optional()
    .url('URL inválida')
    .max(255, 'Website deve ter no máximo 255 caracteres'),
  cnpj: yup
    .string()
    .optional()
    .test(
      'cnpj-format',
      'CNPJ inválido. Use o formato 00.000.000/0000-00 ou 00000000000000',
      (value) => {
        if (!value || value.trim() === '') return true
        return cnpjRegex.test(value)
      }
    )
    .max(18, 'CNPJ deve ter no máximo 18 caracteres'),
  cpf: yup
    .string()
    .optional()
    .test(
      'cpf-format',
      'CPF inválido. Use o formato 000.000.000-00 ou 00000000000',
      (value) => {
        if (!value || value.trim() === '') return true
        return cpfRegex.test(value)
      }
    )
    .max(14, 'CPF deve ter no máximo 14 caracteres')
})

// Schema para criação de loja - Step 3 (Endereço) - endereço obrigatório ao criar loja
export const createStoreStep3Schema = yup.object({
  address: yup
    .string()
    .required('Endereço (rua) é obrigatório')
    .max(255, 'Endereço deve ter no máximo 255 caracteres'),
  city: yup
    .string()
    .required('Cidade é obrigatória')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  state: yup
    .string()
    .required('Estado (UF) é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres (ex: SP)'),
  zipcode: yup
    .string()
    .required('CEP é obrigatório')
    .max(10, 'CEP deve ter no máximo 10 caracteres'),
  neighborhood: yup
    .string()
    .required('Bairro é obrigatório')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  number: yup
    .string()
    .required('Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  complement: yup
    .string()
    .optional()
    .max(100, 'Complemento deve ter no máximo 100 caracteres'),
  delivery_fee: yup
    .string()
    .optional()
    .test(
      'delivery-fee-number',
      'Taxa de entrega deve ser um número válido',
      (value) => {
        if (!value || value.trim() === '') return true
        const num = parseFloat(value)
        return !isNaN(num) && num >= 0
      }
    ),
  free_delivery_min: yup
    .string()
    .optional()
    .test(
      'free-delivery-min-number',
      'Valor mínimo deve ser um número válido',
      (value) => {
        if (!value || value.trim() === '') return true
        const num = parseFloat(value)
        return !isNaN(num) && num >= 0
      }
    ),
  delivery_time: yup
    .string()
    .optional()
    .max(50, 'Tempo de entrega deve ter no máximo 50 caracteres')
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

// Schema completo para criação de loja
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
    .required('Instagram é obrigatório')
    .test(
      'instagram-url',
      'Link inválido. Use: https://instagram.com/seu-usuario ou https://www.instagram.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return false
        return instagramUrlRegex.test(value)
      }
    ),
  facebook: yup
    .string()
    .required('Facebook é obrigatório')
    .test(
      'facebook-url',
      'Link inválido. Use: https://facebook.com/seu-usuario ou https://www.facebook.com/seu-usuario',
      (value) => {
        if (!value || value.trim() === '') return false
        return facebookUrlRegex.test(value)
      }
    ),
  phone: yup
    .string()
    .optional()
    .test(
      'phone-phone',
      'Número de telefone inválido. Digite apenas números (8 a 15 dígitos)',
      (value) => {
        if (!value || value.trim() === '') return true
        const cleanNumber = value.replace(/\D/g, '')
        return phoneNumberRegex.test(cleanNumber)
      }
    ),
  website: yup
    .string()
    .optional()
    .url('URL inválida')
    .max(255, 'Website deve ter no máximo 255 caracteres'),
  cnpj: yup
    .string()
    .optional()
    .test(
      'cnpj-format',
      'CNPJ inválido. Use o formato 00.000.000/0000-00 ou 00000000000000',
      (value) => {
        if (!value || value.trim() === '') return true
        return cnpjRegex.test(value)
      }
    )
    .max(18, 'CNPJ deve ter no máximo 18 caracteres'),
  cpf: yup
    .string()
    .optional()
    .test(
      'cpf-format',
      'CPF inválido. Use o formato 000.000.000-00 ou 00000000000',
      (value) => {
        if (!value || value.trim() === '') return true
        return cpfRegex.test(value)
      }
    )
    .max(14, 'CPF deve ter no máximo 14 caracteres'),
  address: yup
    .string()
    .required('Endereço (rua) é obrigatório')
    .max(255, 'Endereço deve ter no máximo 255 caracteres'),
  city: yup
    .string()
    .required('Cidade é obrigatória')
    .max(100, 'Cidade deve ter no máximo 100 caracteres'),
  state: yup
    .string()
    .required('Estado (UF) é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres (ex: SP)'),
  zipcode: yup
    .string()
    .required('CEP é obrigatório')
    .max(10, 'CEP deve ter no máximo 10 caracteres'),
  neighborhood: yup
    .string()
    .required('Bairro é obrigatório')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  number: yup
    .string()
    .required('Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  complement: yup
    .string()
    .optional()
    .max(100, 'Complemento deve ter no máximo 100 caracteres'),
  delivery_fee: yup
    .string()
    .optional()
    .test(
      'delivery-fee-number',
      'Taxa de entrega deve ser um número válido',
      (value) => {
        if (!value || value.trim() === '') return true
        const num = parseFloat(value)
        return !isNaN(num) && num >= 0
      }
    ),
  free_delivery_min: yup
    .string()
    .optional()
    .test(
      'free-delivery-min-number',
      'Valor mínimo deve ser um número válido',
      (value) => {
        if (!value || value.trim() === '') return true
        const num = parseFloat(value)
        return !isNaN(num) && num >= 0
      }
    ),
  delivery_time: yup
    .string()
    .optional()
    .max(50, 'Tempo de entrega deve ter no máximo 50 caracteres'),
  payment_methods: yup
    .array()
    .of(yup.string())
    .optional(),
  business_hours: yup
    .object()
    .optional()
})

// Tipos inferidos dos schemas
export type CreateStoreStep1FormData = yup.InferType<typeof createStoreStep1Schema>
export type CreateStoreStep2FormData = yup.InferType<typeof createStoreStep2Schema>
export type CreateStoreStep3FormData = yup.InferType<typeof createStoreStep3Schema>
export type CreateStoreStep4FormData = yup.InferType<typeof createStoreStep4Schema>
export type CreateStoreFormData = yup.InferType<typeof createStoreSchema>

