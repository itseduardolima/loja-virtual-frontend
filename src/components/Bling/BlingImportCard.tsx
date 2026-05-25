'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToastContext } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'
import {
  useBlingImports,
  useBlingImportJob,
  useBlingProductsImport,
  useBlingOrdersImport,
  type BlingImportJob,
  type BlingImportType,
} from '@/hooks/useBlingImport'

const isRunning = (job?: BlingImportJob | null): boolean =>
  !!job && (job.status === 'running' || job.status === 'pending')

const progressPercent = (job: BlingImportJob): number => {
  if (job.total === 0) return job.status === 'completed' ? 100 : 0
  return Math.min(100, Math.round((job.processed / job.total) * 100))
}

function relativeTime(date?: string | Date | null) {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  if (diff < 60_000) return 'agora'
  const min = Math.floor(diff / 60_000)
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const days = Math.floor(h / 24)
  if (days < 30) return `há ${days} dia${days > 1 ? 's' : ''}`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

// ─── Linha de importação por tipo ────────────────────────────────────────────
interface ImportRowProps {
  type: BlingImportType
  Icon: React.ElementType
  title: string
  description: string
  toneClasses: { bg: string; text: string; ring: string }
  job?: BlingImportJob | null
  pending: boolean
  running: boolean
  onClick: () => void
}

function ImportRow({
  Icon,
  title,
  description,
  toneClasses,
  job,
  pending,
  running,
  onClick,
}: ImportRowProps) {
  const pct = job ? progressPercent(job) : 0
  const isError = job?.status === 'error'
  const isComplete = job?.status === 'completed'

  // Status line
  let status: React.ReactNode = (
    <span className="text-[12px] text-nxi3">{description}</span>
  )
  if (running && job) {
    status = (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-nxp">
        <Loader2 size={12} className="animate-spin" />
        Importando… {job.processed}/{job.total || '?'}
      </span>
    )
  } else if (isComplete && job) {
    status = (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-nxi2">
        <CheckCircle size={12} className="text-nxs" strokeWidth={2.5} />
        <span className="text-nxs font-semibold">{job.processed}</span>{' '}
        importados {relativeTime(job.finishedAt ?? job.createdAt)}
      </span>
    )
  } else if (isError) {
    status = (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-nxd font-semibold">
        <AlertCircle size={12} strokeWidth={2.5} />
        Última tentativa falhou
      </span>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-nxborder bg-white p-3.5 transition-all',
        'hover:border-nxp/30 hover:shadow-[0_2px_8px_hsl(0_0%_0%/0.04)]',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
            toneClasses.bg,
            toneClasses.text,
            toneClasses.ring,
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-bold tracking-[-0.005em] text-nxi1">
            {title}
          </div>
          <div className="mt-0.5">{status}</div>
        </div>

        <button
          type="button"
          onClick={onClick}
          disabled={pending || running}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-nxp px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)] transition-all',
            'hover:bg-nxp/90 disabled:cursor-not-allowed disabled:bg-nxp/40',
          )}
        >
          {pending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} strokeWidth={2.5} />
          )}
          {pending ? 'Iniciando…' : running ? 'Em andamento' : 'Importar'}
        </button>
      </div>

      {/* Progress bar (apenas quando rodando) */}
      {job && running && (
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-nxbg">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-nxp to-nxp/70"
            />
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-nxi3">
            <span>{pct}% concluído</span>
            {job.errorsCount > 0 && (
              <span className="font-semibold text-nxd">
                {job.errorsCount} erro{job.errorsCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Card principal ──────────────────────────────────────────────────────────
export function BlingImportCard() {
  const { success, error } = useToastContext()
  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data: jobs } = useBlingImports()
  const productsRunning = useMemo(
    () => jobs?.find((j) => j.type === 'products' && isRunning(j)),
    [jobs],
  )
  const ordersRunning = useMemo(
    () => jobs?.find((j) => j.type === 'orders' && isRunning(j)),
    [jobs],
  )

  const { data: liveProducts } = useBlingImportJob(
    productsRunning?.id ?? null,
    !!productsRunning,
  )
  const { data: liveOrders } = useBlingImportJob(
    ordersRunning?.id ?? null,
    !!ordersRunning,
  )

  const productsImport = useBlingProductsImport()
  const ordersImport = useBlingOrdersImport()

  const handleProducts = async () => {
    try {
      await productsImport.mutateAsync()
      success('Importação de produtos iniciada!')
    } catch (e: any) {
      error(e?.response?.data?.message ?? 'Falha ao iniciar importação')
    }
  }

  const handleOrders = async () => {
    try {
      await ordersImport.mutateAsync({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
      success('Importação de pedidos iniciada!')
      setOrdersDialogOpen(false)
    } catch (e: any) {
      error(e?.response?.data?.message ?? 'Falha ao iniciar importação')
    }
  }

  const latestProducts = liveProducts ?? jobs?.find((j) => j.type === 'products')
  const latestOrders = liveOrders ?? jobs?.find((j) => j.type === 'orders')

  return (
    <div className="rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      {/* Header com ícone destacado */}
      <div className="flex items-start gap-3 border-b border-nxborder px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxp/10 text-nxp">
          <Download size={18} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
            Importar do Bling
          </h3>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-nxi2">
            Sincroniza catálogo e pedidos já existentes. Roda em segundo plano.
          </p>
        </div>
      </div>

      {/* Body com as duas linhas de importação */}
      <div className="flex flex-col gap-2.5 p-5">
        <ImportRow
          type="products"
          Icon={Package}
          title="Produtos"
          description="Catálogo, preços e variações"
          toneClasses={{
            bg: 'bg-nxp/[0.08]',
            text: 'text-nxp',
            ring: 'ring-nxp/15',
          }}
          job={latestProducts}
          pending={productsImport.isPending}
          running={!!productsRunning}
          onClick={handleProducts}
        />

        <ImportRow
          type="orders"
          Icon={ShoppingCart}
          title="Pedidos"
          description="Histórico de pedidos do Bling"
          toneClasses={{
            bg: 'bg-nxa/[0.10]',
            text: 'text-nxa',
            ring: 'ring-nxa/15',
          }}
          job={latestOrders}
          pending={ordersImport.isPending}
          running={!!ordersRunning}
          onClick={() => setOrdersDialogOpen(true)}
        />
      </div>

      <Dialog open={ordersDialogOpen} onOpenChange={setOrdersDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-nxborder">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold tracking-[-0.01em] text-nxi1">
              <Calendar size={16} className="text-nxp" />
              Importar pedidos do Bling
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-[13px] leading-relaxed text-nxi2">
              Escolha o período. Deixe em branco para importar tudo (pode demorar).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dateFrom" className="text-[12.5px] font-semibold text-nxi2">
                  De
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 rounded-lg border-nxborder text-[13px] text-nxi1 focus-visible:border-nxp focus-visible:ring-2 focus-visible:ring-nxp/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateTo" className="text-[12.5px] font-semibold text-nxi2">
                  Até
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 rounded-lg border-nxborder text-[13px] text-nxi1 focus-visible:border-nxp focus-visible:ring-2 focus-visible:ring-nxp/30"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setOrdersDialogOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-nxborder bg-white px-3.5 py-2 text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxp/40 hover:text-nxp"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleOrders}
              disabled={ordersImport.isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-nxp px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.25)] transition-colors hover:bg-nxp/90 disabled:cursor-not-allowed disabled:bg-nxp/40"
            >
              {ordersImport.isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ArrowRight size={13} strokeWidth={2.5} />
              )}
              {ordersImport.isPending ? 'Iniciando…' : 'Iniciar importação'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
