'use client'

import { useMemo } from 'react'
import { useHorario } from './useHorario'
import {
  LoadingSpinner,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'
import { Briefcase, Copy, MoonStar, Sparkles, Sunset } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SectionCard,
  SectionHeader,
  Switch,
  FormActions,
  FieldHelp,
  NxButton,
} from '../_shared'

// ─── TimeSelect ──────────────────────────────────────────────────────────────

const HOURS   = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const triggerCls =
  'h-9 w-[62px] rounded-lg border border-nxborder bg-white px-2 text-[13px] font-mono font-semibold text-nxi1 tabular-nums transition-colors focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/30 disabled:cursor-not-allowed disabled:bg-nxbg/50 disabled:opacity-60'

function TimeSelect({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const [h, m] = value.split(':')
  return (
    <div className="flex items-center gap-1">
      <Select value={h} onValueChange={(v) => onChange(`${v}:${m}`)} disabled={disabled}>
        <SelectTrigger className={triggerCls}><SelectValue /></SelectTrigger>
        <SelectContent>
          {HOURS.map((hr) => <SelectItem key={hr} value={hr}>{hr}</SelectItem>)}
        </SelectContent>
      </Select>
      <span className="text-[12px] text-nxi3">:</span>
      <Select value={m} onValueChange={(v) => onChange(`${h}:${v}`)} disabled={disabled}>
        <SelectTrigger className={triggerCls}><SelectValue /></SelectTrigger>
        <SelectContent>
          {MINUTES.map((mn) => <SelectItem key={mn} value={mn}>{mn}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hoursBetween(open: string, close: string): number {
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  return Math.max(0, ch + cm / 60 - (oh + om / 60))
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: 'comercial',
    label: 'Comercial',
    Icon: Briefcase,
    apply: (days: { id: string }[]) =>
      Object.fromEntries(days.map((d) => [
        d.id,
        { enabled: !['sabado', 'domingo'].includes(d.id), open: '09:00', close: '18:00' },
      ])),
  },
  {
    id: 'estendido',
    label: 'Estendido',
    Icon: Sparkles,
    apply: (days: { id: string }[]) =>
      Object.fromEntries(days.map((d) => [
        d.id,
        { enabled: d.id !== 'domingo', open: '08:00', close: '22:00' },
      ])),
  },
  {
    id: 'finsem',
    label: 'Final de semana',
    Icon: Sunset,
    apply: (days: { id: string }[]) =>
      Object.fromEntries(days.map((d) => [
        d.id,
        { enabled: ['sabado', 'domingo'].includes(d.id), open: '10:00', close: '18:00' },
      ])),
  },
  {
    id: 'limpar',
    label: 'Sempre fechado',
    Icon: MoonStar,
    apply: (days: { id: string }[]) =>
      Object.fromEntries(days.map((d) => [
        d.id,
        { enabled: false, open: '09:00', close: '18:00' },
      ])),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HorarioPage() {
  const {
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

  const handlePreset = (preset: (typeof PRESETS)[number]) => {
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

  const stats = useMemo(() => {
    const open = DAYS_OF_WEEK.filter((d) => businessHours[d.id]?.enabled).length
    const totalHours = DAYS_OF_WEEK.reduce((sum, d) => {
      const h = businessHours[d.id]
      return h?.enabled ? sum + hoursBetween(h.open, h.close) : sum
    }, 0)
    return { open, totalHours }
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

      {/* Presets */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handlePreset(p)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-nxborder bg-white px-2.5 py-1.5 text-[12px] font-semibold text-nxi2 transition-all hover:border-nxp/30 hover:bg-nxp/[0.04] hover:text-nxp"
          >
            <p.Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats — linha de texto simples */}
      <p className="mb-4 text-[12.5px] text-nxi3">
        {stats.open === 0
          ? 'Nenhum dia aberto'
          : `${stats.open} ${stats.open === 1 ? 'dia aberto' : 'dias abertos'} · ${stats.totalHours.toFixed(0)}h por semana`}
      </p>

      {/* Dias */}
      <div className="overflow-hidden rounded-xl border border-nxborder">
        {DAYS_OF_WEEK.map((day, idx) => {
          const dh = businessHours[day.id] ?? { enabled: false, open: '09:00', close: '18:00' }
          const closed = !dh.enabled

          return (
            <div
              key={day.id}
              className={cn(
                'group flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors',
                idx > 0 && 'border-t border-nxborder/70',
                closed ? 'bg-nxbg/40' : 'bg-white',
              )}
            >
              <Switch
                checked={dh.enabled}
                onChange={() => handleDayToggle(day.id)}
                ariaLabel={day.label}
              />

              <span
                className={cn(
                  'w-28 text-[13.5px] font-semibold tracking-[-0.005em]',
                  closed ? 'text-nxi3' : 'text-nxi1',
                )}
              >
                {day.label}
              </span>

              {!closed && (
                <>
                  <div className="flex items-center gap-2">
                    <TimeSelect value={dh.open}  onChange={(v) => handleTimeChange(day.id, 'open', v)} />
                    <span className="text-[12px] text-nxi3">até</span>
                    <TimeSelect value={dh.close} onChange={(v) => handleTimeChange(day.id, 'close', v)} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyToAll(day.id)}
                    title="Aplicar este horário a todos os dias"
                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-transparent px-1.5 py-1 text-[11px] font-semibold text-nxi3 opacity-0 transition-all hover:border-nxborder hover:bg-white hover:text-nxp group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" strokeWidth={2} />
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
        <NxButton variant="ghost" onClick={handleReset} disabled={!isDirty || isUpdating}>
          Descartar alterações
        </NxButton>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || !isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar alterações'}
        </NxButton>
      </FormActions>
    </SectionCard>
  )
}
