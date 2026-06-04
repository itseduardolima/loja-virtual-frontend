'use client'

// PublishCard — espelha o PublishCard de aside.jsx: header "Status do produto"
// + NxBadge do status, segmented control (Rascunho/Ativo/Inativo) só quando
// onStatusChange é fornecido, botão grande de publicar/salvar, ghost "Salvar
// como rascunho" só no create, rodapé de aviso quando !canPublish.
import {
  CheckCircle2,
  CircleSlash,
  FileText,
  Info,
  Rocket,
  Save,
  type LucideIcon,
} from 'lucide-react'
import { NxBadge, NxButton } from './primitives'
import { cn } from '@/lib/utils'

type Status = 'draft' | 'active' | 'inactive'

const STATUS_MAP: Record<
  Status,
  { tone: 'nxi3' | 'nxs' | 'nxw'; label: string; icon: LucideIcon }
> = {
  draft: { tone: 'nxi3', label: 'Rascunho', icon: FileText },
  // lucide 0.294 não tem CircleCheck do protótipo → CheckCircle2 (mesma semântica)
  active: { tone: 'nxs', label: 'Ativo', icon: CheckCircle2 },
  inactive: { tone: 'nxw', label: 'Inativo', icon: CircleSlash },
}

const SEGMENTS: [Status, string][] = [
  ['draft', 'Rascunho'],
  ['active', 'Ativo'],
  ['inactive', 'Inativo'],
]

export function PublishCard({
  mode,
  status,
  onStatusChange,
  onPublish,
  onDraft,
  saving,
  savingDraft = false,
  canPublish,
}: {
  mode: 'create' | 'edit'
  status: Status
  onStatusChange?: (s: Status) => void
  onPublish: () => void
  onDraft?: () => void
  saving: boolean
  savingDraft?: boolean
  canPublish: boolean
}) {
  const sm = STATUS_MAP[status]
  return (
    <div className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12.5px] font-bold text-nxi1">Status do produto</span>
        <NxBadge tone={sm.tone} icon={sm.icon}>
          {sm.label}
        </NxBadge>
      </div>

      {onStatusChange && (
        <div className="mb-3 grid grid-cols-3 gap-1 rounded-lg bg-nxbg p-1">
          {SEGMENTS.map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => onStatusChange(v)}
              className={cn(
                'rounded-md py-1.5 text-[11.5px] font-semibold transition-colors',
                status === v
                  ? 'bg-white text-nxi1 shadow-[0_1px_2px_hsl(0_0%_0%/0.08)]'
                  : 'text-nxi3 hover:text-nxi2',
              )}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* não desabilita por !canPublish: o clique dispara a validação + scroll (decisão do design) */}
        <NxButton
          size="lg"
          icon={Rocket}
          onClick={onPublish}
          loading={saving}
          disabled={savingDraft}
          className="w-full"
        >
          {mode === 'edit' ? 'Salvar alterações' : 'Publicar produto'}
        </NxButton>
        {mode === 'create' && onDraft && (
          <NxButton
            variant="ghost"
            icon={Save}
            onClick={onDraft}
            loading={savingDraft}
            disabled={saving}
            className="w-full"
          >
            Salvar como rascunho
          </NxButton>
        )}
      </div>

      {!canPublish && (
        <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-snug text-nxi3">
          <Info size={12} className="mt-0.5 shrink-0" />
          Preencha os campos obrigatórios (nome, preço, categoria, nicho) para publicar.
        </p>
      )}
    </div>
  )
}
