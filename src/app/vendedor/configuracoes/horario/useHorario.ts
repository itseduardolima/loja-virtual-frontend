import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateHorarioSchema } from '@/schemas'

export const DAYS_OF_WEEK = [
  { id: 'segunda', label: 'Segunda-feira' },
  { id: 'terca',   label: 'Terça-feira' },
  { id: 'quarta',  label: 'Quarta-feira' },
  { id: 'quinta',  label: 'Quinta-feira' },
  { id: 'sexta',   label: 'Sexta-feira' },
  { id: 'sabado',  label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
]

export type DayHours = { enabled: boolean; open: string; close: string }
export type BusinessHours = Record<string, DayHours>

const DEFAULT_DAY: DayHours = { enabled: false, open: '09:00', close: '18:00' }

function parseBusinessHours(raw: unknown): BusinessHours {
  let hours: Record<string, string> = {}

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    hours = raw as Record<string, string>
  } else if (typeof raw === 'string') {
    try {
      let parsed: unknown = raw.trim()
      if (typeof parsed === 'string' && parsed.startsWith('"')) parsed = parsed.slice(1, -1)
      parsed = JSON.parse(parsed as string)
      if (typeof parsed === 'string') parsed = JSON.parse(parsed)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        hours = parsed as Record<string, string>
      }
    } catch {
      hours = {}
    }
  }

  return Object.fromEntries(
    DAYS_OF_WEEK.map((day) => {
      if (hours[day.id]) {
        const [open, close] = hours[day.id].split('-')
        return [day.id, { enabled: true, open: open?.trim() || '09:00', close: close?.trim() || '18:00' }]
      }
      return [day.id, { ...DEFAULT_DAY }]
    }),
  )
}

function toFormattedHours(bh: BusinessHours): Record<string, string> {
  return Object.fromEntries(
    Object.entries(bh)
      .filter(([, h]) => h.enabled)
      .map(([day, h]) => [day, `${h.open}-${h.close}`]),
  )
}

export function useHorario() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [businessHours, setBusinessHours] = useState<BusinessHours>({})
  const [serverHours, setServerHours] = useState<BusinessHours>({})
  const [errors, setErrors] = useState<{ business_hours?: string }>({})

  useEffect(() => {
    if (!store) return
    const parsed = parseBusinessHours(store.business_hours)
    setBusinessHours(parsed)
    setServerHours(parsed)
  }, [store])

  const isDirty = useMemo(
    () => JSON.stringify(businessHours) !== JSON.stringify(serverHours),
    [businessHours, serverHours],
  )

  const handleDayToggle = (dayId: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [dayId]: { ...prev[dayId], enabled: !prev[dayId]?.enabled },
    }))
  }

  const handleTimeChange = (dayId: string, field: 'open' | 'close', value: string) => {
    setBusinessHours((prev) => {
      const updated = { ...prev, [dayId]: { ...prev[dayId], [field]: value } }
      updateHorarioSchema
        .validate({ business_hours: toFormattedHours(updated) }, { abortEarly: false })
        .then(() => setErrors((e) => ({ ...e, business_hours: undefined })))
        .catch((err) => {
          if (err instanceof yup.ValidationError) {
            const msg = err.inner.find((e) => e.path === 'business_hours')?.message || err.message
            setErrors((e) => ({ ...e, business_hours: msg }))
          }
        })
      return updated
    })
  }

  const handleReset = () => {
    setBusinessHours(serverHours)
    setErrors({})
  }

  const isFormValid = useMemo(() => {
    if (Object.values(errors).some((e) => e)) return false
    try {
      updateHorarioSchema.validateSync(
        { business_hours: toFormattedHours(businessHours) },
        { abortEarly: false },
      )
      return true
    } catch {
      return false
    }
  }, [businessHours, errors])

  const handleSave = async () => {
    if (!store?.id) return
    try {
      const formatted = toFormattedHours(businessHours)
      await updateHorarioSchema.validate({ business_hours: formatted }, { abortEarly: false })
      setErrors({})
      await updateStore({ storeId: store.id, data: { business_hours: formatted } })
      setServerHours(businessHours)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errs: Record<string, string> = {}
        error.inner.forEach((e) => { if (e.path) errs[e.path] = e.message })
        setErrors(errs)
      } else {
        console.error('Erro ao atualizar horário:', error)
      }
    }
  }

  return {
    isLoading,
    isUpdating,
    isDirty,
    businessHours,
    errors,
    isFormValid,
    DAYS_OF_WEEK,
    handleDayToggle,
    handleTimeChange,
    handleReset,
    handleSave,
  }
}
