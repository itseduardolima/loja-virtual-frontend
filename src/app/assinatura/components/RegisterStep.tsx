"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/public/assets/icons/GoogleIcon";

interface RegisterStepProps {
  mode: "register" | "login";
  isSubmitting: boolean;
  planPrice?: number;
  planName?: string;
  onSubmitRegister: (
    name: string,
    email: string,
    password: string,
    whatsapp: string
  ) => void;
  onSubmitLogin: (email: string, password: string) => void;
  onToggleMode: () => void;
}

function passwordRequirements(password: string) {
  return [
    { label: "Mínimo 8 caracteres", valid: password.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "Pelo menos um número", valid: /[0-9]/.test(password) },
  ];
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
  const { loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const passwordMismatch = !!confirmPassword && password !== confirmPassword;
  const reqs = passwordRequirements(password);
  const allReqsMet = reqs.every((r) => r.valid);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch || !allReqsMet) return;
    onSubmitRegister(name, email, password, whatsapp);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLogin(loginEmail, loginPassword);
  };

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-5 text-center"
          >
            <p className="text-sm text-gray-600">
              {planName || "Plano"} —{" "}
              <span className="font-semibold text-primary">
                R$ {planPrice.toFixed(2).replace(".", ",")}/mês
              </span>
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {mode === "register" ? "Criar conta" : "Bem-vindo de volta"}
            </h2>
            <p className="text-gray-600 text-sm">
              {mode === "register"
                ? "Crie sua conta gratuita para continuar"
                : "Entre na sua conta para continuar"}
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {mode === "register" ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Nome completo <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                        required
                        minLength={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-email"
                      className="text-sm font-medium text-slate-700"
                    >
                      E-mail <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-whatsapp"
                      className="text-sm font-medium text-slate-700"
                    >
                      WhatsApp{" "}
                      <span className="text-slate-400 font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-whatsapp"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-password"
                        className="text-sm font-medium text-slate-700"
                      >
                        Senha <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 border-slate-200 focus:border-slate-400"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-confirm"
                        className="text-sm font-medium text-slate-700"
                      >
                        Confirmar senha <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="reg-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repita a senha"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`pl-10 pr-10 h-11 ${
                            passwordMismatch
                              ? "border-red-400 focus:border-red-500"
                              : "border-slate-200 focus:border-slate-400"
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordMismatch && (
                        <p className="text-xs text-red-600">
                          As senhas não conferem
                        </p>
                      )}
                    </div>
                  </div>

                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-col gap-2 pt-1"
                    >
                      {reqs.map((req) => (
                        <span
                          key={req.label}
                          className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                            req.valid ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                              req.valid
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200"
                            }`}
                          >
                            {req.valid && (
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            )}
                          </span>
                          {req.label}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={
                      isSubmitting ||
                      !name ||
                      !email ||
                      !password ||
                      passwordMismatch ||
                      !allReqsMet
                    }
                  >
                    {isSubmitting ? "Criando conta..." : "Criar conta e continuar"}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Já tenho uma conta?{" "}
                    <button
                      type="button"
                      onClick={onToggleMode}
                      className="font-medium text-slate-700 hover:text-slate-900 hover:underline transition-colors"
                    >
                      Entrar
                    </button>
                  </p>

                  <div className="pt-2">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Ou registre-se com
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12"
                        onClick={loginWithGoogle}
                        disabled={isSubmitting}
                      >
                        <GoogleIcon />
                        Continuar com Google
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-12 h-12 text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showLoginPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Não tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={onToggleMode}
                      className="font-medium text-primary hover:underline"
                    >
                      Cadastre-se
                    </button>
                  </p>

                  <div className="mt-2">
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
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12"
                        onClick={loginWithGoogle}
                        disabled={isSubmitting}
                      >
                        <GoogleIcon />
                        Entrar com Google
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
