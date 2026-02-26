'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/Layout/LoadingSpinner'
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
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center rounded-xl h-11 gap-2 px-3 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400/20 focus:border-gray-400 min-w-[76px] transition-colors"
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
          <span className="text-sm font-medium text-gray-700">
            {getCountryCallingCode()}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        {showDropdown && (
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
                  onClick={() => handleCountrySelect(country.cca2)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    selectedCountry === country.cca2
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <img
                    src={country.flagUrl}
                    alt=""
                    className="w-5 h-4 object-cover rounded-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="flex-1 text-sm truncate">
                    {country.name.common}
                  </span>
                  <span className="text-xs text-gray-500">
                    +{country.callingCodes[0]}
                  </span>
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
        className={inputClassName ?? 'flex-1 h-11 border-gray-200'}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
      />
    </div>
  )
}

