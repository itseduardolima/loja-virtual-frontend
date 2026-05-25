'use client'

import { useMemo } from 'react'
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
import { Copy, Briefcase, Sparkles, Sunset, MoonStar } from 'lucide-react'
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
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  const [hours, minutes] = value.split(':') || ['09', '00']
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const triggerCls = cn(
    'h-9 w-[68px] rounded-lg border bg-white px-2 text-[13px] font-mono font-semibold text-nxi1 tabular-nums transition-colors',
    'focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/30',
    'disabled:cursor-not-allowed disabled:bg-nxbg/50 disabled:opacity-60',
    'border-nxborder',
  )

  return (
    <div className="flex items-center gap-1">
      <Select value={hours} onValueChange={(v) => onChange(`${v}:${minutes}`)} disabled={disabled}>
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
      <Select value={minutes} onValueChange={(v) => onChange(`${hours}:${v}`)} disabled={disabled}>
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

// Calcula horas entre dois horários no formato HH:MM
function hoursBetween(open: string, close: string): number {
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  const start = oh + om / 60
  const end = ch + cm / 60
  return Math.max(0, end - start)
}

// Presets de horário
interface Preset {
  id: string
  label: string
  Icon: typeof Briefcase
  apply: (days: { id: string }[]) => Record<string, { enabled: boolean; open: string; close: string }>
}

const PRESETS: Preset[] = [
  {
    id: 'comercial',
    label: 'Comercial',
    Icon: Briefcase,
    apply: (days) => Object.fromEntries(days.map((d) => [
      d.id,
      { enabled: !['sabado', 'domingo'].includes(d.id), open: '09:00', close: '18:00' },
    ])),
  },
  {
    id: 'estendido',
    label: 'Estendido',
    Icon: Sparkles,
    apply: (days) => Object.fromEntries(days.map((d) => [
      d.id,
      { enabled: d.id !== 'domingo', open: '08:00', close: '22:00' },
    ])),
  },
  {
    id: 'finsem',
    label: 'Final de semana',
    Icon: Sunset,
    apply: (days) => Object.fromEntries(days.map((d) => [
      d.id,
      { enabled: ['sabado', 'domingo'].includes(d.id), open: '10:00', close: '18:00' },
    ])),
  },
  {
    id: 'limpar',
    label: 'Sempre fechado',
    Icon: MoonStar,
    apply: (days) => Object.fromEntries(days.map((d) => [
      d.id,
      { enabled: false, open: '09:00', close: '18:00' },
    ])),
  },
]

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

  const handlePreset = (preset: Preset) => {
    const next = preset.apply(DAYS_OF_WEEK)
    DAYS_OF_WEEK.forEach((day) => {
      const target = next[day.id]
      const current = businessHours[day.id]
      if (!current) return
      if (current.enabled !== target.enabled) handleDayToggle(day.id)
      if (current.open !== target.open) handleTimeChange(day.id, 'open', target.open)
      if (current.close !== target.close) handleTimeChange(day.id, 'close', target.close)
    })
  }

  // Estatísticas globais
  const stats = useMemo(() => {
    const open = DAYS_OF_WEEK.filter((d) => businessHours[d.id]?.enabled).length
    const totalHours = DAYS_OF_WEEK.reduce((sum, d) => {
      const h = businessHours[d.id]
      if (!h?.enabled) return sum
      return sum + hoursBetween(h.open, h.close)
    }, 0)
    return { open, closed: 7 - open, totalHours }
  }, [businessHours, DAYS_OF_WEEK])

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
        description="Aparece no rodapé da loja e é usado em mensagens automáticas fora do expediente."
      />

      {/* Quick presets + stats */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
            Aplicar preset
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePreset(p)}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-nxborder bg-white px-2.5 py-1.5 text-[12px] font-semibold text-nxi2 transition-all hover:border-nxp/30 hover:bg-nxp/[0.04] hover:text-nxp"
              >
                <p.Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats compactas */}
        <div className="flex items-center gap-1 self-end rounded-xl border border-nxborder bg-nxbg/40 p-1">
          <div className="px-2.5 py-1 text-center">
            <div className="text-[16px] font-extrabold leading-none tabular-nums text-nxi1">{stats.open}</div>
            <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxi3">Abertos</div>
          </div>
          <div className="h-8 w-px bg-nxborder" />
          <div className="px-2.5 py-1 text-center">
            <div className="text-[16px] font-extrabold leading-none tabular-nums text-nxi1">{stats.closed}</div>
            <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxi3">Fechados</div>
          </div>
          <div className="h-8 w-px bg-nxborder" />
          <div className="px-2.5 py-1 text-center">
            <div className="text-[16px] font-extrabold leading-none tabular-nums text-nxi1">
              {stats.totalHours.toFixed(0)}<span className="text-[10px] font-bold text-nxi3">h</span>
            </div>
            <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxi3">Por semana</div>
          </div>
        </div>
      </div>

      {/* Lista de dias com status visual */}
      <div className="overflow-hidden rounded-xl border border-nxborder">
        {DAYS_OF_WEEK.map((day, idx) => {
          const dayHours = businessHours[day.id] || {
            enabled: false,
            open: '09:00',
            close: '18:00',
          }
          const closed = !dayHours.enabled
          const dayHoursTotal = closed ? 0 : hoursBetween(dayHours.open, dayHours.close)

          return (
            <div
              key={day.id}
              className={cn(
                'group relative flex flex-wrap items-center gap-3 px-4 py-3 transition-colors',
                idx > 0 && 'border-t border-nxborder/70',
                closed ? 'bg-nxbg/40' : 'bg-white hover:bg-nxbg/30',
              )}
            >
              {/* Dia + checkbox + status pill */}
              <div className="flex min-w-[180px] items-center gap-3">
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
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset',
                    closed
                      ? 'bg-nxbg text-nxi3 ring-nxborder'
                      : 'bg-nxs/10 text-nxs ring-nxs/20',
                  )}
                >
                  <span className={cn('h-1 w-1 rounded-full', closed ? 'bg-nxi3' : 'bg-nxs')} />
                  {closed ? 'Fechado' : 'Aberto'}
                </span>
              </div>

              {!closed && (
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

                  {/* Total horas do dia + Aplicar a todos (hover) */}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="font-mono text-[11.5px] font-medium tabular-nums text-nxi3">
                      {dayHoursTotal.toFixed(1)}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyToAll(day.id)}
                      title="Aplicar este horário a todos os dias"
                      className="inline-flex items-center gap-1 rounded-md border border-transparent px-1.5 py-1 text-[11px] font-semibold text-nxi3 opacity-0 transition-all hover:border-nxborder hover:bg-white hover:text-nxp group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" strokeWidth={2} />
                      Aplicar a todos
                    </button>
                  </div>
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
