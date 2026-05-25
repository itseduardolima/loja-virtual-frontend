'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  FileX2,
  type LucideIcon,
} from 'lucide-react'
import { useToastContext } from '@/contexts/ToastContext'
import { useEmitNfe } from '@/hooks/useEmitNfe'
import { type Order, type NfeStatus } from '@/types/order'
import { cn } from '@/lib/utils'

interface OrderNfeCardProps {
  order: Order
}

interface StatusMeta {
  label: string
  Icon: LucideIcon
  /** Cores aplicadas ao chip + iconBox */
  chip: string
  iconBox: string
  ring: string
  /** Cor de fundo para o card inteiro (subtle) */
  cardBg: string
  cardBorder: string
}

const STATUS_META: Record<NfeStatus, StatusMeta> = {
  em_processo: {
    label: 'Aguardando autorização',
    Icon: Clock,
    chip: 'bg-amber-50 text-amber-800 ring-amber-200',
    iconBox: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-200',
    cardBg: 'bg-amber-50/40',
    cardBorder: 'border-amber-200/60',
  },
  autorizada: {
    label: 'Autorizada',
    Icon: CheckCircle2,
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    iconBox: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-200',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-200',
  },
  denegada: {
    label: 'Denegada',
    Icon: XCircle,
    chip: 'bg-rose-50 text-rose-800 ring-rose-200',
    iconBox: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-200',
    cardBg: 'bg-rose-50/40',
    cardBorder: 'border-rose-200/60',
  },
  cancelada: {
    label: 'Cancelada',
    Icon: FileX2,
    chip: 'bg-gray-100 text-gray-700 ring-gray-300',
    iconBox: 'bg-gray-100 text-gray-600',
    ring: 'ring-gray-200',
    cardBg: 'bg-gray-50/60',
    cardBorder: 'border-gray-200',
  },
}

// ─── Botão de copiar chave NF-e ──────────────────────────────────────────────
function CopyKeyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      title="Copiar chave de acesso"
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
        copied
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700',
      )}
    >
      {copied ? <Check className="h-3 w-3" strokeWidth={3} /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

// ─── Formata chave NF-e em grupos de 4 dígitos pra leitura ───────────────────
function formatNfeKey(key: string): string {
  const cleaned = key.replace(/\D/g, '')
  return cleaned.match(/.{1,4}/g)?.join(' ') ?? key
}

export function OrderNfeCard({ order }: OrderNfeCardProps) {
  const { success, error } = useToastContext()
  const emit = useEmitNfe(order.id)

  const blingSynced = order.bling_sync?.status === 'synced' && !!order.bling_sync.bling_order_id
  const status = order.nfe_status as NfeStatus | null | undefined
  const meta = status ? STATUS_META[status] : null

  // ─── State 1: Bling não sincronizado ──────────────────────────────────────
  if (!blingSynced) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50/50"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 ring-1 ring-inset ring-gray-200">
            <FileX2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[13px] font-bold text-gray-700">
                Nota fiscal eletrônica
              </h4>
              <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-gray-600">
                Indisponível
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
              Conecte sua conta Bling em <span className="font-semibold text-gray-700">Configurações → Integração Bling</span> e aguarde o pedido sincronizar para emitir.
            </p>
          </div>
        </div>
      </motion.section>
    )
  }

  // ─── State 2: Sem NF-e ainda — call to action ─────────────────────────────
  if (!status) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-nxp/15 bg-gradient-to-br from-nxp/[0.04] to-nxp/[0.08] shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]"
      >
        <div className="flex items-start gap-3 px-4 pt-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-nxp shadow-sm ring-1 ring-inset ring-nxp/15">
            <FileText className="h-5 w-5" strokeWidth={1.75} />
            {/* badge "+" sutil */}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-nxp text-[10px] font-bold leading-none text-white ring-2 ring-white">
              +
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[13px] font-bold text-nxi1">
                Nota fiscal eletrônica
              </h4>
              <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxp ring-1 ring-inset ring-nxp/20">
                Pronta para emitir
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-nxi2">
              O Bling assume os dados fiscais. Status volta automaticamente após autorização da SEFAZ.
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-nxp/10 bg-white/40 px-4 py-2.5">
          <button
            type="button"
            disabled={emit.isPending}
            onClick={async () => {
              try {
                await emit.mutateAsync()
                success('Solicitação de NF-e enviada ao Bling. Aguardando autorização da SEFAZ.')
              } catch (e: any) {
                error(e?.response?.data?.message ?? 'Não foi possível solicitar a NF-e')
              }
            }}
            className={cn(
              'group inline-flex w-full items-center justify-between gap-2 rounded-lg bg-nxp px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)]',
              'transition-all hover:bg-nxp/90 disabled:cursor-not-allowed disabled:bg-nxp/40',
            )}
          >
            <span className="inline-flex items-center gap-2">
              {emit.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
              {emit.isPending ? 'Solicitando emissão…' : 'Emitir NF-e via Bling'}
            </span>
            {!emit.isPending && (
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            )}
          </button>
        </div>
      </motion.section>
    )
  }

  // ─── State 3: NF-e emitida — exibe status + dados + downloads ─────────────
  const Icon = meta?.Icon ?? AlertCircle
  const m = meta!
  const hasDownloads = !!(order.nfe_url_pdf || order.nfe_url_xml)

  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'overflow-hidden rounded-xl border shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]',
        m.cardBg,
        m.cardBorder,
      )}
    >
      {/* Header com status */}
      <header className="flex items-start gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset', m.iconBox, m.ring)}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[13px] font-bold text-gray-900">Nota fiscal eletrônica</h4>
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset whitespace-nowrap', m.chip)}>
              <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
              {m.label}
            </span>
          </div>

          {/* Número + Série em destaque */}
          {order.nfe_number && (
            <div className="mt-1.5 flex items-baseline gap-3 font-mono">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-gray-400">nº</span>
                <span className="ml-1 text-[14px] font-bold tabular-nums text-gray-900">{order.nfe_number}</span>
              </div>
              {order.nfe_serie && (
                <>
                  <span className="text-gray-300">·</span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-gray-400">série</span>
                    <span className="ml-1 text-[12.5px] font-bold tabular-nums text-gray-700">{order.nfe_serie}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Chave de acesso */}
      {order.nfe_chave && (
        <div className="px-4 py-3">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-gray-500">
            Chave de acesso
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-2 ring-1 ring-inset ring-gray-200">
            <code className="min-w-0 flex-1 break-all font-mono text-[11px] leading-snug tracking-tight text-gray-800">
              {formatNfeKey(order.nfe_chave)}
            </code>
            <CopyKeyButton value={order.nfe_chave} />
          </div>
        </div>
      )}

      {/* Downloads */}
      {hasDownloads && (
        <footer className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200/50">
          {order.nfe_url_pdf ? (
            <a
              href={order.nfe_url_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-white px-3 py-2.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-nxp/[0.04] hover:text-nxp"
            >
              <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-px" strokeWidth={2} />
              <span>
                DANFE <span className="font-mono text-[10.5px] text-gray-400 group-hover:text-nxp/70">.pdf</span>
              </span>
            </a>
          ) : (
            <div />
          )}
          {order.nfe_url_xml ? (
            <a
              href={order.nfe_url_xml}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-white px-3 py-2.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-nxp/[0.04] hover:text-nxp"
            >
              <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-px" strokeWidth={2} />
              <span>
                XML <span className="font-mono text-[10.5px] text-gray-400 group-hover:text-nxp/70">.xml</span>
              </span>
            </a>
          ) : (
            <div />
          )}
        </footer>
      )}
    </motion.section>
  )
}
