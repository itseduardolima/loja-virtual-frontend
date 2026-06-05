'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCadastro } from './useCadastro'
import { PhoneCountryInput } from '@/components/Form'
import { NexoLeftPanel } from '@/components/Layout'
import { cn } from '@/lib/utils'

const BULLETS = [
  'Loja própria em minutos',
  'Gestão de pedidos e catálogo',
  'Suporte e relatórios em tempo real',
]

export default function CadastroPage() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordMismatchError,
    whatsapp,
    selectedCountry,
    setSelectedCountry,
    countriesData,
    countriesLoading,
    passwordRequirements,
    handleSubmit,
    handleWhatsappChange,
    handleConfirmPasswordChange,
    isRegistering,
  } = useCadastro()

  return (
    <div className="flex h-screen overflow-hidden">
      <NexoLeftPanel
        footer={
          <p className="text-xs text-white/35">
            +2.400 vendedores ativos na plataforma
          </p>
        }
      >
        <div>
          <h2 className="text-2xl font-bold text-white leading-snug mb-2">
            Venda online.<br />Cresça de verdade.
          </h2>
          <p className="text-sm mb-8 text-white/50">
            Tudo que você precisa para vender mais.
          </p>
          <div className="flex flex-col gap-3.5">
            {BULLETS.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-white/[12%]">
                  <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm text-white/75">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </NexoLeftPanel>

      {/* Right — form */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top-right link */}
        <div className="flex justify-end px-10 pt-8 pb-0 flex-shrink-0">
          <span className="text-sm text-gray-400">
            Já tenho conta.{' '}
            <Link href="/login" className="font-semibold text-gray-700 hover:text-black transition-colors">
              Entrar →
            </Link>
          </span>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 sm:px-14 lg:px-20 py-8">
            <div className="w-full max-w-lg mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie sua conta grátis.</h1>
              <p className="text-sm text-gray-400 mb-8">Comece a vender em poucos minutos.</p>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Seus dados */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Seus dados
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nome */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[13px] font-semibold text-gray-700">
                          Nome completo <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                          minLength={5}
                          maxLength={40}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[13px] font-semibold text-gray-700">
                          E-mail <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                          required
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp" className="text-[13px] font-semibold text-gray-700">
                        WhatsApp <span className="text-red-400">*</span>
                      </Label>
                      <PhoneCountryInput
                        id="whatsapp"
                        value={whatsapp}
                        onValueChange={(val) => handleWhatsappChange({ target: { value: val } } as any)}
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

                {/* Sua senha */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Sua senha
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Senha */}
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[13px] font-semibold text-gray-700">
                          Senha <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 px-3.5 pr-10 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirmar senha */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-gray-700">
                          Confirmar senha <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={cn(
                              'h-11 px-3.5 pr-10 rounded-lg text-sm focus-visible:ring-black/10',
                              passwordMismatchError
                                ? 'border-red-400 focus-visible:border-red-400'
                                : 'border-gray-200 focus-visible:border-black',
                            )}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordMismatchError && (
                          <p className="text-xs text-red-500 mt-1">{passwordMismatchError}</p>
                        )}
                      </div>
                    </div>

                    {/* Password chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {passwordRequirements.map((req) => (
                        <span
                          key={req.label}
                          className={cn(
                            'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all duration-200',
                            req.valid
                              ? 'bg-black/10 text-black font-semibold'
                              : 'bg-gray-100 text-gray-400',
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
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : 'Criar conta'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
