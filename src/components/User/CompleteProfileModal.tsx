'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-react'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { useCountries } from '@/hooks/useCountries'
import { UpdateCustomerProfileDto } from '@/types/customer'
import { LoadingSpinner } from '@/components/Layout/LoadingSpinner'

interface CompleteProfileModalProps {
  isOpen: boolean
  initialData?: {
    phone?: string | null
    address_street?: string | null
    address_city?: string | null
    address_state?: string | null
    address_zipcode?: string | null
    address_country?: string | null
  }
  onComplete: () => void
}

export function CompleteProfileModal({
  isOpen,
  initialData,
  onComplete,
}: CompleteProfileModalProps) {
  const { updateProfileAsync, isUpdating } = useCustomerProfile()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [address_street, setAddressStreet] = useState(initialData?.address_street ?? '')
  const [address_city, setAddressCity] = useState(initialData?.address_city ?? '')
  const [address_state, setAddressState] = useState(initialData?.address_state ?? '')
  const [address_zipcode, setAddressZipcode] = useState(initialData?.address_zipcode ?? '')
  const [address_country, setAddressCountry] = useState(initialData?.address_country ?? 'Brasil')
  const needsPhone = !initialData || initialData.phone == null

  const getSelectedCountry = () =>
    countriesData?.find((c) => c.cca2 === selectedCountry)
  const getCountryCallingCode = () =>
    getSelectedCountry()?.callingCodes?.[0] || '55'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (initialData) {
      const raw = (initialData.phone ?? '').replace(/\D/g, '')
      if (raw.startsWith('55')) {
        setSelectedCountry('BR')
        setPhone(raw.slice(2))
      } else {
        setPhone(raw)
      }
      setAddressStreet(initialData.address_street ?? '')
      setAddressCity(initialData.address_city ?? '')
      setAddressState(initialData.address_state ?? '')
      setAddressZipcode(initialData.address_zipcode ?? '')
      setAddressCountry(initialData.address_country ?? 'Brasil')
    }
  }, [initialData])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneDigits = phone.replace(/\D/g, '')
    if (needsPhone) {
      if (!phoneDigits || phoneDigits.length < 8) return
    }
    if (!address_street.trim() || !address_city.trim()) return

    const data: UpdateCustomerProfileDto = {
      address_street: address_street.trim(),
      address_city: address_city.trim(),
      address_state: address_state.trim() || undefined,
      address_zipcode: address_zipcode.trim() || undefined,
      address_country: address_country.trim() || 'Brasil',
    }

    if (needsPhone) {
      const phoneFull = `${getCountryCallingCode()}${phoneDigits}`
      data.phone = phoneFull
    }

    try {
      await updateProfileAsync(data)
      onComplete()
    } catch {
      // toast já é tratado no hook
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Complete seu cadastro
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Para continuar, preencha seu WhatsApp e endereço.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {needsPhone && (
              <div className="space-y-2">
                <Label htmlFor="complete-phone" className="text-sm font-medium text-gray-700">
                  WhatsApp <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center rounded-xl h-11 gap-2 px-3 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 min-w-[76px] transition-colors"
                    >
                      {getSelectedCountry()?.flagUrl ? (
                        <img
                          src={getSelectedCountry()?.flagUrl}
                          alt=""
                          className="w-5 h-4 object-cover rounded-sm"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : null}
                      <span className="text-sm font-medium text-gray-700">{getCountryCallingCode()}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 z-20 w-56 max-h-52 overflow-y-auto bg-white border border-gray-200 shadow-lg mt-1 py-1 rounded-lg">
                        {countriesLoading ? (
                          <div className="p-4 text-center">
                            <LoadingSpinner size="sm" fullScreen={false} />
                          </div>
                        ) : (
                          countriesData?.map((country) => (
                            <button
                              key={country.cca2}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country.cca2)
                                setShowCountryDropdown(false)
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                                selectedCountry === country.cca2 ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <img src={country.flagUrl} alt="" className="w-5 h-4 object-cover rounded-sm" />
                              <span className="flex-1 text-sm truncate">{country.name.common}</span>
                              <span className="text-xs text-gray-500">+{country.callingCodes[0]}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Input
                    id="complete-phone"
                    type="tel"
                    placeholder="11999998888"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="flex-1 h-11 border-gray-200"
                    minLength={8}
                    maxLength={15}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Endereço</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complete-zipcode" className="text-sm font-medium text-gray-700">
                    CEP
                  </Label>
                  <Input
                    id="complete-zipcode"
                    value={address_zipcode}
                    onChange={(e) => setAddressZipcode(e.target.value)}
                    placeholder="Digite seu CEP"
                    className="h-11 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complete-country" className="text-sm font-medium text-gray-700">
                    País
                  </Label>
                  <Input
                    id="complete-country"
                    value={address_country}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    placeholder="Digite seu país"
                    className="h-11 border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complete-street" className="text-sm font-medium text-gray-700">
                  Bairro, Rua, número e complemento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="complete-street"
                  value={address_street}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="Digite seu endereço"
                  className="h-11 border-gray-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complete-city" className="text-sm font-medium text-gray-700">
                    Cidade <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="complete-city"
                    value={address_city}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Digite sua cidade"
                    className="h-11 border-gray-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complete-state" className="text-sm font-medium text-gray-700">
                    Estado (UF)
                  </Label>
                  <Input
                    id="complete-state"
                    value={address_state}
                    onChange={(e) => setAddressState(e.target.value.toUpperCase())}
                    placeholder="Digite seu estado"
                    maxLength={2}
                    className="h-11 border-gray-200"
                  />
                </div>
              </div>

           
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <LoadingSpinner size="sm" fullScreen={false} className="mr-2 inline-flex" />
                    Salvando...
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
