'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Package, ShoppingCart, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface ImportButtonProps {
  type: BlingImportType
  label: string
  icon: React.ReactNode
  pending: boolean
  onClick: () => void
  disabled?: boolean
}

function ImportButton({ type, label, icon, pending, onClick, disabled }: ImportButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || pending}
      variant="outline"
      className="gap-2 flex-1 min-w-[180px]"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </Button>
  )
}

interface JobProgressProps {
  job: BlingImportJob
}

function JobProgress({ job }: JobProgressProps) {
  const pct = progressPercent(job)
  const isError = job.status === 'error'
  const isComplete = job.status === 'completed'
  const running = isRunning(job)

  const typeLabel = job.type === 'products' ? 'produtos' : 'pedidos'
  const Icon = isError ? AlertCircle : isComplete ? CheckCircle : Loader2

  return (
    <div className="space-y-2 mt-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Icon
            className={`h-4 w-4 ${
              isError ? 'text-red-600' : isComplete ? 'text-green-600' : 'text-blue-600 animate-spin'
            }`}
          />
          <span>
            {running && `Importando ${typeLabel}…`}
            {isComplete && `Importação de ${typeLabel} concluída`}
            {isError && `Importação de ${typeLabel} falhou`}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-500">
          {job.processed} / {job.total || '?'}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`h-full ${isError ? 'bg-red-500' : isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
        />
      </div>

      {job.errorsCount > 0 && (
        <p className="text-xs text-red-600">
          {job.errorsCount} {job.errorsCount === 1 ? 'erro' : 'erros'} durante a importação
        </p>
      )}
    </div>
  )
}

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

  // Mostra o último job de cada tipo (rodando ou recente) pra contexto
  const latestProducts = liveProducts ?? jobs?.find((j) => j.type === 'products')
  const latestOrders = liveOrders ?? jobs?.find((j) => j.type === 'orders')

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="h-4 w-4" />
          Importar do Bling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Trazer catálogo e pedidos já existentes no Bling pra cá. Roda em segundo
          plano — você pode fechar essa página.
        </p>

        <div className="flex flex-wrap gap-2">
          <ImportButton
            type="products"
            label="Importar produtos"
            icon={<Package className="h-4 w-4" />}
            pending={productsImport.isPending}
            onClick={handleProducts}
            disabled={!!productsRunning}
          />
          <ImportButton
            type="orders"
            label="Importar pedidos"
            icon={<ShoppingCart className="h-4 w-4" />}
            pending={ordersImport.isPending}
            onClick={() => setOrdersDialogOpen(true)}
            disabled={!!ordersRunning}
          />
        </div>

        {latestProducts && <JobProgress job={latestProducts} />}
        {latestOrders && <JobProgress job={latestOrders} />}

        <Dialog open={ordersDialogOpen} onOpenChange={setOrdersDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Importar pedidos do Bling</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-sm text-gray-600">
                Escolha o período. Deixe em branco pra importar tudo (pode demorar).
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="dateFrom" className="text-xs">De</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo" className="text-xs">Até</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOrdersDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleOrders} disabled={ordersImport.isPending}>
                {ordersImport.isPending ? 'Iniciando…' : 'Iniciar importação'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
