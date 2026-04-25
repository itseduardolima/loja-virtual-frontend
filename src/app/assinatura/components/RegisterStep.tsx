"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

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

export function RegisterStep({
  mode,
  isSubmitting,
  planPrice,
  planName,
  onSubmitRegister,
  onSubmitLogin,
  onToggleMode,
}: RegisterStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const passwordMismatch = !!confirmPassword && password !== confirmPassword;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch) return;
    onSubmitRegister(name, email, password, whatsapp);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLogin(loginEmail, loginPassword);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-sm";

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
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-sm text-gray-600">
              {planName || "Plano"} — apenas{" "}
              <span className="font-bold text-primary">
                R$ {planPrice.toFixed(2).replace(".", ",")}/mês
              </span>
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {mode === "register" ? "Criar conta" : "Entrar"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "register"
                ? "Crie sua conta gratuita para continuar"
                : "Entre com sua conta para continuar"}
            </p>
          </div>

          {mode === "register" ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  className={`${inputClass} ${passwordMismatch ? "border-red-400" : ""}`}
                />
                {passwordMismatch && (
                  <p className="text-red-500 text-xs mt-1">
                    As senhas não conferem
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={
                  isSubmitting ||
                  !name ||
                  !email ||
                  !password ||
                  passwordMismatch
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-base transition-all bg-primary text-white hover:bg-primary/80 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? "Criando conta..." : "Criar conta e continuar"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !loginEmail || !loginPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-base transition-all bg-primary text-white hover:bg-primary/80 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? "Entrando..." : "Entrar e continuar"}
              </motion.button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              {mode === "register"
                ? "Já tenho uma conta — Entrar"
                : "Não tenho conta — Criar conta"}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
