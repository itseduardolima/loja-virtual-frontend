'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Check, Loader2, SearchX, ShieldCheck } from 'lucide-react'
import {
  AuthErrorBanner,
  AuthField,
  AuthPasswordInput,
  AuthShell,
  AuthTopLink,
} from '@/components/Auth'
import { cn } from '@/lib/utils'
import { useResetPasswordPage } from './useResetPasswordPage'

function ResetPasswordContent() {
  const {
    hasToken,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    requirements,
    passwordError,
    confirmPasswordError,
    authError,
    markTouched,
    done,
    isResetting,
    handleSubmit,
  } = useResetPasswordPage()

  if (!hasToken) {
    return (
      <div className="lg-rise text-center">
        <div className="lg-pop mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-nxd/10 text-nxd">
          <SearchX size={32} />
        </div>
        <h1 className="mt-5 text-[22px] font-extrabold tracking-tight text-nxi1">
          Link inválido ou expirado
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-nxi2">
          Este link de recuperação não é válido. Solicite um novo e confira o e-mail mais recente.
        </p>
        <Link
          href="/esqueci-senha"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-nxp px-6 text-[14px] font-bold text-white transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99]"
        >
          Solicitar novo link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="lg-rise text-center">
        <div className="lg-pop mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-nxs/10 text-nxs">
          <Check size={32} strokeWidth={3} />
        </div>
        <h1 className="mt-5 text-[22px] font-extrabold tracking-tight text-nxi1">
          Senha redefinida!
        </h1>
        <p className="mt-1.5 text-[14px] text-nxi2">
          Tudo certo. Agora é só entrar com a sua nova senha.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-nxp px-6 text-[14px] font-bold text-white transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99]"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="lg-rise">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nxp/[0.08] text-nxp">
        <ShieldCheck size={24} />
      </div>
      <h1 className="mt-4 text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
        Crie uma nova senha
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-nxi2">
        Escolha uma senha forte para proteger sua conta.
      </p>

      {authError && (
        <AuthErrorBanner title="Não foi possível redefinir" message={authError} className="mt-5" />
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <AuthField id="newPassword" label="Nova senha" error={passwordError}>
          <AuthPasswordInput
            id="newPassword"
            value={newPassword}
            placeholder="Digite a nova senha"
            autoComplete="new-password"
            error={!!passwordError}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={() => markTouched('newPassword')}
          />
        </AuthField>

        <AuthField id="confirmPassword" label="Confirmar nova senha" error={confirmPasswordError}>
          <AuthPasswordInput
            id="confirmPassword"
            value={confirmPassword}
            placeholder="Repita a nova senha"
            autoComplete="new-password"
            error={!!confirmPasswordError}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => markTouched('confirmPassword')}
          />
        </AuthField>

        {/* requisitos da senha */}
        <div className="flex flex-wrap gap-2">
          {requirements.map((req) => (
            <span
              key={req.label}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] transition-colors',
                req.valid ? 'bg-nxs/10 font-semibold text-nxs' : 'bg-nxbg text-nxi3',
              )}
            >
              {req.valid && <Check size={12} strokeWidth={3} />}
              {req.label}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
        >
          {isResetting ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Salvando…
            </>
          ) : (
            'Redefinir senha'
          )}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      ctx="cliente"
      topRight={<AuthTopLink prefix="Lembrou a senha?" label="Entrar" href="/login" />}
    >
      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>
    </AuthShell>
  )
}
