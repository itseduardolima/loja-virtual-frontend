'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, KeyRound, Loader2, MailCheck } from 'lucide-react'
import { AuthField, AuthShell, AuthTopLink } from '@/components/Auth'
import { useEsqueciSenhaPage } from './useEsqueciSenhaPage'

function EsqueciSenhaContent() {
  const {
    ctx,
    loginHref,
    email,
    setEmail,
    emailError,
    markTouched,
    sent,
    isSending,
    handleSubmit,
  } = useEsqueciSenhaPage()

  return (
    <AuthShell
      ctx={ctx}
      topRight={<AuthTopLink prefix="Lembrou a senha?" label="Entrar" href={loginHref} />}
    >
      {sent ? (
        <div className="lg-rise text-center">
          <div className="lg-pop mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-nxs/10 text-nxs">
            <MailCheck size={32} />
          </div>
          <h1 className="mt-5 text-[22px] font-extrabold tracking-tight text-nxi1">
            E-mail enviado!
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-nxi2">
            Se <b className="text-nxi1">{email.trim()}</b> estiver cadastrado, você vai receber um
            link para redefinir sua senha. Confira também a caixa de spam.
          </p>
          <Link
            href={loginHref}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-nxp px-6 text-[14px] font-bold text-white transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99]"
          >
            Voltar ao login
          </Link>
        </div>
      ) : (
        <div className="lg-rise">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nxp/[0.08] text-nxp">
            <KeyRound size={24} />
          </div>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
            Esqueceu a senha?
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-nxi2">
            Sem problema. Informe o e-mail da sua conta e enviaremos um link para criar uma nova
            senha.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <AuthField
              id="email"
              label="E-mail"
              type="email"
              value={email}
              placeholder="seu@email.com"
              autoComplete="email"
              error={emailError}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={markTouched}
            />

            <button
              type="submit"
              disabled={isSending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
            >
              {isSending ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Enviando…
                </>
              ) : (
                <>
                  Enviar link de recuperação <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-nxi3">
            <Link
              href={loginHref}
              className="font-semibold text-nxi2 transition-colors hover:text-nxp"
            >
              ← Voltar ao login
            </Link>
          </p>
        </div>
      )}
    </AuthShell>
  )
}

export default function EsqueciSenhaPage() {
  return (
    <Suspense fallback={null}>
      <EsqueciSenhaContent />
    </Suspense>
  )
}
