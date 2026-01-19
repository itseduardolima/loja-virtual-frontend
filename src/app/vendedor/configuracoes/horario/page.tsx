'use client'

import { useHorario } from './useHorario'
import { Card, CardContent, Label, Button, LoadingSpinner, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'

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
  const {
    isLoading,
    isUpdating,
    businessHours,
    errors,
    isFormValid,
    DAYS_OF_WEEK,
    handleDayToggle,
    handleTimeChange,
    handleSave
  } = useHorario()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-7xl mx-auto">
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

            {errors.business_hours && (
              <p className="text-sm text-red-600">{errors.business_hours}</p>
            )}

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating || !isFormValid}
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
