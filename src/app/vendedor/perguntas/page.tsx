'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button, ErrorState } from '@/components'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Check, Package } from 'lucide-react'
import { TablePagination } from '@/components/Table/TablePagination'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useStoreQuestions, QuestionStatus } from './usePendingQuestionsPage'
import { buildImageUrl } from '@/lib/utils'

const TABS: { label: string; value: QuestionStatus; empty: string }[] = [
  { label: 'Aguardando resposta', value: 1, empty: 'Nenhuma pergunta pendente. Ótimo!' },
  { label: 'Respondidas', value: 2, empty: 'Nenhuma pergunta respondida ainda.' },
]

export default function PerguntasPage() {
  const { user, isLoading: authLoading } = useAuth()
  const {
    questions,
    meta,
    isLoading,
    error,
    status,
    setStatus,
    setPage,
    answerQuestion,
    isAnswering,
  } = useStoreQuestions()

  const [answers, setAnswers] = useState<Record<number, string>>({})

  if (authLoading) return <LoadingPage />
  if (!user) return <ErrorState message='Você precisa estar logado' />

  const activeTab = TABS.find((t) => t.value === status)!

  return (
    <div className='max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Perguntas dos Clientes</h1>
        <p className='text-sm text-gray-500 mt-1'>Gerencie as perguntas dos seus produtos</p>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 border-b border-gray-200'>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              status === tab.value
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {meta && status === tab.value && meta.total > 0 && (
              <span className='ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'>
                {meta.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingPage />
      ) : error ? (
        <ErrorState message='Erro ao carregar perguntas' />
      ) : questions.length === 0 ? (
        <Card className='shadow-none border-gray-100'>
          <CardContent className='py-16 text-center'>
            <MessageCircle className='w-12 h-12 text-gray-200 mx-auto mb-4' />
            <p className='text-gray-500'>{activeTab.empty}</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {questions.map((q) => (
            <Card key={q.id} className='shadow-none border-gray-100 overflow-hidden'>
              <CardHeader className='pb-3'>
                {/* Produto */}
                <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
                  <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                    {q.product?.image ? (
                      <Image
                        src={buildImageUrl(q.product.image)}
                        alt={q.product.name}
                        width={48}
                        height={48}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <Package className='w-5 h-5 text-gray-300' />
                      </div>
                    )}
                  </div>
                  <p className='text-sm font-medium text-gray-700 truncate'>{q.product?.name}</p>
                </div>

                {/* Pergunta */}
                <div className='min-w-0 pt-1'>
                  <p className='text-sm font-medium text-gray-900 break-words overflow-hidden'>
                    {q.question}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    por <span className='font-medium'>{q.asker_name}</span> em{' '}
                    {new Date(q.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </CardHeader>

              <CardContent className='pt-0'>
                {status === 2 ? (
                  /* Respondida — mostrar resposta */
                  <div className='pl-3 border-l-2 border-gray-200'>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                      Sua resposta
                    </p>
                    <p className='text-sm text-gray-700 break-words'>{q.answer}</p>
                  </div>
                ) : (
                  /* Pendente — campo para responder */
                  <>
                    <Textarea
                      placeholder='Digite sua resposta...'
                      value={answers[q.id] ?? ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      rows={3}
                      maxLength={2000}
                      className='resize-none mb-3'
                    />
                    <Button
                      size='sm'
                      disabled={!answers[q.id]?.trim() || isAnswering}
                      onClick={() =>
                        answerQuestion(
                          { id: q.id, answer: answers[q.id] },
                          {
                            onSuccess: () =>
                              setAnswers((prev) => {
                                const next = { ...prev }
                                delete next[q.id]
                                return next
                              }),
                          }
                        )
                      }
                    >
                      <Check className='w-3.5 h-3.5 mr-1.5' />
                      Responder
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          <TablePagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
