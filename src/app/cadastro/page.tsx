'use client'

import { Suspense } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { PhoneCountryInput } from '@/components/Form'
import { AuthField, AuthPasswordInput, AuthShell, AuthTopLink } from '@/components/Auth'
import { cn } from '@/lib/utils'
import { useCadastro } from './useCadastro'

function CadastroContent() {
  const {
    loginHref,
    name,
    setName,
    email,
    setEmail,
    whatsapp,
    handleWhatsappChange,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    selectedCountry,
    setSelectedCountry,
    countriesData,
    countriesLoading,
    requirements,
    nameError,
    emailError,
    whatsappError,
    passwordError,
    confirmPasswordError,
    markTouched,
    handleSubmit,
    isRegistering,
  } = useCadastro()

  return (
    <AuthShell
      ctx="cliente"
      wide
      topRight={<AuthTopLink prefix="Já tem conta?" label="Entrar" href={loginHref} />}
    >
      <div className="lg-rise">
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
          Crie sua conta grátis
        </h1>
        <p className="mt-1.5 text-[14px] text-nxi2">
          Acompanhe pedidos, salve favoritos e compre mais rápido.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-7" noValidate>
          {/* Seus dados */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-nxi3">
              Seus dados
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AuthField
                  id="name"
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
                  id="email"
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

              <AuthField id="whatsapp" label="WhatsApp" error={whatsappError}>
                <div onBlur={() => markTouched('whatsapp')}>
                  <PhoneCountryInput
                    id="whatsapp"
                    value={whatsapp}
                    onValueChange={handleWhatsappChange}
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

          {/* Sua senha */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-nxi3">
              Sua senha
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AuthField id="password" label="Senha" error={passwordError}>
                  <AuthPasswordInput
                    id="password"
                    value={password}
                    autoComplete="new-password"
                    error={!!passwordError}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                  />
                </AuthField>
                <AuthField
                  id="confirmPassword"
                  label="Confirmar senha"
                  error={confirmPasswordError}
                >
                  <AuthPasswordInput
                    id="confirmPassword"
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
            disabled={isRegistering}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-nxp text-[14px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-70"
          >
            {isRegistering ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Criando conta…
              </>
            ) : (
              <>
                Criar conta <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-nxi3">
          Ao criar a conta, você concorda com os{' '}
          <span className="font-semibold text-nxi2">Termos</span> e a{' '}
          <span className="font-semibold text-nxi2">Política de Privacidade</span>.
        </p>
      </div>
    </AuthShell>
  )
}

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroContent />
    </Suspense>
  )
}
