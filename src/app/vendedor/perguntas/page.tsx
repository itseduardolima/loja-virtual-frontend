'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { ErrorState } from '@/components'
import { LoadingPage, FeatureLocked } from '@/components/Layout'
import { TablePagination } from '@/components/Table'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { buildImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useStoreQuestions } from './usePendingQuestionsPage'
import type { StoreQuestion } from './usePendingQuestionsPage'
import {
  Clock,
  CheckCircle2,
  Timer,
  MessageCircle,
  MessagesSquare,
  WifiOff,
  RefreshCw,
  Check,
  Loader2,
  Package,
  Zap,
} from 'lucide-react'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 3600)
  if (h < 24) return `há ${h} h`
  const d = Math.round(h / 24)
  return `há ${d} dia${d > 1 ? 's' : ''}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatDateHour(iso: string): string {
  const d = new Date(iso)
  return `${formatDate(iso)} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}`
}

export default function PerguntasPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { features, isLoading: isLoadingFeatures } = usePlanFeatures()
  const queryClient = useQueryClient()

  const {
    questions,
    meta,
    isLoading,
    error,
    status,
    setStatus,
    setPage,
    answerQuestion,
    pendingTotal,
    answeredTotal,
  } = useStoreQuestions()

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [sending, setSending] = useState<Record<number, boolean>>({})

  if (authLoading || isLoadingFeatures) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado" />

  if (!features.feature_product_questions) {
    return (
      <FeatureLocked
        title="Perguntas e respostas"
        description="Receba e responda perguntas dos clientes nos seus produtos. Disponível a partir do plano Profissional."
        feature="feature_product_questions"
      />
    )
  }

  const handleSubmit = (q: StoreQuestion) => {
    if (sending[q.id]) return
    const text = (answers[q.id] ?? '').trim()
    if (!text) return
    setSending(prev => ({ ...prev, [q.id]: true }))
    answerQuestion(
      { id: q.id, answer: text },
      {
        onSuccess: () => {
          setAnswers(prev => { const n = { ...prev }; delete n[q.id]; return n })
          setSending(prev => { const n = { ...prev }; delete n[q.id]; return n })
        },
        onError: () => setSending(prev => { const n = { ...prev }; delete n[q.id]; return n }),
      }
    )
  }

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden -mx-4 -mt-4 flex flex-col bg-nxbg pb-[80px]">

        {/* Sticky header */}
        <div className="sticky top-0 z-10 border-b border-nxborder bg-white">

          {/* Título + badge */}
          <div className="flex items-center px-[16px] pb-[12px] pt-[15px]">
            <span className="text-[21px] font-extrabold tracking-[-0.03em] text-nxi1">Perguntas</span>
            {isLoading ? (
              <div className="ml-auto h-6 w-[90px] animate-pulse rounded-full bg-nxborder" />
            ) : (
              <span className={cn(
                "ml-auto inline-flex h-6 items-center rounded-full px-[11px] text-[12.5px] font-extrabold",
                pendingTotal > 0 ? "bg-[#FBE9DF] text-[#B5491D]" : "bg-[#E7F2EC] text-[#2E6B4E]"
              )}>
                {pendingTotal} pendente{pendingTotal !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* KPIs 2 colunas */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-[9px] px-[16px] pb-[12px]">
              {[0, 1].map(i => (
                <div key={i} className="rounded-[13px] border border-nxborder bg-white px-[12px] py-[10px]">
                  <div className="h-[11px] w-[60%] animate-pulse rounded-[10px] bg-nxborder" />
                  <div className="mt-[8px] h-[18px] w-[35%] animate-pulse rounded-[10px] bg-nxborder" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[9px] px-[16px] pb-[12px]">
              <div className="rounded-[13px] border border-nxborder bg-white px-[12px] py-[10px]">
                <div className="text-[10.5px] font-bold text-nxi3">Pendentes</div>
                <div className="text-[19px] font-extrabold text-nxi1">{pendingTotal}</div>
              </div>
              <div className="rounded-[13px] border border-nxborder bg-white px-[12px] py-[10px]">
                <div className="text-[10.5px] font-bold text-nxi3">Respondidas</div>
                <div className="text-[19px] font-extrabold text-nxi1">{answeredTotal}</div>
              </div>
            </div>
          )}

          {/* Tabs pills full-width */}
          {isLoading ? (
            <div className="flex gap-[8px] px-[16px] pb-[12px]">
              <div className="h-[38px] flex-1 animate-pulse rounded-[11px] bg-nxborder" />
              <div className="h-[38px] flex-1 animate-pulse rounded-[11px] bg-nxborder" />
            </div>
          ) : (
            <div className="flex gap-[8px] px-[16px] pb-[12px]">
              <button
                onClick={() => setStatus(1)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-[7px] h-[38px] rounded-[11px] text-[13px] font-extrabold',
                  status === 1 ? 'bg-nxp text-white' : 'border border-nxborder bg-white text-nxi2'
                )}
              >
                {status === 1 && <span className="h-[6px] w-[6px] rounded-full bg-white" />}
                Pendentes
                <span className={cn(
                  'flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-[5px] text-[10.5px] font-extrabold',
                  status === 1 ? 'bg-white/20 text-white' : 'bg-[#EEF0F4] text-nxi3'
                )}>
                  {pendingTotal}
                </span>
              </button>
              <button
                onClick={() => setStatus(2)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-[7px] h-[38px] rounded-[11px] text-[13px] font-extrabold',
                  status === 2 ? 'bg-nxp text-white' : 'border border-nxborder bg-white text-nxi2'
                )}
              >
                Respondidas
                <span className={cn(
                  'flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-[5px] text-[10.5px] font-extrabold',
                  status === 2 ? 'bg-white/20 text-white' : 'bg-[#EEF0F4] text-nxi3'
                )}>
                  {answeredTotal}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-[12px] px-[14px] py-[13px]">

          {isLoading ? (
            <>
              {[0, 1].map(i => (
                <div key={i} className="rounded-[16px] border border-nxborder bg-white p-[15px]">
                  <div className="flex gap-[11px]">
                    <div className="h-[40px] w-[40px] shrink-0 animate-pulse rounded-[10px] bg-nxborder" />
                    <div className="flex-1 space-y-[7px]">
                      <div className="h-[10px] w-[40%] animate-pulse rounded-[10px] bg-nxborder" />
                      <div className="h-[13px] w-[85%] animate-pulse rounded-[10px] bg-nxborder" />
                      <div className="h-[10px] w-[45%] animate-pulse rounded-[10px] bg-nxborder" />
                    </div>
                  </div>
                  <div className="mt-[12px] h-[60px] animate-pulse rounded-[12px] bg-nxborder" />
                  <div className="mt-[10px] h-[42px] animate-pulse rounded-[11px] bg-nxborder" />
                </div>
              ))}
            </>
          ) : error ? (
            <div className="rounded-[16px] border border-nxborder bg-white px-6 py-[56px] text-center">
              <WifiOff className="mx-auto h-12 w-12 text-nxa" />
              <div className="mt-[14px] text-[17px] font-extrabold text-nxi1">Não foi possível carregar as perguntas</div>
              <div className="mt-[5px] text-[13.5px] font-semibold text-nxi2">Verifique sua conexão e tente novamente.</div>
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['store-questions'] })}
                className="mt-[18px] inline-flex h-[42px] items-center gap-[7px] rounded-[11px] bg-nxp px-5 text-[13.5px] font-extrabold text-white"
              >
                <RefreshCw className="h-[15px] w-[15px]" />Tentar novamente
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[48px] text-center px-[28px]">
              {status === 1 ? (
                answeredTotal > 0 ? (
                  <>
                    <CheckCircle2 className="h-14 w-14 text-nxs" />
                    <div className="mt-[14px] text-[18px] font-extrabold text-nxi1">Tudo em dia!</div>
                    <div className="mt-[5px] text-[13px] font-semibold leading-[1.5] text-nxi2">Nenhuma pergunta aguardando resposta. Continue assim.</div>
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-14 w-14 text-nxp" />
                    <div className="mt-[14px] text-[18px] font-extrabold text-nxi1">Nenhuma pergunta ainda</div>
                    <div className="mt-[5px] text-[13px] font-semibold leading-[1.5] text-nxi2">Quando clientes fizerem perguntas nos seus produtos, elas aparecerão aqui.</div>
                    <div className="mt-[18px] inline-flex items-center gap-[7px] rounded-[10px] bg-[#EEF0FB] px-[14px] py-[8px] text-[12.5px] font-extrabold text-nxp">
                      <Zap className="h-[14px] w-[14px]" />Dica: responder rápido aumenta a conversão.
                    </div>
                  </>
                )
              ) : (
                <>
                  <MessagesSquare className="h-14 w-14 text-nxi3" />
                  <div className="mt-[14px] text-[18px] font-extrabold text-nxi1">Nenhuma resposta enviada ainda</div>
                  <div className="mt-[5px] text-[13px] font-semibold leading-[1.5] text-nxi2">As respostas que você enviar aparecerão aqui.</div>
                </>
              )}
            </div>
          ) : (
            <>
              {status === 1
                ? questions.map(q => (
                    <div
                      key={q.id}
                      className={cn(
                        'rounded-[16px] border border-nxborder bg-white p-[15px]',
                        sending[q.id] && 'opacity-70'
                      )}
                    >
                      <div className="flex gap-[11px]">
                        <div
                          className="h-[40px] w-[40px] shrink-0 rounded-[10px] border border-nxborder bg-nxbg overflow-hidden flex items-center justify-center"
                          style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E7E9F2,#E7E9F2 5px,#EFF1F8 5px,#EFF1F8 10px)' }}
                        >
                          {q.product?.image ? (
                            <Image src={buildImageUrl(q.product.image)} alt={q.product.name} width={40} height={40} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-nxi3" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-bold text-nxi3">{q.product?.name}</div>
                          <div className="mt-[2px] text-[14px] font-extrabold leading-[1.35] text-nxi1">{q.question}</div>
                          <div className="mt-[5px] flex items-center gap-[7px]">
                            <span className="text-[11.5px] font-semibold text-nxi3">por {q.asker_name}</span>
                            <span className="inline-flex items-center gap-[4px] rounded-[7px] bg-[#FBEEE6] px-[7px] py-[1px] text-[10.5px] font-extrabold text-[#B5491D]">
                              <Clock className="h-[10px] w-[10px]" />
                              {relativeTime(q.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-[12px] border-t border-nxborder pt-[12px]">
                        <div className="relative">
                          <textarea
                            value={answers[q.id] ?? ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value.slice(0, 2000) }))}
                            disabled={!!sending[q.id]}
                            placeholder="Digite sua resposta…"
                            rows={3}
                            className="w-full resize-none rounded-[12px] border border-nxborder bg-white px-[12px] pb-[26px] pt-[10px] text-[13px] font-semibold leading-[1.45] text-nxi1 placeholder:text-nxi3 outline-none focus:border-nxp focus:ring-[3px] focus:ring-nxp/10 disabled:bg-nxbg"
                          />
                          <span className="pointer-events-none absolute bottom-[9px] right-[11px] text-[11px] font-bold text-nxi3">
                            {(answers[q.id] ?? '').length} / 2000
                          </span>
                        </div>
                        {(() => {
                          const empty = !(answers[q.id] ?? '').trim()
                          const isSending = !!sending[q.id]
                          const disabled = empty || isSending
                          return (
                            <button
                              onClick={() => handleSubmit(q)}
                              disabled={disabled}
                              className={cn(
                                'mt-[10px] flex w-full items-center justify-center gap-[7px] h-[42px] rounded-[11px] text-[13.5px] font-extrabold transition-colors',
                                disabled ? 'bg-[#E7E8EF] text-[#9FA1B4] cursor-not-allowed' : 'bg-nxp text-white cursor-pointer'
                              )}
                            >
                              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              {isSending ? 'Enviando…' : 'Responder'}
                            </button>
                          )
                        })()}
                      </div>
                    </div>
                  ))
                : questions.map(q => (
                    <div key={q.id} className="relative rounded-[16px] border border-nxborder bg-white p-[15px]">
                      <span className="absolute right-[14px] top-[14px] inline-flex items-center gap-[5px] h-[22px] rounded-full bg-[#E7F2EC] px-[9px] text-[11px] font-extrabold text-[#2E6B4E]">
                        <Check className="h-3 w-3" />Respondida
                      </span>
                      <div className="flex gap-[11px] pr-[88px]">
                        <div
                          className="h-[40px] w-[40px] shrink-0 rounded-[10px] border border-nxborder bg-nxbg overflow-hidden flex items-center justify-center"
                          style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E7E9F2,#E7E9F2 5px,#EFF1F8 5px,#EFF1F8 10px)' }}
                        >
                          {q.product?.image ? (
                            <Image src={buildImageUrl(q.product.image)} alt={q.product.name} width={40} height={40} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-nxi3" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-bold text-nxi3">{q.product?.name}</div>
                          <div className="mt-[2px] text-[13.5px] font-semibold leading-[1.4] text-nxi2">{q.question}</div>
                          <div className="mt-[5px] text-[11.5px] font-semibold text-nxi3">
                            por {q.asker_name} · {formatDate(q.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-[12px] rounded-[12px] bg-[#F0FAF5] p-[13px]">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#2E6B4E]">Sua resposta</div>
                        <div className="mt-[5px] text-[13px] font-semibold leading-[1.45] text-nxi1">{q.answer}</div>
                        {q.answered_at && (
                          <div className="mt-[8px] text-[11px] font-semibold text-nxi3">Respondido em {formatDateHour(q.answered_at)}</div>
                        )}
                      </div>
                    </div>
                  ))
              }
              <TablePagination meta={meta} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block w-full">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-[11px]">
              <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">Perguntas</h1>
              {pendingTotal > 0 && (
                <span className="inline-flex h-6 items-center rounded-full bg-[#FBE9DF] px-[10px] text-[12.5px] font-extrabold text-[#B5491D] whitespace-nowrap">
                  {pendingTotal} pendente{pendingTotal !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="mt-[5px] text-[13.5px] font-semibold text-nxi3">
              {pendingTotal} pergunta{pendingTotal !== 1 ? 's' : ''} pendente{pendingTotal !== 1 ? 's' : ''} · {answeredTotal} respondida{answeredTotal !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="mb-5 grid grid-cols-3 gap-[13px]">
          <div className="rounded-[16px] border border-nxborder bg-white p-[15px]">
            <div className="flex items-center gap-[8px] text-[12.5px] font-bold text-nxi3">
              <Clock className="h-[15px] w-[15px] text-[#E8632A]" />
              Pendentes
            </div>
            <div className="mt-[7px] text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">{pendingTotal}</div>
          </div>
          <div className="rounded-[16px] border border-nxborder bg-white p-[15px]">
            <div className="flex items-center gap-[8px] text-[12.5px] font-bold text-nxi3">
              <CheckCircle2 className="h-[15px] w-[15px] text-[#3F8A66]" />
              Respondidas
            </div>
            <div className="mt-[7px] text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">{answeredTotal}</div>
          </div>
          <div className="rounded-[16px] border border-nxborder bg-white p-[15px]">
            <div className="flex items-center gap-[8px] text-[12.5px] font-bold text-nxi3">
              <Timer className="h-[15px] w-[15px] text-[#2A2D7C]" />
              Tempo médio
            </div>
            <div className="mt-[7px] text-[26px] font-extrabold leading-none tracking-[-0.03em] text-nxi1">&lt; 2h</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-[18px] flex gap-[8px]">
          <button
            onClick={() => setStatus(1)}
            className={cn(
              'flex items-center gap-[8px] h-[40px] px-[16px] rounded-[12px] text-[13.5px] font-extrabold cursor-pointer',
              status === 1 ? 'bg-nxp text-white border border-nxp' : 'bg-white text-nxi2 border border-nxborder'
            )}
          >
            {status === 1 && <span className="w-[7px] h-[7px] rounded-full bg-white" />}
            Pendentes
            <span className={cn(
              'min-w-[20px] h-[20px] px-[7px] rounded-full text-[11px] font-extrabold flex items-center justify-center',
              status === 1 ? 'bg-white/20 text-white' : 'bg-[#EEF0F4] text-nxi3'
            )}>
              {pendingTotal}
            </span>
          </button>
          <button
            onClick={() => setStatus(2)}
            className={cn(
              'flex items-center gap-[8px] h-[40px] px-[16px] rounded-[12px] text-[13.5px] font-extrabold cursor-pointer',
              status === 2 ? 'bg-nxp text-white border border-nxp' : 'bg-white text-nxi2 border border-nxborder'
            )}
          >
            Respondidas
            <span className={cn(
              'min-w-[20px] h-[20px] px-[7px] rounded-full text-[11px] font-extrabold flex items-center justify-center',
              status === 2 ? 'bg-white/20 text-white' : 'bg-[#EEF0F4] text-nxi3'
            )}>
              {answeredTotal}
            </span>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-[13px]">
            {[0, 1].map(i => (
              <div key={i} className="rounded-[16px] border border-nxborder bg-white p-[18px]">
                <div className="flex gap-[13px]">
                  <div className="w-[48px] h-[48px] rounded-[10px] animate-pulse bg-nxborder shrink-0" />
                  <div className="flex-1 space-y-[8px]">
                    <div className="h-[12px] w-[120px] rounded-[10px] animate-pulse bg-nxborder" />
                    <div className="h-[16px] w-[80%] rounded-[10px] animate-pulse bg-nxborder" />
                    <div className="h-[12px] w-[40%] rounded-[10px] animate-pulse bg-nxborder" />
                  </div>
                </div>
                <div className="h-[72px] mt-[14px] rounded-[12px] animate-pulse bg-nxborder" />
                <div className="mt-[11px] flex justify-end">
                  <div className="h-[40px] w-[120px] rounded-[11px] animate-pulse bg-nxborder" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[16px] border border-nxborder bg-white px-6 py-[56px] text-center">
            <WifiOff className="mx-auto h-12 w-12 text-nxa" />
            <div className="mt-[14px] text-[17px] font-extrabold text-nxi1">Não foi possível carregar as perguntas</div>
            <div className="mt-[5px] text-[13.5px] font-semibold text-nxi2">Verifique sua conexão e tente novamente.</div>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['store-questions'] })}
              className="mt-[18px] inline-flex h-[42px] items-center gap-[7px] rounded-[11px] bg-nxp px-5 text-[13.5px] font-extrabold text-white"
            >
              <RefreshCw className="h-[15px] w-[15px]" />Tentar novamente
            </button>
          </div>
        ) : questions.length === 0 ? (
          status === 1 ? (
            answeredTotal > 0 ? (
              <div className="rounded-[16px] border border-nxborder bg-white py-[64px] px-6 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-nxs" />
                <div className="mt-[14px] text-[19px] font-extrabold text-nxi1">Tudo em dia!</div>
                <div className="mt-[5px] text-[13.5px] font-semibold text-nxi2">Nenhuma pergunta aguardando resposta. Continue assim.</div>
              </div>
            ) : (
              <div className="rounded-[16px] border border-nxborder bg-white py-[56px] px-6 text-center">
                <MessageCircle className="mx-auto h-14 w-14 text-nxp" />
                <div className="mt-[14px] text-[19px] font-extrabold text-nxi1">Nenhuma pergunta ainda</div>
                <div className="mx-auto mt-[5px] max-w-[400px] text-[13.5px] font-semibold leading-[1.5] text-nxi2">
                  Quando clientes fizerem perguntas nos seus produtos, elas aparecerão aqui para você responder.
                </div>
                <div className="mt-[18px] inline-flex items-center gap-[7px] rounded-[10px] bg-[#EEF0FB] px-[14px] py-[8px] text-[12.5px] font-extrabold text-nxp">
                  <Zap className="h-[14px] w-[14px]" />Dica: responder rápido aumenta a conversão.
                </div>
              </div>
            )
          ) : (
            <div className="rounded-[16px] border border-nxborder bg-white py-[64px] px-6 text-center">
              <MessagesSquare className="mx-auto h-14 w-14 text-nxi3" />
              <div className="mt-[14px] text-[19px] font-extrabold text-nxi1">Nenhuma resposta enviada ainda</div>
              <div className="mt-[5px] text-[13.5px] font-semibold text-nxi2">As respostas que você enviar aparecerão aqui.</div>
            </div>
          )
        ) : (
          <div className="space-y-[13px]">
            {status === 1
              ? questions.map(q => (
                  <div
                    key={q.id}
                    className={cn(
                      'rounded-[16px] border border-nxborder bg-white p-[18px]',
                      sending[q.id] && 'opacity-70'
                    )}
                  >
                    <div className="flex gap-[13px]">
                      <div
                        className="h-[48px] w-[48px] shrink-0 rounded-[10px] border border-nxborder bg-nxbg overflow-hidden flex items-center justify-center"
                        style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E7E9F2,#E7E9F2 5px,#EFF1F8 5px,#EFF1F8 10px)' }}
                      >
                        {q.product?.image ? (
                          <Image src={buildImageUrl(q.product.image)} alt={q.product.name} width={48} height={48} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-nxi3" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-bold text-nxi3">{q.product?.name}</div>
                        <div className="mt-[2px] text-[15px] font-extrabold leading-[1.35] text-nxi1">{q.question}</div>
                        <div className="mt-[6px] flex items-center gap-[8px]">
                          <span className="text-[12px] font-semibold text-nxi3">por {q.asker_name}</span>
                          <span className="inline-flex items-center gap-[4px] rounded-[7px] bg-[#FBEEE6] px-[8px] py-[1px] text-[11px] font-extrabold text-[#B5491D]">
                            <Clock className="h-[11px] w-[11px]" />
                            {relativeTime(q.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-[14px] border-t border-nxborder pt-[14px]">
                      <div className="relative">
                        <textarea
                          value={answers[q.id] ?? ''}
                          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value.slice(0, 2000) }))}
                          disabled={!!sending[q.id]}
                          placeholder="Digite sua resposta…"
                          rows={3}
                          className="w-full resize-none rounded-[12px] border border-nxborder bg-white px-[12px] pb-[26px] pt-[11px] text-[13.5px] font-semibold leading-[1.45] text-nxi1 placeholder:text-nxi3 outline-none focus:border-nxp focus:ring-[3px] focus:ring-nxp/10 disabled:bg-nxbg"
                        />
                        <span className="pointer-events-none absolute bottom-[10px] right-[12px] text-[11px] font-bold text-nxi3">
                          {(answers[q.id] ?? '').length} / 2000
                        </span>
                      </div>
                      <div className="mt-[11px] flex justify-end">
                        {(() => {
                          const empty = !(answers[q.id] ?? '').trim()
                          const isSending = !!sending[q.id]
                          const disabled = empty || isSending
                          return (
                            <button
                              onClick={() => handleSubmit(q)}
                              disabled={disabled}
                              className={cn(
                                'inline-flex items-center gap-[7px] h-[40px] px-[18px] rounded-[11px] text-[13.5px] font-extrabold transition-colors',
                                disabled ? 'bg-[#E7E8EF] text-[#9FA1B4] cursor-not-allowed' : 'bg-nxp text-white cursor-pointer'
                              )}
                            >
                              {isSending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              {isSending ? 'Enviando…' : 'Responder'}
                            </button>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))
              : questions.map(q => (
                  <div key={q.id} className="relative rounded-[16px] border border-nxborder bg-white p-[18px]">
                    <span className="absolute right-[16px] top-[16px] inline-flex items-center gap-[5px] h-[22px] rounded-full bg-[#E7F2EC] px-[9px] text-[11px] font-extrabold text-[#2E6B4E]">
                      <Check className="h-3 w-3" />Respondida
                    </span>
                    <div className="flex gap-[13px] pr-[96px]">
                      <div
                        className="h-[48px] w-[48px] shrink-0 rounded-[10px] border border-nxborder bg-nxbg overflow-hidden flex items-center justify-center"
                        style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E7E9F2,#E7E9F2 5px,#EFF1F8 5px,#EFF1F8 10px)' }}
                      >
                        {q.product?.image ? (
                          <Image src={buildImageUrl(q.product.image)} alt={q.product.name} width={48} height={48} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-nxi3" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-bold text-nxi3">{q.product?.name}</div>
                        <div className="mt-[2px] text-[14px] font-semibold leading-[1.4] text-nxi2">{q.question}</div>
                        <div className="mt-[5px] text-[12px] font-semibold text-nxi3">
                          por {q.asker_name} · perguntado em {formatDate(q.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-[13px] rounded-[12px] bg-[#F0FAF5] p-[13px]">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#2E6B4E]">Sua resposta</div>
                      <div className="mt-[5px] text-[13.5px] font-semibold leading-[1.45] text-nxi1">{q.answer}</div>
                      {q.answered_at && (
                        <div className="mt-[8px] text-[11px] font-semibold text-nxi3">Respondido em {formatDateHour(q.answered_at)}</div>
                      )}
                    </div>
                  </div>
                ))}

            <TablePagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>
    </>
  )
}
