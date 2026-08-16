'use client'

import { Suspense } from 'react'
import {
  Mail, User, Store,
  Clock, CheckCircle, Truck, PackageCheck, XCircle,
  SearchX, ShoppingBag, Hourglass, Info,
} from 'lucide-react'
import { buildImageUrl, formatDate, formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useRastrearPage } from './useRastrearPage'
import { OrderSkeleton } from './_components/OrderSkeleton'
import { SearchHero } from './_components/SearchHero'
import { ProgressStepper } from './_components/ProgressStepper'
import { CancelModal } from './_components/CancelModal'
import {
  STATUS_CONFIG,
  TONE_BG,
  TONE_TEXT,
  TONE_BORDER_BG,
  TONE_BADGE_BG,
  type StatusKey,
} from './_components/statusConfig'
import Link from 'next/link'
import { IconWhatsApp } from '@/assets/icons'

const STATUS_ICONS: Record<StatusKey, React.ElementType> = {
  1: Clock,
  2: CheckCircle,
  3: Truck,
  4: PackageCheck,
  5: XCircle,
}

const IDLE_CARDS: { icon: React.ElementType; iconColor: string; bgColor: string; title: string; desc: string }[] = [
  { icon: Mail,           iconColor: 'text-nxp',       bgColor: 'bg-nxp/[0.08]',      title: 'No seu e-mail',  desc: 'Enviamos o código no e-mail de confirmação do pedido.' },
  { icon: IconWhatsApp,   iconColor: 'text-[#25D366]', bgColor: 'bg-[#25D366]/[0.08]', title: 'No WhatsApp',   desc: 'A loja também manda o código pela conversa do pedido.' },
  { icon: User,           iconColor: 'text-nxp',       bgColor: 'bg-nxp/[0.08]',      title: 'Na sua conta',   desc: 'Veja todos os seus pedidos e códigos em "Minha conta".' },
]

