'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRegister } from '@/hooks/useRegister'
import { useCountries } from '@/hooks/useCountries'
import { isValidEmail, isValidPassword, passwordRules, passwordsMatch } from '@/schemas/authSchemas'

type CadastroField =
  | 'name'
  | 'email'
  | 'whatsapp'
  | 'password'
  | 'confirmPassword'
  | 'acceptedTerms'

export function useCadastro() {
  const searchParams = useSearchParams()
  // preserva ?redirect do fluxo da loja ao voltar para o login
  const loginQuery = searchParams.toString()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<CadastroField, boolean>>>({})

  const { register, isRegistering } = useRegister({ loginQuery })
  const { data: countriesData, isLoading: countriesLoading } = useCountries()

  const loginHref = loginQuery ? `/login?${loginQuery}` : '/login'

  const requirements = useMemo(() => passwordRules(password), [password])

  // erros derivados — só aparecem após blur (ou submit, que marca tudo)
  const nameError = touched.name && name.trim().length < 5 ? 'Informe seu nome completo.' : null
  const emailError = touched.email && !isValidEmail(email) ? 'Informe um e-mail válido.' : null
  const whatsappError =
    touched.whatsapp && whatsapp.replace(/\D/g, '').length < 8
      ? 'Informe um WhatsApp válido.'
      : null
  const passwordError =
    touched.password && !isValidPassword(password)
      ? 'A senha não atende aos requisitos abaixo.'
      : null
  const confirmPasswordError =
    touched.confirmPassword && !passwordsMatch(password, confirmPassword)
      ? 'As senhas não coincidem.'
      : null
  const acceptedTermsError =
    touched.acceptedTerms && !acceptedTerms
      ? 'É preciso aceitar os Termos de Uso e a Política de Privacidade para continuar.'
      : null

  function markTouched(field: CadastroField) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function getCountryCallingCode() {
    return countriesData?.find((c) => c.cca2 === selectedCountry)?.callingCodes?.[0] || '55'
  }

  function handleWhatsappChange(value: string) {
    setWhatsapp(value.replace(/\D/g, ''))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      whatsapp: true,
      password: true,
      confirmPassword: true,
      acceptedTerms: true,
    })

    const whatsappDigits = whatsapp.replace(/\D/g, '')
    const valid =
      name.trim().length >= 5 &&
      isValidEmail(email) &&
      whatsappDigits.length >= 8 &&
      isValidPassword(password) &&
      passwordsMatch(password, confirmPassword) &&
      acceptedTerms

    if (!valid) return

    register({
      name: name.trim(),
      email: email.trim(),
      password,
      whatsapp: `${getCountryCallingCode()}${whatsappDigits}`,
    })
  }

  return {
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
    acceptedTerms,
    setAcceptedTerms,
    countriesData,
    countriesLoading,
    requirements,
    nameError,
    emailError,
    whatsappError,
    passwordError,
    confirmPasswordError,
    acceptedTermsError,
    markTouched,
    handleSubmit,
    isRegistering,
  }
}
