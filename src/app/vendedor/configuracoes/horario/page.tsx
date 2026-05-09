'use client'

import { useHorario } from './useHorario'
import {
  Label,
  LoadingSpinner,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'
import { Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SectionCard,
  SectionHeader,
  FormActions,
  FieldHelp,
  NxButton,
} from '../_shared'

const TimeSelect = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [hours, minutes] = value.split(':') || ['09', '00']
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const triggerCls =
    'h-9 w-16 rounded-lg border border-nxborder bg-white px-2 text-[13px] text-nxi1 tabular-nums focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/30'

  return (
    <div className="flex items-center gap-1">
      <Select value={hours} onValueChange={(v) => onChange(`${v}:${minutes}`)}>
        <SelectTrigger className={triggerCls}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {hoursOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>{hour}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-nxi3">:</span>
      <Select value={minutes} onValueChange={(v) => onChange(`${hours}:${v}`)}>
        <SelectTrigger className={triggerCls}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {minutesOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>{minute}</SelectItem>
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
    handleSave,
  } = useHorario()

  const handleApplyToAll = (sourceDayId: string) => {
    const source = businessHours[sourceDayId]
    if (!source) return
    DAYS_OF_WEEK.forEach((day) => {
      if (day.id === sourceDayId) return
      handleTimeChange(day.id, 'open', source.open)
      handleTimeChange(day.id, 'close', source.close)
    })
  }

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard>
      <SectionHeader
        title="Horário de funcionamento"
        description="Aparece no rodapé e é usado em mensagens automáticas fora do expediente."
      />

      <div className="flex flex-col gap-1 rounded-xl border border-nxborder bg-nxbg/30 p-1.5">
        {DAYS_OF_WEEK.map((day) => {
          const dayHours = businessHours[day.id] || {
            enabled: false,
            open: '09:00',
            close: '18:00',
          }
          const closed = !dayHours.enabled

          return (
            <div
              key={day.id}
              className={cn(
                'flex flex-wrap items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                closed ? 'bg-transparent' : 'bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]',
              )}
            >
              <div className="flex min-w-[150px] items-center gap-2.5">
                <Checkbox
                  id={day.id}
                  checked={dayHours.enabled}
                  onCheckedChange={() => handleDayToggle(day.id)}
                />
                <Label
                  htmlFor={day.id}
                  className={cn(
                    'cursor-pointer text-[13.5px] font-semibold tracking-[-0.005em]',
                    closed ? 'text-nxi3' : 'text-nxi1',
                  )}
                >
                  {day.label}
                </Label>
              </div>

              {closed ? (
                <span className="text-[12.5px] font-medium text-nxi3">Fechado</span>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <TimeSelect
                      value={dayHours.open}
                      onChange={(v) => handleTimeChange(day.id, 'open', v)}
                    />
                    <span className="text-[12px] text-nxi3">até</span>
                    <TimeSelect
                      value={dayHours.close}
                      onChange={(v) => handleTimeChange(day.id, 'close', v)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyToAll(day.id)}
                    title="Aplicar este horário a todos os dias"
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[12px] font-semibold text-nxi3 transition-colors hover:border-nxborder hover:bg-nxbg hover:text-nxi1"
                  >
                    <Copy size={12} strokeWidth={2} />
                    Aplicar a todos
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {errors.business_hours && (
        <div className="mt-3">
          <FieldHelp variant="error">{errors.business_hours}</FieldHelp>
        </div>
      )}

      <FormActions>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar alterações'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
