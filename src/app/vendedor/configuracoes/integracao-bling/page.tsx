'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle,
  XCircle,
  Plug,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react'
import LoadingPage from '@/components/Layout/LoadingPage'
import FeatureLocked from '@/components/Layout/FeatureLocked'
import { useToastContext } from '@/contexts/ToastContext'
import {
  useBlingStatus,
  useBlingConnect,
  useBlingDisconnect,
  useBlingToggleSync,
  type BlingSync,
} from '@/hooks/useBlingStatus'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { formatDate } from '@/lib/utils'
import { BlingImportCard } from '@/components/Bling/BlingImportCard'
import {
  Switch as DesignSwitch,
  SectionCard,
  SectionHeader,
  NxButton,
} from '../_shared'

function SyncStatusBadge({ status }: { status: BlingSync['status'] }) {
  if (status === 'synced') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-nxs/30 bg-nxs/[0.07] px-2 py-0.5 text-[11px] font-semibold text-nxs">
        <CheckCircle className="h-3 w-3" />
        Sincronizado
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-nxd/30 bg-nxd/[0.07] px-2 py-0.5 text-[11px] font-semibold text-nxd">
        <XCircle className="h-3 w-3" />
        Erro
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-nxw/30 bg-nxw/[0.10] px-2 py-0.5 text-[11px] font-semibold text-nxw">
      <RefreshCw className="h-3 w-3" />
      Pendente
    </span>
  )
}

// Avatar de status circular com ícone (lado esquerdo do item)
function SyncStatusAvatar({ status }: { status: BlingSync['status'] }) {
  if (status === 'synced') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxs/10 text-nxs ring-1 ring-inset ring-nxs/15">
        <CheckCircle size={16} strokeWidth={2.25} />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxd/10 text-nxd ring-1 ring-inset ring-nxd/15">
        <XCircle size={16} strokeWidth={2.25} />
      </div>
    )
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxw/10 text-nxw ring-1 ring-inset ring-nxw/15">
      <RefreshCw size={16} strokeWidth={2.25} />
    </div>
  )
}

function BlingLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 32 : size === 'lg' ? 60 : 40
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl font-extrabold text-amber-900 shadow-[0_1px_2px_hsl(0_0%_0%/0.06)]"
      style={{
        width: dim,
        height: dim,
        background: 'linear-gradient(135deg, #FFE066 0%, #FFD64D 100%)',
        fontSize: dim * 0.55,
        lineHeight: 1,
      }}
      aria-label="Bling"
    >
      b
    </div>
  )
}

