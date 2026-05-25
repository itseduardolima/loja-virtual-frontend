import * as yup from 'yup'

// Schema para atualização de informações básicas
export const updateInformacoesBasicasSchema = yup.object({
  name: yup
    .string()
    .required('Nome da loja é obrigatório')
    .min(3, 'Nome da loja deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da loja deve ter no máximo 100 caracteres'),
  description: yup
    .string()
    .optional()
    .max(170, 'Descrição deve ter no máximo 170 caracteres'),
})

// Tipo inferido do schema
export type UpdateInformacoesBasicasFormData = yup.InferType<typeof updateInformacoesBasicasSchema>
