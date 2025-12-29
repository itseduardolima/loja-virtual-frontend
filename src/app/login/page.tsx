"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { GoogleIcon } from "@/public/assets/icons/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login: loginFunction, isLoading } = useLogin();
  const { loginWithGoogle } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) {
      return;
    }

    try {
      await loginFunction({ login, password });
    } catch (error: any) {
      console.error('Erro no login:', error);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl border rounded-2xl p-10 bg-white shadow-sm">
          {/* Botão Voltar */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2 hover:bg-transparent -ml-5"
            >
              <ChevronLeft className="w-6 h-6" />
              Voltar
            </Button>
          </div>

          {/* Logo/Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600">Entre na sua conta para continuar</p>
          </div>

          {/* Formulário */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center"></div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu a senha?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              {/* Divisor */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full h-12"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    Entrar com Google
                  </Button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                >
                  Cadastre-se
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