export default function IntegracaoBlingPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { success: showSuccess, error: showError } = useToastContext()
  const { features, isLoading: isLoadingFeatures } = usePlanFeatures()

  const blingEnabled = features.feature_bling_integration

  useEffect(() => {
    if (!isLoadingFeatures && !blingEnabled) {
      queryClient.removeQueries({ queryKey: ['bling-status'] })
    }
  }, [blingEnabled, isLoadingFeatures, queryClient])

  const { data: blingStatus, isLoading } = useBlingStatus(blingEnabled)
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

  if (isLoadingFeatures) return <LoadingPage />

  if (!blingEnabled) {
    return (
      <FeatureLocked
        title="Integração Bling não está no seu plano"
        description="Faça upgrade para conectar sua loja ao Bling ERP e sincronizar pedidos automaticamente."
        feature="feature_bling_integration"
      />
    )
  }

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-5 w-5 animate-spin text-nxi3" />
        </div>
      </SectionCard>
    )
  }

  const connected = !!blingStatus?.connected

  return (
    <div className="flex flex-col gap-4">
      <SectionCard>
        <SectionHeader
          title="Integração Bling"
          description="Sincronize produtos, estoque e pedidos com seu ERP automaticamente."
          right={
            connected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-nxs/[0.10] px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em] text-nxs">
                <CheckCircle className="h-3 w-3" />
                Conectado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-nxbg px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.04em] text-nxi3">
                <XCircle className="h-3 w-3" />
                Desconectado
              </span>
            )
          }
        />

        {!connected ? (
          /* Estado: Desconectado */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <BlingLogo size="lg" />
            <div className="max-w-md">
              <h4 className="text-[18px] font-extrabold tracking-[-0.02em] text-nxi1">
                Conecte sua conta do Bling
              </h4>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-nxi2">
                A integração mantém produtos, preços, estoque e pedidos sempre sincronizados
                entre sua loja e o ERP — sem precisar mexer em nada.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Sincronia automática',
                'OAuth seguro',
                'NF-e automática',
              ].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full bg-nxs/[0.10] px-3 py-1 text-[11.5px] font-semibold text-nxs"
                >
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-nxs text-white">
                    <CheckCircle size={10} strokeWidth={3} />
                  </span>
                  {f}
                </span>
              ))}
            </div>

            <NxButton
              variant="primary"
              onClick={() => connectMutation.mutate()}
              loading={connectMutation.isPending}
              className="mt-2"
            >
              <Plug className="h-4 w-4" />
              {connectMutation.isPending ? 'Redirecionando...' : 'Conectar com OAuth'}
            </NxButton>
          </div>
        ) : (
          /* Estado: Conectado */
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-nxborder bg-nxbg/40 p-3">
              <BlingLogo size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-nxs/[0.10] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-nxs">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-nxs" />
                    Conectado
                  </span>
                  {blingStatus?.connectedAt && (
                    <span className="text-[12px] text-nxi3">
                      desde {formatDate(blingStatus.connectedAt)}
                    </span>
                  )}
                </div>
              </div>
              <NxButton
                variant="danger"
                onClick={() => disconnectMutation.mutate()}
                loading={disconnectMutation.isPending}
              >
                <LogOut className="h-3.5 w-3.5" />
                {disconnectMutation.isPending ? 'Desconectando...' : 'Desconectar'}
              </NxButton>
            </div>

            {/* Toggle de sync automático */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-nxborder px-4 py-3.5">
              <div>
                <div className="text-[14px] font-bold tracking-[-0.005em] text-nxi1">
                  Sincronização automática
                </div>
                <div className="mt-0.5 text-[12.5px] text-nxi2">
                  Novos pedidos são enviados ao Bling automaticamente.
                </div>
              </div>
              <DesignSwitch
                checked={!!blingStatus?.syncEnabled}
                onChange={(v) => toggleSyncMutation.mutate(v)}
                disabled={toggleSyncMutation.isPending}
                ariaLabel="Sincronização automática"
              />
            </div>

          </div>
        )}
      </SectionCard>

      {/* Bulk import + Últimas sincronizações lado a lado em telas grandes */}
      {connected && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
          <BlingImportCard />

          {(blingStatus?.recentSyncs?.length ?? 0) > 0 ? (
            <div className="rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
              {/* Header com ícone + contador */}
              <div className="flex items-start gap-3 border-b border-nxborder px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxs/10 text-nxs">
                  <RefreshCw size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
                    Últimas sincronizações
                  </h3>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-nxi2">
                    Pedidos enviados ao Bling automaticamente.
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-nxbg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-nxi2">
                  {Math.min(4, blingStatus!.recentSyncs.length)} recente
                  {blingStatus!.recentSyncs.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Lista de sincronizações */}
              <ul className="flex flex-col">
                {blingStatus!.recentSyncs.slice(0, 4).map((sync) => (
                  <li
                    key={sync.orderId}
                    className="group flex items-center gap-3 border-b border-nxborder/60 px-5 py-3 transition-colors last:border-0 hover:bg-nxbg/50"
                  >
                    <SyncStatusAvatar status={sync.status} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-semibold text-nxi1">
                          Pedido #{sync.orderCode ?? sync.orderId}
                        </p>
                        {sync.status === 'synced' && sync.blingOrderId && (
                          <span className="hidden rounded-md bg-nxbg px-1.5 py-0.5 font-mono text-[10.5px] text-nxi3 sm:inline">
                            Bling {sync.blingOrderId}
                          </span>
                        )}
                      </div>
                      {sync.status === 'error' && sync.errorMessage && (
                        <p
                          className="truncate text-[11.5px] font-medium text-nxd"
                          title={sync.errorMessage}
                        >
                          {sync.errorMessage}
                        </p>
                      )}
                      <p className="mt-0.5 text-[11px] text-nxi3">
                        {formatDate(sync.createdAt)}
                      </p>
                    </div>

                    <SyncStatusBadge status={sync.status} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col rounded-2xl border border-dashed border-nxborder bg-gradient-to-br from-white to-nxbg/30 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
              {/* Header alinhado com o card de importar (padronização visual) */}
              <div className="flex items-start gap-3 border-b border-nxborder/70 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxs/10 text-nxs">
                  <RefreshCw size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-base font-bold tracking-[-0.01em] text-nxi1">
                    Últimas sincronizações
                  </h3>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-nxi2">
                    Aguardando primeiro pedido sincronizado.
                  </p>
                </div>
              </div>

              {/* Empty state visual */}
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-nxp/10" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-nxp/10 text-nxp ring-4 ring-nxp/[0.06]">
                    <RefreshCw size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="max-w-[280px]">
                  <p className="text-[13.5px] font-semibold text-nxi1">
                    Pronto para sincronizar
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-nxi2">
                    Os próximos pedidos criados serão enviados ao Bling automaticamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Como funciona */}
      {!connected && (
        <SectionCard>
          <SectionHeader title="Como funciona" />
          <ul className="flex flex-col gap-2.5 text-[13px] text-nxi2">
            {[
              'Pedidos criados na plataforma são sincronizados automaticamente para o seu Bling.',
              'Atualizações de status feitas no Bling refletem automaticamente aqui.',
              'Emita NF-e diretamente no Bling com o seu CNPJ e certificado digital.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle size={14} className="mt-0.5 shrink-0 text-nxs" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-nxp" />
              <span className="leading-relaxed">
                Necessário ter uma conta ativa no Bling ERP com CNPJ e certificado digital.
              </span>
            </li>
          </ul>
        </SectionCard>
      )}
    </div>
  )
}
