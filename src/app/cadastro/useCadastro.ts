'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRegister } from '@/hooks/useRegister'
import { useCountries } from '@/hooks/useCountries'

export interface PasswordRequirement {
  label: string
  valid: boolean
}

export function useCadastro() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMismatchError, setPasswordMismatchError] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { register, isRegistering } = useRegister()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSelectedCountry = () =>
    countriesData?.find((c) => c.cca2 === selectedCountry)
  const getCountryCallingCode = () =>
    getSelectedCountry()?.callingCodes?.[0] || '55'

  const passwordRequirements = useMemo((): PasswordRequirement[] => {
    const pwd = password
    return [
      { label: 'Mínimo 8 caracteres', valid: pwd.length >= 8 },
      { label: 'Pelo menos uma letra maiúscula', valid: /[A-Z]/.test(pwd) },
      { label: 'Pelo menos um número', valid: /\d/.test(pwd) },
    ]
  }, [password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMismatchError('')

    if (!name || !email || !password || !confirmPassword) {
      return
    }

    const whatsappDigits = whatsapp.replace(/\D/g, '')
    if (!whatsappDigits || whatsappDigits.length < 8) {
      return
    }

    if (password !== confirmPassword) {
      setPasswordMismatchError('As senhas não coincidem')
      return
    }

    const whatsappFull = `${getCountryCallingCode()}${whatsappDigits}`

    register({
      name: name.trim(),
      email: email.trim(),
      password,
      whatsapp: whatsappFull,
    })
  }

  const handleWhatsappChange = (value: string) => {
    setWhatsapp(value.replace(/\D/g, ''))
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setPasswordMismatchError('')
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    whatsapp,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordMismatchError,
    selectedCountry,
    setSelectedCountry,
    showCountryDropdown,
    setShowCountryDropdown,
    dropdownRef,
    countriesData,
    countriesLoading,
    getSelectedCountry,
    getCountryCallingCode,
    passwordRequirements,
    handleSubmit,
    handleWhatsappChange,
    handleConfirmPasswordChange,
    register,
    isRegistering,
  }
}
