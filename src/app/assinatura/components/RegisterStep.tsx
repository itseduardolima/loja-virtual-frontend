'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneCountryInput } from '@/components/Form'
import { useAuth } from '@/contexts/AuthContext'
import { useCountries } from '@/hooks/useCountries'
import { GoogleIcon } from '@/public/assets/icons/GoogleIcon'
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

function passwordRequirements(password: string) {
  return [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Pelo menos uma letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Pelo menos um número', valid: /[0-9]/.test(password) },
  ]
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const passwordMismatch = !!confirmPassword && password !== confirmPassword
  const reqs = passwordRequirements(password)
  const allReqsMet = reqs.every((r) => r.valid)

  const getCallingCode = () => {
    const country = countriesData?.find((c) => c.cca2 === selectedCountry)
    return country?.callingCodes?.[0] || '55'
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordMismatch || !allReqsMet) return
    const digits = whatsapp.replace(/\D/g, '')
    if (!digits || digits.length < 8) return
    onSubmitRegister(name, email, password, `${getCallingCode()}${digits}`)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitLogin(loginEmail, loginPassword)
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-lg mx-auto">
        {planPrice !== undefined && (
          <div className="bg-black/5 border border-black/[8%] rounded-xl p-3 mb-6 text-center">
            <p className="text-sm text-gray-600">
              {planName || 'Plano'} —{' '}
              <span className="font-semibold text-black">
                R$ {planPrice.toFixed(2).replace('.', ',')}/mês
              </span>
            </p>
          </div>
        )}

        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-7">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie sua conta grátis.</h1>
              <p className="text-sm text-gray-400 mb-8">Comece a vender em poucos minutos.</p>

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Seus dados
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name" className="text-[13px] font-semibold text-gray-700">
                      Nome completo <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email" className="text-[13px] font-semibold text-gray-700">
                      E-mail <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-whatsapp" className="text-[13px] font-semibold text-gray-700">
                    WhatsApp <span className="text-red-400">*</span>
                  </Label>
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
                    inputClassName="flex-1 h-11 border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Sua senha
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="text-[13px] font-semibold text-gray-700">
                      Senha <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 px-3.5 pr-10 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-confirm" className="text-[13px] font-semibold text-gray-700">
                      Confirmar senha <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                          'h-11 px-3.5 pr-10 rounded-lg text-sm focus-visible:ring-black/10',
                          passwordMismatch
                            ? 'border-red-400 focus-visible:border-red-400'
                            : 'border-gray-200 focus-visible:border-black',
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordMismatch && (
                      <p className="text-xs text-red-500 mt-1">As senhas não conferem</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {reqs.map((req) => (
                    <span
                      key={req.label}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all duration-200',
                        req.valid ? 'bg-black/10 text-black font-semibold' : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      {req.valid && <Check className="w-3 h-3" strokeWidth={3} />}
                      {req.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-black hover:bg-gray-900 text-white rounded-lg"
              disabled={isSubmitting || !name || !email || !password || whatsapp.replace(/\D/g, '').length < 8 || passwordMismatch || !allReqsMet}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando conta...
                </>
              ) : 'Criar conta e continuar'}
            </Button>

            <p className="text-center text-sm text-gray-400">
              Já tenho uma conta.{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-semibold text-gray-700 hover:text-black transition-colors"
              >
                Entrar →
              </button>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium border-gray-200 rounded-lg gap-2.5 hover:bg-gray-50 hover:border-gray-300"
              onClick={loginWithGoogle}
              disabled={isSubmitting}
            >
              <GoogleIcon />
              Continuar com Google
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h1>
              <p className="text-sm text-gray-400 mb-8">Entre na sua conta para continuar.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-[13px] font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-[13px] font-semibold text-gray-700">
                  Senha
                </Label>
                <a href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="h-11 px-3.5 pr-10 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-black hover:bg-gray-900 text-white rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-gray-400">
              Novo por aqui?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-semibold text-gray-700 hover:text-black transition-colors"
              >
                Criar conta →
              </button>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium border-gray-200 rounded-lg gap-2.5 hover:bg-gray-50 hover:border-gray-300"
              onClick={loginWithGoogle}
              disabled={isSubmitting}
            >
              <GoogleIcon />
              Entrar com Google
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  )
}
