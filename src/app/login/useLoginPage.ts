'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/contexts/AuthContext'
import { isValidEmail } from '@/schemas/authSchemas'
import type { AuthCtx } from '@/components/Auth'

export function useLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login: loginFunction, isLoading } = useLogin()
  const { loginWithGoogle } = useAuth()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState<{ login?: boolean; password?: boolean }>({})
  const [authError, setAuthError] = useState<string | null>(null)

  // Cliente quando veio de uma loja (?redirect=/loja/...); vendedor é o default do painel
  const redirect = searchParams.get('redirect')
  const ctx: AuthCtx = redirect?.includes('/loja/') ? 'cliente' : 'vendedor'

  const query = searchParams.toString()
  const signupHref = ctx === 'vendedor' ? '/assinatura' : query ? `/cadastro?${query}` : '/cadastro'
  const forgotHref = query ? `/esqueci-senha?${query}` : '/esqueci-senha'

  // Falha no Google OAuth volta como /login?error=mensagem — exibe no banner e limpa a URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (!errorParam) return
    setAuthError(errorParam)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('error')
    const qs = params.toString()
    router.replace(qs ? `/login?${qs}` : '/login')
  }, [searchParams, router])

  const emailError = touched.login && !isValidEmail(login) ? 'Informe um e-mail válido.' : null
  const passwordError = touched.password && password.length < 1 ? 'Informe sua senha.' : null

  function markTouched(field: 'login' | 'password') {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ login: true, password: true })
    setAuthError(null)
    if (!isValidEmail(login) || password.length < 1) return

    try {
      await loginFunction({ login: login.trim(), password, remember })
    } catch (error: any) {
      setAuthError(
        error?.response?.data?.message ??
          'E-mail ou senha incorretos. Verifique e tente novamente.',
      )
    }
  }

  return {
    ctx,
    signupHref,
    forgotHref,
    login,
    setLogin,
    password,
    setPassword,
    remember,
    setRemember,
    emailError,
    passwordError,
    authError,
    markTouched,
    isLoading,
    handleSubmit,
    loginWithGoogle,
  }
}
