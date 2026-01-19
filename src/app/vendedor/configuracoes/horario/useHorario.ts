import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateHorarioSchema } from '@/schemas'

const DAYS_OF_WEEK = [
  { id: 'segunda', label: 'Segunda-feira' },
  { id: 'terca', label: 'Terça-feira' },
  { id: 'quarta', label: 'Quarta-feira' },
  { id: 'quinta', label: 'Quinta-feira' },
  { id: 'sexta', label: 'Sexta-feira' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' }
]

export function useHorario() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [businessHours, setBusinessHours] = useState<Record<string, { enabled: boolean; open: string; close: string }>>({})
  const [errors, setErrors] = useState<{
    business_hours?: string
  }>({})

  useEffect(() => {
    if (store) {
      const businessHoursRaw = (store as any)?.business_hours
      
      let hours: Record<string, string> = {}
      
      if (businessHoursRaw) {
        if (typeof businessHoursRaw === 'object' && !Array.isArray(businessHoursRaw)) {
          hours = businessHoursRaw
        } else if (typeof businessHoursRaw === 'string') {
          try {
            let parsed: any = businessHoursRaw.trim()
            
            if (parsed.startsWith('"') && parsed.endsWith('"')) {
              parsed = parsed.slice(1, -1)
            }
            
            try {
              parsed = JSON.parse(parsed)
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed)
              }
            } catch (e) {
              parsed = {}
            }
            
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              hours = parsed
            }
          } catch (error) {
            console.error('Erro ao fazer parse do business_hours:', error)
            hours = {}
          }
        }
      }
      
      const formattedHours: Record<string, { enabled: boolean; open: string; close: string }> = {}
      
      DAYS_OF_WEEK.forEach(day => {
        if (hours[day.id]) {
          const [open, close] = hours[day.id].split('-')
          formattedHours[day.id] = {
            enabled: true,
            open: open?.trim() || '09:00',
            close: close?.trim() || '18:00'
          }
        } else {
          formattedHours[day.id] = {
            enabled: false,
            open: '09:00',
            close: '18:00'
          }
        }
      })
      
      setBusinessHours(formattedHours)
    }
  }, [store])

  const handleDayToggle = (dayId: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId]?.enabled
      }
    }))
  }

  const handleTimeChange = (dayId: string, field: 'open' | 'close', value: string) => {
    setBusinessHours(prev => {
      const updated = {
        ...prev,
        [dayId]: {
          ...prev[dayId],
          [field]: value
        }
      }
      
      // Validar quando houver mudança
      const formattedHours: Record<string, string> = {}
      Object.entries(updated).forEach(([day, hours]) => {
        if (hours.enabled) {
          formattedHours[day] = `${hours.open}-${hours.close}`
        }
      })
      
      updateHorarioSchema.validate({ business_hours: formattedHours }, { abortEarly: false })
        .then(() => {
          setErrors(prevErrors => ({ ...prevErrors, business_hours: undefined }))
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find(err => err.path === 'business_hours')
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, business_hours: errorMessage }))
          }
        })
      
      return updated
    })
  }

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      const formattedHours: Record<string, string> = {}
      Object.entries(businessHours).forEach(([day, hours]) => {
        if (hours.enabled) {
          formattedHours[day] = `${hours.open}-${hours.close}`
        }
      })
      updateHorarioSchema.validateSync({ business_hours: formattedHours }, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [businessHours, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const formattedHours: Record<string, string> = {}
      
      Object.entries(businessHours).forEach(([dayId, hours]) => {
        if (hours.enabled) {
          formattedHours[dayId] = `${hours.open}-${hours.close}`
        }
      })

      await updateHorarioSchema.validate({ business_hours: formattedHours }, { abortEarly: false })
      setErrors({})

      await updateStore({
        storeId: store.id,
        data: { business_hours: formattedHours }
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })
        setErrors(validationErrors)
      } else {
        console.error('Erro ao atualizar horário de funcionamento:', error)
      }
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    businessHours,
    errors,
    isFormValid,
    DAYS_OF_WEEK,
    handleDayToggle,
    handleTimeChange,
    handleSave
  }
}

