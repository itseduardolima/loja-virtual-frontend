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
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  niche_ids: yup
    .array()
    .of(yup.string())
    .min(1, 'Pelo menos um nicho é obrigatório')
    .required('Pelo menos um nicho é obrigatório')
})

// Tipo inferido do schema
export type UpdateInformacoesBasicasFormData = yup.InferType<typeof updateInformacoesBasicasSchema>

