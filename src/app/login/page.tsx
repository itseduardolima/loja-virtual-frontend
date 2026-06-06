'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import {
  AUTH_CONTENT,
  AuthCheckbox,
  AuthErrorBanner,
  AuthField,
  AuthGoogleButton,
  AuthPasswordInput,
  AuthShell,
  AuthTopLink,
} from '@/components/Auth'
import { useLoginPage } from './useLoginPage'

function LoginContent() {
  const {
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
  } = useLoginPage()

  const c = AUTH_CONTENT[ctx]

  return (
    <AuthShell
      ctx={ctx}
      topRight={<AuthTopLink prefix={c.signup[0]} label={c.signup[1]} href={signupHref} />}
    >
      <div className="lg-rise">
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">{c.h1}</h1>
        <p className="mt-1.5 text-[14px] text-nxi2">{c.sub}</p>

        {authError && <AuthErrorBanner message={authError} className="mt-5" />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <AuthField
            id="email"
            label="E-mail"
            type="email"
            value={login}
            placeholder="seu@email.com"
            autoComplete="email"
            error={emailError}
            onChange={(e) => setLogin(e.target.value)}
            onBlur={() => markTouched('login')}
          />

          <AuthField
            id="password"
            label="Senha"
            error={passwordError}
            right={
              <Link
                href={forgotHref}
                className="text-[12px] font-semibold text-nxp transition-colors hover:text-nxp/80"
              >
                Esqueceu a senha?
              </Link>
            }
          >
            <AuthPasswordInput
              id="password"
              value={password}
              autoComplete="current-password"
              error={!!passwordError}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => markTouched('password')}
            />
          </AuthField>

          <AuthCheckbox
            checked={remember}
            onChange={setRemember}
            label="Manter conectado neste dispositivo"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Entrando…
              </>
            ) : (
              <>
                Entrar <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-nxborder" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[12px] font-medium text-nxi3">ou</span>
          </div>
        </div>

        <AuthGoogleButton onClick={loginWithGoogle} disabled={isLoading} />

        <p className="mt-6 text-center text-[12px] leading-relaxed text-nxi3">
          Ao entrar, você concorda com os <span className="font-semibold text-nxi2">Termos</span> e
          a <span className="font-semibold text-nxi2">Política de Privacidade</span>.
        </p>
      </div>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
