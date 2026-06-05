/**
 * STATUS_CONFIG local para a página de rastreio público.
 *
 * Os ícones divergem do orderPanelUtils (que usa cores/classes do painel admin/vendedor),
 * por isso mantemos separado nesta fase.
 *
 * TODO: unificar com orderPanelUtils.STATUS_HEADER_COLORS quando os ícones JSX forem
 *       consolidados em um único mapa de configuração compartilhado.
 */
import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

export const STATUS_CONFIG: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  1: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="h-4 w-4" />,
  },
  2: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  3: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Truck className="h-4 w-4" />,
  },
  4: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  5: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="h-4 w-4" />,
  },
}
