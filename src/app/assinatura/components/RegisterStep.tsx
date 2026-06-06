'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { PhoneCountryInput } from '@/components/Form'
import { AuthField, AuthGoogleButton, AuthPasswordInput } from '@/components/Auth'
import { useAuth } from '@/contexts/AuthContext'
import { useCountries } from '@/hooks/useCountries'
import { isValidEmail, isValidPassword, passwordRules, passwordsMatch } from '@/schemas/authSchemas'
import { cn } from '@/lib/utils'

interface RegisterStepProps {
  mode: 'register' | 'login'
  isSubmitting: boolean
  planPrice?: number
  planName?: string
  onSubmitRegister: (name: string, email: string, password: string, whatsapp: string) => void
  onSubmitLogin: (email: string, password: string) => void
  onToggleMode: () => void
}

type RegisterField = 'name' | 'email' | 'whatsapp' | 'password' | 'confirmPassword'

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-nxborder" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-[12px] font-medium text-nxi3">ou</span>
      </div>
    </div>
  )
}

export function RegisterStep({
  mode,
  isSubmitting,
  planPrice,
  planName,
  onSubmitRegister,
  onSubmitLogin,
  onToggleMode,
}: RegisterStepProps) {
  const { loginWithGoogle } = useAuth()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()
  const [selectedCountry, setSelectedCountry] = useState('BR')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({})

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginTouched, setLoginTouched] = useState<{ email?: boolean; password?: boolean }>({})

  const requirements = passwordRules(password)
  const whatsappDigits = whatsapp.replace(/\D/g, '')

  // erros derivados — aparecem após blur (ou submit, que marca tudo)
  const nameError = touched.name && name.trim().length < 5 ? 'Informe seu nome completo.' : null
  const emailError = touched.email && !isValidEmail(email) ? 'Informe um e-mail válido.' : null
  const whatsappError =
    touched.whatsapp && whatsappDigits.length < 8 ? 'Informe um WhatsApp válido.' : null
  const passwordError =
    touched.password && !isValidPassword(password)
      ? 'A senha não atende aos requisitos abaixo.'
      : null
  const confirmPasswordError =
    touched.confirmPassword && !passwordsMatch(password, confirmPassword)
      ? 'As senhas não coincidem.'
      : null

  const loginEmailError =
    loginTouched.email && !isValidEmail(loginEmail) ? 'Informe um e-mail válido.' : null
  const loginPasswordError =
    loginTouched.password && loginPassword.length < 1 ? 'Informe sua senha.' : null

  function markTouched(field: RegisterField) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const getCallingCode = () => {
    const country = countriesData?.find((c) => c.cca2 === selectedCountry)
    return country?.callingCodes?.[0] || '55'
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, whatsapp: true, password: true, confirmPassword: true })

    const valid =
      name.trim().length >= 5 &&
      isValidEmail(email) &&
      whatsappDigits.length >= 8 &&
      isValidPassword(password) &&
      passwordsMatch(password, confirmPassword)
    if (!valid) return

    onSubmitRegister(name.trim(), email.trim(), password, `${getCallingCode()}${whatsappDigits}`)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginTouched({ email: true, password: true })
    if (!isValidEmail(loginEmail) || loginPassword.length < 1) return
    onSubmitLogin(loginEmail.trim(), loginPassword)
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn('mx-auto w-full', mode === 'register' ? 'max-w-[460px]' : 'max-w-[380px]')}
      >
        {planPrice !== undefined && (
          <div className="mb-6 rounded-xl border border-nxp/15 bg-nxp/[0.04] px-3.5 py-3 text-center">
            <p className="text-[13px] text-nxi2">
              {planName || 'Plano'} —{' '}
              <span className="font-bold text-nxp">
                R$ {planPrice.toFixed(2).replace('.', ',')}/mês
              </span>
            </p>
          </div>
        )}

        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-7" noValidate>
            <div>
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
                Crie sua conta grátis
              </h1>
              <p className="mb-7 mt-1.5 text-[14px] text-nxi2">
                Comece a vender em poucos minutos.
              </p>

              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-nxi3">
                Seus dados
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AuthField
                    id="reg-name"
                    label="Nome completo"
                    value={name}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    maxLength={40}
                    error={nameError}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => markTouched('name')}
                  />
                  <AuthField
                    id="reg-email"
                    label="E-mail"
                    type="email"
                    value={email}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    error={emailError}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                  />
                </div>

                <AuthField id="reg-whatsapp" label="WhatsApp" error={whatsappError}>
                  <div onBlur={() => markTouched('whatsapp')}>
                    <PhoneCountryInput
                      id="reg-whatsapp"
                      value={whatsapp}
                      onValueChange={setWhatsapp}
                      placeholder="(11) 99999-9999"
                      minLength={8}
                      maxLength={15}
                      required
                      selectedCountry={selectedCountry}
                      onSelectedCountryChange={setSelectedCountry}
                      countriesData={countriesData}
                      countriesLoading={countriesLoading}
                      inputClassName={cn(
                        'flex-1 h-11 rounded-xl text-[14px] placeholder:text-nxi3',
                        whatsappError
                          ? 'border-nxd focus-visible:border-nxd focus-visible:ring-nxd/15'
                          : 'border-nxborder focus-visible:border-nxp focus-visible:ring-nxp/15',
                      )}
                    />
                  </div>
                </AuthField>
              </div>
            </div>

            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-nxi3">
                Sua senha
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AuthField id="reg-password" label="Senha" error={passwordError}>
                    <AuthPasswordInput
                      id="reg-password"
                      value={password}
                      autoComplete="new-password"
                      error={!!passwordError}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => markTouched('password')}
                    />
                  </AuthField>
                  <AuthField id="reg-confirm" label="Confirmar senha" error={confirmPasswordError}>
                    <AuthPasswordInput
                      id="reg-confirm"
                      value={confirmPassword}
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      error={!!confirmPasswordError}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => markTouched('confirmPassword')}
                    />
                  </AuthField>
                </div>

                {/* requisitos da senha */}
                <div className="flex flex-wrap gap-2 pt-1">
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
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Criando conta…
                </>
              ) : (
                <>
                  Criar conta e continuar <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-[13px] text-nxi3">
              Já tenho uma conta.{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-bold text-nxp transition-colors hover:text-nxp/80"
              >
                Entrar →
              </button>
            </p>

            <Divider />

            <AuthGoogleButton
              onClick={loginWithGoogle}
              disabled={isSubmitting}
              label="Continuar com Google"
            />
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            <div>
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
                Bem-vindo de volta
              </h1>
              <p className="mb-6 mt-1.5 text-[14px] text-nxi2">
                Entre na sua conta para continuar.
              </p>
            </div>

            <AuthField
              id="login-email"
              label="E-mail"
              type="email"
              value={loginEmail}
              placeholder="seu@email.com"
              autoComplete="email"
              error={loginEmailError}
              onChange={(e) => setLoginEmail(e.target.value)}
              onBlur={() => setLoginTouched((t) => ({ ...t, email: true }))}
            />

            <AuthField
              id="login-password"
              label="Senha"
              error={loginPasswordError}
              right={
                <Link
                  href="/esqueci-senha"
                  className="text-[12px] font-semibold text-nxp transition-colors hover:text-nxp/80"
                >
                  Esqueceu a senha?
                </Link>
              }
            >
              <AuthPasswordInput
                id="login-password"
                value={loginPassword}
                autoComplete="current-password"
                error={!!loginPasswordError}
                onChange={(e) => setLoginPassword(e.target.value)}
                onBlur={() => setLoginTouched((t) => ({ ...t, password: true }))}
              />
            </AuthField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Entrando…
                </>
              ) : (
                <>
                  Entrar <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-[13px] text-nxi3">
              Novo por aqui?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-bold text-nxp transition-colors hover:text-nxp/80"
              >
                Criar conta →
              </button>
            </p>

            <Divider />

            <AuthGoogleButton onClick={loginWithGoogle} disabled={isSubmitting} />
          </form>
        )}
      </div>
    </motion.div>
  )
}
