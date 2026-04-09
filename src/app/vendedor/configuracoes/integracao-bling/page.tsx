'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle,
  XCircle,
  Plug,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useToastContext } from '@/contexts/ToastContext'
import {
  useBlingStatus,
  useBlingConnect,
  useBlingDisconnect,
  useBlingToggleSync,
  type BlingSync,
} from '@/hooks/useBlingStatus'
import { formatDate } from '@/lib/utils'

function SyncStatusBadge({ status }: { status: BlingSync['status'] }) {
  if (status === 'synced') {
    return (
      <Badge variant="outline" className="gap-1 text-green-700 border-green-200 bg-green-50">
        <CheckCircle className="h-3 w-3" />
        Sincronizado
      </Badge>
    )
  }
  if (status === 'error') {
    return (
      <Badge variant="outline" className="gap-1 text-red-700 border-red-200 bg-red-50">
        <XCircle className="h-3 w-3" />
        Erro
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-yellow-700 border-yellow-200 bg-yellow-50">
      <RefreshCw className="h-3 w-3" />
      Pendente
    </Badge>
  )
}

export default function IntegracaoBlingPage() {
  const searchParams = useSearchParams()
  const { success: showSuccess, error: showError } = useToastContext()

  const { data: blingStatus, isLoading } = useBlingStatus()
  const connectMutation = useBlingConnect()
  const disconnectMutation = useBlingDisconnect()
  const toggleSyncMutation = useBlingToggleSync()

  const handledRef = useRef(false)
  useEffect(() => {
    if (handledRef.current) return
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    if (connected === 'true' || error === 'true') {
      handledRef.current = true
      if (connected === 'true') showSuccess('Bling conectado com sucesso!')
      if (error === 'true') showError('Erro ao conectar o Bling. Tente novamente.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, showSuccess, showError])

  if (isLoading) return <LoadingPage />

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">
          Integração Bling
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Sincronize seus pedidos com o Bling ERP e emita NF-e com seu próprio CNPJ e
          certificado digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-start">

        {/* Status card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Status da conexão</span>
              {blingStatus?.connected ? (
                <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-gray-500">
                  <XCircle className="h-3.5 w-3.5" />
                  Não conectado
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blingStatus?.connected ? (
              <>
                {blingStatus.connectedAt && (
                  <p className="text-sm text-gray-500">
                    Conectado em: <span className="font-medium text-gray-700">{formatDate(blingStatus.connectedAt)}</span>
                  </p>
                )}

                {/* Toggle sync */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sincronização automática</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Novos pedidos são enviados ao Bling automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={blingStatus.syncEnabled}
                    onCheckedChange={(checked) => toggleSyncMutation.mutate(checked)}
                    disabled={toggleSyncMutation.isPending}
                  />
                </div>

                {/* Disconnect */}
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    {disconnectMutation.isPending ? 'Desconectando...' : 'Desconectar Bling'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Clique em <strong>Conectar com Bling</strong> para autorizar a integração. Você
                  será redirecionado para a página do Bling para confirmar o acesso.
                </p>
                <Button
                  onClick={() => connectMutation.mutate()}
                  disabled={connectMutation.isPending}
                  className="gap-2"
                >
                  <Plug className="h-4 w-4" />
                  {connectMutation.isPending ? 'Redirecionando...' : 'Conectar com Bling'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Como funciona */}
        {!blingStatus?.connected && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Como funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Pedidos criados na plataforma são sincronizados automaticamente para o seu Bling</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Atualizações de status feitas no Bling refletem automaticamente aqui</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Emita NF-e diretamente no Bling com o seu CNPJ e certificado digital</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>Necessário ter uma conta ativa no Bling ERP com CNPJ e certificado digital configurados</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recent syncs */}
        {blingStatus?.connected && blingStatus.recentSyncs.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Últimas sincronizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blingStatus.recentSyncs.map((sync) => (
                  <div
                    key={sync.orderId}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Pedido #{sync.orderCode ?? sync.orderId}
                      </p>
                      {sync.status === 'synced' && sync.blingOrderId && (
                        <p className="text-xs text-gray-400">Bling ID: {sync.blingOrderId}</p>
                      )}
                      {sync.status === 'error' && sync.errorMessage && (
                        <p className="text-xs text-red-500 truncate" title={sync.errorMessage}>
                          {sync.errorMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(sync.createdAt)}</p>
                    </div>
                    <SyncStatusBadge status={sync.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty syncs state */}
        {blingStatus?.connected && blingStatus.recentSyncs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-400 text-sm">
              Nenhuma sincronização realizada ainda. Os próximos pedidos criados serão
              sincronizados automaticamente.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
