'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { Card, CardContent, Input, Label, Button, LoadingSpinner, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { Clock } from 'lucide-react'

const DAYS_OF_WEEK = [
  { id: 'segunda', label: 'Segunda-feira' },
  { id: 'terca', label: 'Terça-feira' },
  { id: 'quarta', label: 'Quarta-feira' },
  { id: 'quinta', label: 'Quinta-feira' },
  { id: 'sexta', label: 'Sexta-feira' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' }
]

// Componente de seleção de horário
const TimeSelect = ({ value, onChange, id }: { value: string; onChange: (value: string) => void; id: string }) => {
  const [hours, minutes] = value.split(':') || ['09', '00']
  
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const handleHoursChange = (newHours: string) => {
    onChange(`${newHours}:${minutes}`)
  }

  const handleMinutesChange = (newMinutes: string) => {
    onChange(`${hours}:${newMinutes}`)
  }

  return (
    <div className="flex items-center gap-1">
      <Select value={hours} onValueChange={handleHoursChange}>
        <SelectTrigger className="w-16 h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hoursOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-gray-500 font-medium">:</span>
      <Select value={minutes} onValueChange={handleMinutesChange}>
        <SelectTrigger className="w-16 h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {minutesOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function HorarioPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [businessHours, setBusinessHours] = useState<Record<string, { enabled: boolean; open: string; close: string }>>({})

  useEffect(() => {
    if (store) {
      const businessHoursRaw = (store as any)?.business_hours
      
      // O backend agora retorna business_hours já parseado como objeto
      // Mas ainda pode vir como string em alguns casos (compatibilidade)
      let hours: Record<string, string> = {}
      
      if (businessHoursRaw) {
        if (typeof businessHoursRaw === 'object' && !Array.isArray(businessHoursRaw)) {
          // Já é um objeto, usa diretamente
          hours = businessHoursRaw
        } else if (typeof businessHoursRaw === 'string') {
          // Ainda é string, faz parse (fallback para compatibilidade)
          try {
            let parsed: any = businessHoursRaw.trim()
            
            // Remove aspas externas se houver
            if (parsed.startsWith('"') && parsed.endsWith('"')) {
              parsed = parsed.slice(1, -1)
            }
            
            // Tenta fazer parse
            try {
              parsed = JSON.parse(parsed)
              // Se ainda for string, tenta parse novamente
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

  if (isLoading) {
    return <LoadingPage />
  }

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
    setBusinessHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const formattedHours: Record<string, string> = {}
      
      Object.entries(businessHours).forEach(([dayId, hours]) => {
        if (hours.enabled) {
          formattedHours[dayId] = `${hours.open}-${hours.close}`
        }
      })

      await updateStore({
        storeId: store.id,
        data: { business_hours: formattedHours }
      })
    } catch (error) {
      console.error('Erro ao atualizar horário de funcionamento:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Horário de Funcionamento</h1>
        </div>
        <p className="text-gray-600">
          Configure os horários de funcionamento da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            {DAYS_OF_WEEK.map((day) => {
              const dayHours = businessHours[day.id] || { enabled: false, open: '09:00', close: '18:00' }
              
              return (
                <div
                  key={day.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={day.id}
                      checked={dayHours.enabled}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                    <Label
                      htmlFor={day.id}
                      className="font-medium text-gray-900 cursor-pointer min-w-[140px]"
                    >
                      {day.label}
                    </Label>
                  </div>

                  {dayHours.enabled && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${day.id}-open`} className="text-sm text-gray-600">
                          De:
                        </Label>
                        <TimeSelect
                          value={dayHours.open}
                          onChange={(value) => handleTimeChange(day.id, 'open', value)}
                          id={`${day.id}-open`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${day.id}-close`} className="text-sm text-gray-600">
                          Até:
                        </Label>
                        <TimeSelect
                          value={dayHours.close}
                          onChange={(value) => handleTimeChange(day.id, 'close', value)}
                          id={`${day.id}-close`}
                        />
                      </div>
                    </div>
                  )}

                  {!dayHours.enabled && (
                    <span className="text-sm text-gray-400">Fechado</span>
                  )}
                </div>
              )
            })}

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  ""
                )}
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

