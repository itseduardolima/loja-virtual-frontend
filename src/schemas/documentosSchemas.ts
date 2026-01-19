import * as yup from 'yup'

// Regex para validação de CNPJ (com ou sem formatação)
const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/

// Regex para validação de CPF (com ou sem formatação)
const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/

// Schema para atualização de documentos
export const updateDocumentosSchema = yup.object({
  cnpj: yup
    .string()
    .optional()
    .test(
      'cnpj-format',
      'CNPJ inválido. Use o formato 00.000.000/0000-00 ou 00000000000000',
      (value) => {
        if (!value || value.trim() === '') return true // Campo opcional
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
        if (!value || value.trim() === '') return true // Campo opcional
        return cpfRegex.test(value)
      }
    )
    .max(14, 'CPF deve ter no máximo 14 caracteres')
})

// Tipo inferido do schema
export type UpdateDocumentosFormData = yup.InferType<typeof updateDocumentosSchema>

