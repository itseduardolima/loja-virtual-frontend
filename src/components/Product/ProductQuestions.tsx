"use client";

import { useState } from "react";
import { MessageCircle, ChevronDown, Send, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useProductQuestions } from "@/hooks/useProductQuestions";

import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";

interface ProductQuestionsProps {
  slug: string;
  productId: string;
  enabled?: boolean;
}

export function ProductQuestions({
  slug,
  productId,
  enabled = true,
}: ProductQuestionsProps) {
  const { user } = useAuth();
  const {
    questions,
    meta,
    isLoading,
    loadMore,
    hasMore,
    createQuestion,
    isCreating,
    isSuccess,
    resetForm,
  } = useProductQuestions(slug, productId, enabled);

  const [showForm, setShowForm] = useState(false);
  const [askerName, setAskerName] = useState(user?.name ?? "");
  const [questionText, setQuestionText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askerName.trim() || !questionText.trim()) return;
    createQuestion({
      asker_name: askerName.trim(),
      question: questionText.trim(),
    });
  };

  const handleNewQuestion = () => {
    setQuestionText("");
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="max-w-[1380px] mt-8 mx-auto sm:px-6 lg:px-8 py-8 sm:py-12" id="perguntas">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Perguntas e Respostas{" "}
        {meta && <span>({meta.total})</span>}
      </h2>
      <Card className="border border-gray-100 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900"></h2>
            </div>
            {!showForm && !isSuccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="shrink-0"
              >
                Fazer uma pergunta
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Formulário */}
          {showForm && !isSuccess && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
            >
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
                placeholder="Digite sua pergunta sobre este produto..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                maxLength={500}
                rows={3}
                required
                className="bg-white resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">
                  {questionText.length}/500
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      isCreating || !askerName.trim() || !questionText.trim()
                    }
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {isCreating ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Confirmação inline */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Pergunta enviada!
                </p>
                <p className="text-sm text-green-700 mt-0.5">
                  O vendedor responderá em breve. A resposta aparecerá aqui
                  assim que estiver disponível.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewQuestion}
                className="text-green-700 hover:text-green-900 shrink-0"
              >
                Nova pergunta
              </Button>
            </div>
          )}

          {/* Lista */}
          {isLoading && questions.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : questions.length === 0 ? (
            <div className="py-10 text-center">
              <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Nenhuma pergunta respondida ainda. Seja o primeiro a perguntar!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {questions.map((q) => (
                <div key={q.id} className="py-5 first:pt-0">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {q.asker_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {q.asker_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(q.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed break-words overflow-hidden">
                        {q.question}
                      </p>

                      {q.answer && (
                        <div className="mt-3 pl-3 border-l-2 border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Resposta da loja
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed break-words overflow-hidden">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={isLoading}
                className="gap-1.5"
              >
                <ChevronDown className="w-4 h-4" />
                Ver mais perguntas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
