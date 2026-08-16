'use client'

import { useState } from 'react'
import { HelpCircle, Send, CheckCircle, Store } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useProductQuestions } from '@/hooks/useProductQuestions'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, cn } from '@/lib/utils'

interface ProductQuestionsProps {
  slug: string
  productId: string
  enabled?: boolean
}

export function ProductQuestions({ slug, productId, enabled = true }: ProductQuestionsProps) {
  const { user } = useAuth()
  const {
    questions,
    isLoading,
    loadMore,
    hasMore,
    createQuestion,
    isCreating,
    isSuccess,
    resetForm,
  } = useProductQuestions(slug, productId, enabled)

  const [showForm, setShowForm] = useState(false)
  const [askerName, setAskerName] = useState(user?.name ?? '')
  const [questionText, setQuestionText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!askerName.trim() || !questionText.trim()) return
    createQuestion({
      asker_name: askerName.trim(),
      question: questionText.trim(),
    })
  }

  const handleNewQuestion = () => {
    setQuestionText('')
    resetForm()
    setShowForm(true)
  }

  return (
    <div className="py-12 md:py-14">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            Dúvidas
          </span>
          <h2 className="mt-2 font-integral text-[20px] font-bold uppercase tracking-[-0.01em] text-nxi1 sm:text-[23px]">
            Perguntas e respostas
          </h2>
        </div>
        {!showForm && !isSuccess && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full border border-store px-4 py-2.5 text-[12.5px] font-semibold text-store-ink transition-colors hover:bg-store hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2"
          >
            <HelpCircle size={15} /> Fazer pergunta
          </button>
        )}
      </div>

      {/* formulário */}
      {showForm && !isSuccess && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-3 rounded-2xl border border-nxborder bg-nxbg/60 p-4"
        >
          <p className="text-[13px] leading-relaxed text-nxi2">
            Sua dúvida será respondida pela loja e ficará visível para outros clientes.
          </p>
          {!user && (
            <Input
              placeholder="Seu nome *"
              value={askerName}
              onChange={(e) => setAskerName(e.target.value)}
              maxLength={100}
              required
              className="bg-white"
            />
          )}
          <Textarea
            placeholder="ex.: O tecido é quente? Serve para o verão?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            maxLength={500}
            rows={3}
            required
            className="resize-none bg-white"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-nxi3">{questionText.length}/500</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-9 rounded-full px-4 text-[12.5px] font-semibold text-nxi2 hover:text-nxi1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating || !askerName.trim() || !questionText.trim()}
                className={cn(
                  'flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-semibold transition-colors',
                  isCreating || !askerName.trim() || !questionText.trim()
                    ? 'cursor-not-allowed bg-nxbg text-nxi3'
                    : 'bg-store text-white hover:brightness-[1.05]',
                )}
              >
                <Send size={13} />
                {isCreating ? 'Enviando...' : 'Enviar pergunta'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* confirmação */}
      {isSuccess && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-nxs/20 bg-nxs/[0.06] p-4">
          <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-nxs" />
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-nxi1">Pergunta enviada!</p>
            <p className="mt-0.5 text-[13px] text-nxi2">
              O vendedor responderá em breve. A resposta aparecerá aqui assim que estiver
              disponível.
            </p>
          </div>
          <button
            onClick={handleNewQuestion}
            className="shrink-0 text-[12.5px] font-semibold text-nxs hover:underline"
          >
            Nova pergunta
          </button>
        </div>
      )}

      {/* lista */}
      {isLoading && questions.length === 0 ? (
        <div className="py-10 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-nxborder border-t-store" />
        </div>
      ) : questions.length === 0 ? (
        <div className="mt-7 flex flex-col items-center justify-center rounded-2xl border border-nxborder bg-nxbg py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-store-ink shadow-sm">
            <HelpCircle size={24} />
          </div>
          <h3 className="mt-4 text-[15px] font-bold tracking-tight text-nxi1">
            Nenhuma pergunta ainda
          </h3>
          <p className="mt-1.5 max-w-[34ch] text-[13px] leading-relaxed text-nxi2">
            Tem alguma dúvida sobre este produto? Pergunte e a loja responde.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-nxborder p-5">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nxbg text-[11px] font-bold text-nxi2">
                  P
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-[14px] font-semibold text-nxi1">{q.question}</p>
                  <span className="text-[11px] text-nxi3">
                    {q.asker_name} · {formatDate(q.created_at)}
                  </span>
                </div>
              </div>
              {q.answer && (
                <div className="mt-3 flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nxi1 text-[11px] font-bold text-white">
                    R
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-[13.5px] leading-relaxed text-nxi2">
                      {q.answer}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-store-ink">
                      <Store size={11} /> Resposta da loja
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-4 w-full rounded-xl border border-dashed border-nxborder py-3 text-[12.5px] font-semibold text-nxi3 transition-colors hover:border-nxi3 hover:text-store-ink disabled:opacity-50"
        >
          {isLoading ? 'Carregando...' : 'Ver todas as perguntas'}
        </button>
      )}
    </div>
  )
}
