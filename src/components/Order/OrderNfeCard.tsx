'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToastContext } from '@/contexts/ToastContext'
import { useEmitNfe } from '@/hooks/useEmitNfe'
import { type Order, type NfeStatus } from '@/types/order'

interface OrderNfeCardProps {
  order: Order
}

interface StatusMeta {
  label: string
  className: string
  Icon: React.ComponentType<{ className?: string }>
}

const STATUS_META: Record<NfeStatus, StatusMeta> = {
  em_processo: {
    label: 'Aguardando autorização',
    className: 'text-yellow-700 border-yellow-200 bg-yellow-50',
    Icon: Clock,
  },
  autorizada: {
    label: 'Autorizada',
    className: 'text-green-700 border-green-200 bg-green-50',
    Icon: CheckCircle,
  },
  denegada: {
    label: 'Denegada',
    className: 'text-red-700 border-red-200 bg-red-50',
    Icon: XCircle,
  },
  cancelada: {
    label: 'Cancelada',
    className: 'text-gray-700 border-gray-200 bg-gray-50',
    Icon: XCircle,
  },
}

export function OrderNfeCard({ order }: OrderNfeCardProps) {
  const { success, error } = useToastContext()
  const emit = useEmitNfe(order.id)

  const blingSynced = order.bling_sync?.status === 'synced' && !!order.bling_sync.bling_order_id
  const status = order.nfe_status as NfeStatus | null | undefined
  const meta = status ? STATUS_META[status] : null

  // Sem sincronização Bling: mostra estado bloqueado mas explicado
  if (!blingSynced) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-1"
      >
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FileText className="h-4 w-4" />
          <span className="font-medium">NF-e indisponível</span>
        </div>
        <p className="text-xs text-gray-500">
          Conecte o Bling e aguarde o pedido sincronizar pra emitir nota fiscal.
        </p>
      </motion.div>
    )
  }

  // Sem NF-e ainda — mostrar botão de emitir
  if (!status) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-blue-900 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Nota fiscal eletrônica
          </div>
          <Button
            size="sm"
            onClick={async () => {
              try {
                await emit.mutateAsync()
                success('Solicitação de NF-e enviada ao Bling. Aguardando autorização da SEFAZ.')
              } catch (e: any) {
                error(e?.response?.data?.message ?? 'Não foi possível solicitar a NF-e')
              }
            }}
            disabled={emit.isPending}
            className="gap-1.5"
          >
            {emit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Emitir NF-e
          </Button>
        </div>
        <p className="text-xs text-blue-800/70">
          Bling assume os dados fiscais e dispara emissão. Status volta automaticamente via webhook.
        </p>
      </motion.div>
    )
  }

  // Com NF-e — mostra status + links
  const Icon = meta?.Icon ?? AlertCircle
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-3 space-y-3"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-gray-900 text-sm font-medium">
          <FileText className="h-4 w-4" />
          Nota fiscal eletrônica
          {order.nfe_number && (
            <span className="text-xs text-gray-500 font-mono">
              nº {order.nfe_number}
              {order.nfe_serie && ` · série ${order.nfe_serie}`}
            </span>
          )}
        </div>
        {meta && (
          <Badge variant="outline" className={`gap-1 text-xs ${meta.className}`}>
            <Icon className="h-3 w-3" />
            {meta.label}
          </Badge>
        )}
      </div>

      {order.nfe_chave && (
        <p className="text-xs text-gray-500 font-mono break-all">
          {order.nfe_chave}
        </p>
      )}

      {(order.nfe_url_pdf || order.nfe_url_xml) && (
        <div className="flex flex-wrap gap-2">
          {order.nfe_url_pdf && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(order.nfe_url_pdf!, '_blank', 'noopener')}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              DANFE (PDF)
            </Button>
          )}
          {order.nfe_url_xml && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(order.nfe_url_xml!, '_blank', 'noopener')}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              XML
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
