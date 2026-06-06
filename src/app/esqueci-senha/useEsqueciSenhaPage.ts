'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForgotPassword } from '@/hooks/useForgotPassword'
import { isValidEmail } from '@/schemas/authSchemas'
import type { AuthCtx } from '@/components/Auth'

export function useEsqueciSenhaPage() {
  const searchParams = useSearchParams()
  const { forgotPassword, isSending } = useForgotPassword()

  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)

  // mesma heurística de contexto do login
  const redirect = searchParams.get('redirect')
  const ctx: AuthCtx = redirect?.includes('/loja/') ? 'cliente' : 'vendedor'

  const query = searchParams.toString()
  const loginHref = query ? `/login?${query}` : '/login'

  const emailError = touched && !isValidEmail(email) ? 'Informe um e-mail válido.' : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!isValidEmail(email)) return

    // resposta do backend é genérica de propósito — sucesso sempre mostra a confirmação
    forgotPassword({ email: email.trim() }, { onSuccess: () => setSent(true) })
  }

  return {
    ctx,
    loginHref,
    email,
    setEmail,
    emailError,
    markTouched: () => setTouched(true),
    sent,
    isSending,
    handleSubmit,
  }
}
