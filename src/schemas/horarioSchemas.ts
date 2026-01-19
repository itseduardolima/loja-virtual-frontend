import * as yup from 'yup'

// Schema para atualização de horário de funcionamento
export const updateHorarioSchema = yup.object({
  business_hours: yup
    .object()
    .optional()
})

// Tipo inferido do schema
export type UpdateHorarioFormData = yup.InferType<typeof updateHorarioSchema>

