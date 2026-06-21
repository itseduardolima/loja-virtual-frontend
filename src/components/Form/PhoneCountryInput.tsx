'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/Layout'
import type { Country } from '@/hooks/useCountries'

interface PhoneCountryInputProps {
  id: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  minLength?: number
  maxLength?: number
  required?: boolean
  inputClassName?: string
  /** Trava o país (ex.: lojas só aceitam WhatsApp brasileiro) — sem dropdown */
  lockCountry?: boolean

  // País / código
  selectedCountry: string
  onSelectedCountryChange: (countryCode: string) => void
  countriesData?: Country[]
  countriesLoading?: boolean
}

export function PhoneCountryInput({
  id,
  value,
  onValueChange,
  placeholder = '11999999999',
  minLength,
  maxLength,
  required,
  inputClassName,
  lockCountry = false,
  selectedCountry,
  onSelectedCountryChange,
  countriesData,
  countriesLoading,
}: PhoneCountryInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSelectedCountry = () =>
    countriesData?.find((c) => c.cca2 === selectedCountry)

  const getCountryCallingCode = () =>
    getSelectedCountry()?.callingCodes?.[0] || '55'

  const handleCountrySelect = (countryCode: string) => {
    onSelectedCountryChange(countryCode)
    setShowDropdown(false)
  }

  return (
    <div className="flex gap-2">
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !lockCountry && setShowDropdown(!showDropdown)}
          aria-disabled={lockCountry}
          className={`flex h-10 min-w-[80px] items-center gap-2 rounded-lg border border-nxborder bg-white px-3 transition-colors ${
            lockCountry
              ? 'cursor-default'
              : 'hover:bg-nxbg focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/30'
          }`}
        >
          {getSelectedCountry()?.flagUrl ? (
            <img
              src={getSelectedCountry()?.flagUrl}
              alt=""
              className="w-5 h-4 object-cover rounded-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : null}
          <span className="text-[13px] font-semibold text-nxi1">{getCountryCallingCode()}</span>
          {!lockCountry && <ChevronDown className="h-4 w-4 text-nxi3" />}
        </button>
        {!lockCountry && showDropdown && (
          <div className="absolute left-0 top-full z-20 mt-1 max-h-52 w-56 overflow-y-auto rounded-lg border border-nxborder bg-white py-1 shadow-lg">
            {countriesLoading ? (
              <div className="p-4 text-center">
                <LoadingSpinner size="sm" fullScreen={false} />
              </div>
            ) : (
              countriesData?.map((country) => (
                <button
                  key={country.cca2}
                  type="button"
                  onClick={() => handleCountrySelect(country.cca2)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-nxbg ${
                    selectedCountry === country.cca2 ? 'bg-nxp/[0.06] text-nxp' : 'text-nxi2'
                  }`}
                >
                  <img
                    src={country.flagUrl}
                    alt=""
                    className="h-4 w-5 rounded-sm object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="flex-1 truncate text-[13px]">{country.name.common}</span>
                  <span className="text-[11.5px] text-nxi3">+{country.callingCodes[0]}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <Input
        id={id}
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value.replace(/\D/g, ''))}
        className={inputClassName ?? 'h-10 flex-1 border-nxborder'}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
      />
    </div>
  )
}

