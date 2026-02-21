"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ChevronLeft, User, Phone, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useCountries } from "@/hooks/useCountries";
import { LoadingSpinner } from "@/components";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("BR");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { register, isRegistering } = useRegister();
  const router = useRouter();
  const { data: countriesData, isLoading: countriesLoading } = useCountries();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedCountry = () =>
    countriesData?.find((c) => c.cca2 === selectedCountry);
  const getCountryCallingCode = () =>
    getSelectedCountry()?.callingCodes?.[0] || "55";

  const passwordRequirements = useMemo(() => {
    const pwd = password;
    const hasLength = pwd.length >= 8 && pwd.length <= 12;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&]/.test(pwd);
    return [
      { label: "8 a 12 caracteres", valid: hasLength },
      { label: "Pelo menos uma letra", valid: hasLetter },
      { label: "Pelo menos um número", valid: hasNumber },
      { label: "Um caractere especial (@$!%*?&)", valid: hasSpecial },
    ];
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatchError("");

    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    const whatsappDigits = whatsapp.replace(/\D/g, "");
    if (!whatsappDigits || whatsappDigits.length < 8) {
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatchError("As senhas não coincidem");
      return;
    }

    const whatsappFull = `${getCountryCallingCode()}${whatsappDigits}`;

    register({
      name: name.trim(),
      email: email.trim(),
      password,
      whatsapp: whatsappFull,
    });
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setWhatsapp(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
    

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Nome completo <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11  border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                    minLength={5}
                    maxLength={40}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  E-mail <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11  border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-slate-700">
                WhatsApp <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center rounded-xl h-11 gap-2 px-3  border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 min-w-[76px] transition-colors"
                  >
                    {getSelectedCountry()?.flagUrl ? (
                      <img
                        src={getSelectedCountry()?.flagUrl}
                        alt=""
                        className="w-5 h-4 object-cover rounded-sm"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : null}
                    <span className="text-sm font-medium text-slate-700">{getCountryCallingCode()}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 z-20 w-56 max-h-52 overflow-y-auto bg-white border border-slate-200  shadow-lg mt-1 py-1 scrollbar-thin">
                      {countriesLoading ? (
                        <div className="p-4 text-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      ) : (
                        countriesData?.map((country) => (
                          <button
                            key={country.cca2}
                            type="button"
                            onClick={() => { setSelectedCountry(country.cca2); setShowCountryDropdown(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                              selectedCountry === country.cca2 ? "bg-slate-100 text-slate-900" : "text-slate-700"
                            }`}
                          >
                            <img src={country.flagUrl} alt="" className="w-5 h-4 object-cover rounded-sm" />
                            <span className="flex-1 text-sm truncate">{country.name.common}</span>
                            <span className="text-xs text-slate-500">+{country.callingCodes[0]}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="11999998888"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  className="flex-1 h-11  border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                  minLength={8}
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* Senhas */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11  border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                      minLength={8}
                      maxLength={12}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirmar senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMismatchError(""); }}
                      className={`pl-10 pr-10 h-11  focus:ring-slate-400/20 ${
                        passwordMismatchError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordMismatchError && (
                    <p className="text-xs text-red-600 mt-1">{passwordMismatchError}</p>
                  )}
                </div>
              </div>

              {/* Requisitos da senha */}
              <div className="py-3">
                <p className="text-xs font-medium text-slate-500 mb-2.5">Requisitos da senha</p>
                <div className="flex flex-col gap-3">
                  {passwordRequirements.map((req) => (
                    <span
                      key={req.label}
                      className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                        req.valid ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                          req.valid ? "bg-emerald-500 text-white" : "bg-slate-200"
                        }`}
                      >
                        {req.valid && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                      </span>
                      {req.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold  bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              disabled={isRegistering}
            >
              {isRegistering ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-2">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-slate-700 hover:text-slate-900 hover:underline transition-colors">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
