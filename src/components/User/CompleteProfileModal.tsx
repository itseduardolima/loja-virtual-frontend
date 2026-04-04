'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { useCountries } from '@/hooks/useCountries'
import { UpdateCustomerProfileDto } from '@/types/customer'
import { LoadingSpinner } from '@/components/Layout/LoadingSpinner'

interface CompleteProfileModalProps {
  isOpen: boolean
  initialData?: {
    phone?: string | null
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
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const needsPhone = initialData?.phone == null || initialData?.phone === ''

  const getSelectedCountry = () =>
    countriesData?.find((c) => c.cca2 === selectedCountry)
  const getCountryCallingCode = () =>
    getSelectedCountry()?.callingCodes?.[0] || '55'

  const canSubmit = !needsPhone || phone.replace(/\D/g, '').length >= 8

  useEffect(() => {
    if (initialData?.phone) {
      const raw = initialData.phone.replace(/\D/g, '')
      if (raw.startsWith('55')) {
        setSelectedCountry('BR')
        setPhone(raw.slice(2))
      } else {
        setPhone(raw)
      }
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneDigits = phone.replace(/\D/g, '')
    if (needsPhone && (!phoneDigits || phoneDigits.length < 8)) {
      toast.error('Informe um WhatsApp válido para continuar.')
      return
    }

    const phoneFull = needsPhone && phoneDigits ? `${getCountryCallingCode()}${phoneDigits}` : ''
    const data: UpdateCustomerProfileDto = {}
    if (needsPhone) data.phone = phoneFull

    try {
      await updateProfileAsync(data)
      onComplete()
    } catch {
      // toast já é tratado no hook useCustomerProfile
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Complete seu cadastro
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {needsPhone && (
              <div className="space-y-2">
                <Label htmlFor="complete-phone" className="text-sm font-medium text-gray-700">
                  WhatsApp <span className="text-red-500">*</span>
                </Label>
                <PhoneCountryInput
                  id="complete-phone"
                  value={phone}
                  onValueChange={(val) => setPhone(val)}
                  placeholder="11999998888"
                  minLength={8}
                  maxLength={15}
                  required
                  selectedCountry={selectedCountry}
                  onSelectedCountryChange={setSelectedCountry}
                  countriesData={countriesData}
                  countriesLoading={countriesLoading}
                  inputClassName="flex-1 h-11 border-gray-200"
                />
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isUpdating || !canSubmit}
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
