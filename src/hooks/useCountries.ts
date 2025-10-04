'use client'

import { useQuery } from '@tanstack/react-query'

export interface Country {
  name: {
    common: string
    official: string
  }
  cca2: string
  callingCodes: string[]
  flag: string
  flagUrl: string
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag')
      const data = await response.json()
      
      // Filtrar apenas países com códigos de chamada
      return data
        .filter((country: any) => country.idd?.root && country.idd?.suffixes)
        .map((country: any) => ({
          name: country.name,
          cca2: country.cca2,
          callingCodes: country.idd.suffixes.map((suffix: string) => country.idd.root + suffix),
          flag: country.flag,
          flagUrl: `https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`
        }))
        .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common))
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    retry: 2
  })
}