function RastrearPedidoContent() {
  const {
    inputCode,
    setInputCode,
    handleSearch,
    order,
    history,
    isLoading,
    error,
    hasSearched,
    showCancelDialog,
    isCancelling,
    cancelError,
    cancelResult,
    canCancel,
    cancelNeedsApproval,
    blockedCancelReason,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
  } = useRastrearPage()

  // derive view state
  const view = !hasSearched ? 'idle' : isLoading ? 'loading' : error ? 'error' : order ? 'result' : 'idle'

  const st = order ? STATUS_CONFIG[order.status as StatusKey] : null
  const StatusIcon = order ? STATUS_ICONS[order.status as StatusKey] : null

  return (
    <div className="min-h-screen bg-nxbg">
      <SearchHero
        code={inputCode}
        setCode={setInputCode}
        onSearch={handleSearch}
        loading={isLoading}
        hasResult={view === 'result'}
      />

      {/* idle — 3 info cards */}
      {view === 'idle' && (
        <div className="mx-auto max-w-[1040px] px-5 py-12 md:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {IDLE_CARDS.map(({ icon: Icon, iconColor, bgColor, title, desc }, i) => (
              <div
                key={title}
                className="rt-rise rounded-2xl border border-nxborder bg-white p-5"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', bgColor, iconColor)}>
                  <Icon size={18} />
                </span>
                <p className="mt-3 text-[13.5px] font-extrabold text-nxi1">{title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-nxi3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* loading */}
      {view === 'loading' && <OrderSkeleton />}

      {/* error */}
      {view === 'error' && (
        <div className="mx-auto max-w-[520px] px-5 py-14 text-center">
          <div className="rt-rise mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-nxd shadow-sm ring-1 ring-nxborder">
            <SearchX size={28} />
          </div>
          <h2 className="rt-rise mt-4 text-[18px] font-extrabold tracking-tight text-nxi1" style={{ animationDelay: '.05s' }}>
            Pedido não encontrado
          </h2>
          <p className="rt-rise mx-auto mt-1.5 max-w-[38ch] text-[13.5px] leading-relaxed text-nxi2" style={{ animationDelay: '.1s' }}>
            Não encontramos nenhum pedido com o código{' '}
            <b className="font-mono text-nxi1">{inputCode}</b>. Confira no e-mail de confirmação ou no WhatsApp da loja.
          </p>
          <div className="rt-rise mt-5 flex items-center justify-center gap-2" style={{ animationDelay: '.15s' }}>
            <button
              onClick={() => { setInputCode('') }}
              className="rounded-full border border-nxborder bg-white px-5 py-2.5 text-[13px] font-bold text-nxi1 transition-colors hover:border-nxp hover:text-nxp"
            >
              Tentar outro código
            </button>
          </div>
        </div>
      )}

      {/* result */}
      {view === 'result' && order && st && StatusIcon && (
        <div className="mx-auto max-w-[1040px] px-5 py-10 md:px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

            {/* coluna esquerda */}
            <div className="space-y-6">

              {/* status banner */}
              <div className={cn('rt-rise flex items-center gap-4 rounded-2xl border p-5', TONE_BORDER_BG[st.tone])}>
                <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white', TONE_BG[st.tone])}>
                  <StatusIcon size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-extrabold tracking-tight text-nxi1">{st.label}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-nxi2">{st.desc}</p>
                </div>
              </div>

              {/*
                Cancelamento em duas etapas: enquanto a loja não aprovar, o pedido
                CONTINUA valendo e o status acima segue "Confirmado". Sem este aviso
                o cliente sai achando que já está cancelado.
              */}
              {cancelResult === 'requested' && (
                <div className="rt-rise rounded-2xl border border-nxw/30 bg-nxw/[0.07] p-5">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-nxw text-white">
                      <Hourglass size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold tracking-tight text-nxi1">
                        Cancelamento solicitado — aguardando a loja
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-nxi2">
                        A loja <b className="text-nxi1">{order.store?.name}</b> foi avisada do seu
                        pedido de cancelamento.{' '}
                        <b className="text-nxi1">O pedido ainda não está cancelado</b>: ele só é
                        cancelado quando a loja aprovar a solicitação.
                      </p>
                    </div>
                  </div>
                  <ol className="mt-4 space-y-2 border-t border-nxw/25 pt-4">
                    <li className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-nxi2">
                      <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-nxs text-white">
                        <CheckCircle size={12} />
                      </span>
                      <span>
                        <b className="text-nxi1">Solicitação registrada.</b> A loja já foi
                        notificada.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-nxi2">
                      <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-nxw/25 text-[9.5px] font-extrabold text-nxw">
                        2
                      </span>
                      <span>
                        <b className="text-nxi1">Análise da loja.</b> Se for aprovada, o status muda
                        para &ldquo;Cancelado&rdquo; nesta página. Volte aqui com o mesmo código
                        para acompanhar.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {cancelResult === 'cancelled' && (
                <div className="rt-rise flex items-start gap-3.5 rounded-2xl border border-nxd/25 bg-nxd/[0.05] p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-nxd text-white">
                    <XCircle size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold tracking-tight text-nxi1">
                      Pedido cancelado
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-nxi2">
                      Como a loja ainda não tinha confirmado o pedido, o cancelamento foi feito na
                      hora e os itens voltaram para o estoque. Não é preciso fazer mais nada.
                    </p>
                  </div>
                </div>
              )}

              {/* progress stepper */}
              <div className="rt-rise rounded-2xl border border-nxborder bg-white p-6" style={{ animationDelay: '.05s' }}>
                <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">Progresso da entrega</h2>
                <ProgressStepper status={order.status} />
              </div>

              {/* history timeline */}
              {history.length > 0 && (
                <div className="rt-rise rounded-2xl border border-nxborder bg-white p-6" style={{ animationDelay: '.1s' }}>
                  <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">Histórico do pedido</h2>
                  <div>
                    {[...history].reverse().map((h, i, arr) => {
                      const hSt = STATUS_CONFIG[h.status as StatusKey]
                      const HIcon = hSt ? STATUS_ICONS[h.status as StatusKey] : null
                      const last = i === arr.length - 1
                      const newest = i === 0
                      return (
                        <div key={h.id ?? i} className="relative flex gap-3.5 pb-5 last:pb-0">
                          {!last && <span className="absolute left-[15px] top-9 h-[calc(100%-20px)] w-[2px] bg-nxborder" />}
                          <span
                            className={cn(
                              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                              newest ? `text-white ${TONE_BG[hSt?.tone ?? 'nxp']}` : 'bg-nxbg text-nxi3',
                            )}
                          >
                            {HIcon && <HIcon size={15} />}
                          </span>
                          <div className="pt-1">
                            <p className={cn('text-[13.5px] font-bold leading-tight', newest ? 'text-nxi1' : 'text-nxi2')}>
                              {h.status_text ?? hSt?.label ?? `Status ${h.status}`}
                            </p>
                            <p className="mt-0.5 font-mono text-[11px] text-nxi3">{formatDate(h.created_at)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* sem histórico — status atual */}
              {history.length === 0 && (
                <div className="rt-rise rounded-2xl border border-nxborder bg-white p-6" style={{ animationDelay: '.1s' }}>
                  <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">Status atual</h2>
                  <div className="flex gap-3.5 items-center">
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white', TONE_BG[st.tone])}>
                      <StatusIcon size={15} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-bold text-nxi1">{st.label}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-nxi3">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* coluna direita — sticky */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="rt-rise rounded-2xl border border-nxborder bg-white p-5" style={{ animationDelay: '.05s' }}>
                {/* loja */}
                <div className="flex items-center gap-3 border-b border-nxborder pb-4">
                  {order.store?.logo ? (
                    <img
                      src={buildImageUrl(order.store.logo)}
                      alt={order.store.name}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-nxp/10 text-nxp">
                      <Store size={20} />
                    </span>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-nxi3">Loja</p>
                    <p className="text-[14px] font-extrabold text-nxi1">{order.store?.name}</p>
                  </div>
                </div>

                {/* detalhes */}
                <div className="space-y-3.5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-nxi2">Código</span>
                    <span className="font-mono text-[13px] font-bold text-nxi1">#{order.order_code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-nxi2">Status</span>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold', TONE_BADGE_BG[st.tone])}>
                      <StatusIcon size={12} />
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-nxi2">Data do pedido</span>
                    <span className="text-[12.5px] font-semibold text-nxi1">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-nxborder pt-3.5">
                    <span className="text-[13px] font-bold text-nxi1">Total</span>
                    <span className="text-[19px] font-extrabold tracking-tight text-nxi1">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/*
                  Cancelamento SEM login: o checkout é de convidado, então o botão
                  não pode depender de sessão — a posse do pedido é provada pelo
                  telefone da compra dentro do modal.
                */}
                {cancelResult === 'cancelled' ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-nxd/25 bg-nxd/[0.05] py-2.5 text-[12.5px] font-bold text-nxd">
                    <XCircle size={15} /> Pedido cancelado
                  </div>
                ) : cancelResult === 'requested' ? (
                  <div className="rounded-xl border border-nxw/30 bg-nxw/[0.09] px-3.5 py-3">
                    <p className="flex items-center justify-center gap-2 text-[12.5px] font-bold text-nxw">
                      <Hourglass size={15} /> Aguardando aprovação da loja
                    </p>
                    <p className="mt-1.5 text-center text-[11.5px] leading-relaxed text-nxi2">
                      O pedido segue válido até a loja responder.
                    </p>
                  </div>
                ) : canCancel ? (
                  <button
                    onClick={handleOpenCancelDialog}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-nxd/30 py-2.5 text-[12.5px] font-bold text-nxd transition-colors hover:bg-nxd/[0.06]"
                  >
                    <XCircle size={15} />{' '}
                    {cancelNeedsApproval ? 'Solicitar cancelamento' : 'Cancelar pedido'}
                  </button>
                ) : blockedCancelReason ? (
                  <div className="flex items-start gap-2.5 rounded-xl border border-nxborder bg-nxbg px-3.5 py-3">
                    <Info size={14} className="mt-0.5 shrink-0 text-nxi3" />
                    <p className="text-[11.5px] leading-relaxed text-nxi2">{blockedCancelReason}</p>
                  </div>
                ) : null}

                {/* aviso de fluxo em duas etapas, antes de o cliente clicar */}
                {canCancel && cancelNeedsApproval && (
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-nxi3">
                    <Clock size={12} className="mt-[2px] shrink-0" />
                    Pedido já confirmado: o cancelamento é uma solicitação e depende do aval da
                    loja.
                  </p>
                )}

                {/* continuar comprando */}
                <Link
                  href="/"
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-nxp py-2.5 text-[12.5px] font-bold text-white transition-transform active:scale-[0.99]"
                >
                  <ShoppingBag size={15} /> Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* cancel modal */}
      {showCancelDialog && (
        <CancelModal
          order={order}
          needsApproval={cancelNeedsApproval}
          error={cancelError}
          onClose={handleCloseCancelDialog}
          onConfirm={handleConfirmCancel}
          isBusy={isCancelling}
        />
      )}
    </div>
  )
}

export default function RastrearPedidoPage() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <RastrearPedidoContent />
    </Suspense>
  )
}
