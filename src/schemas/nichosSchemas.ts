import * as yup from 'yup'

// Schema para atualização dos nichos da loja
export const updateNichosSchema = yup.object({
  niche_ids: yup
    .array()
    .of(yup.string())
    .min(1, 'Selecione pelo menos um nicho')
    .required('Selecione pelo menos um nicho'),
})

export type UpdateNichosFormData = yup.InferType<typeof updateNichosSchema>
