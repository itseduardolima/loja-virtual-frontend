'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useLogin } from '@/hooks/useLogin'
import { GoogleIcon } from '@/public/assets/icons/GoogleIcon'
import { useAuth } from '@/contexts/AuthContext'
import { NexoLeftPanel } from '@/components/Layout/NexoLeftPanel'

const BULLETS = [
  'Loja própria em minutos',
  'Gestão de pedidos e catálogo',
  'Suporte e relatórios em tempo real',
]

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login: loginFunction, isLoading } = useLogin()
  const { loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!login || !password) return
    try {
      await loginFunction({ login, password })
    } catch (error: any) {
      console.error('Erro no login:', error)
    }
  }

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
            Novo por aqui?{' '}
            <Link href="/cadastro" className="font-semibold text-gray-700 hover:text-black transition-colors">
              Criar conta →
            </Link>
          </span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 overflow-y-auto">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h1>
            <p className="text-sm text-gray-400 mb-8">Entre na sua conta para continuar.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-semibold text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="h-11 px-3.5 rounded-lg border-gray-200 text-sm focus-visible:ring-black/10 focus-visible:border-black"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-gray-700">
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
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

              <Button
                type="submit"
                className="w-full h-11 text-sm font-semibold bg-black hover:bg-gray-900 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : 'Entrar'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 text-sm font-medium border-gray-200 rounded-lg gap-2.5 hover:bg-gray-50 hover:border-gray-300"
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
            >
              <GoogleIcon />
              Entrar com Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
