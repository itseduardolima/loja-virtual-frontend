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

// Lista local de DDIs. A API pública restcountries.com/v3.1 foi descontinuada
// (passou a responder { success: false, ... }), então mantemos os países aqui —
// é estável, instantâneo e suficiente para um seletor de telefone.
// Bandeira via flagcdn (por cca2). Ordenada por nome no hook.
const RAW_COUNTRIES: Array<{ cca2: string; name: string; code: string }> = [
  { cca2: 'BR', name: 'Brasil', code: '55' },
  { cca2: 'PT', name: 'Portugal', code: '351' },
  { cca2: 'US', name: 'Estados Unidos', code: '1' },
  { cca2: 'CA', name: 'Canadá', code: '1' },
  { cca2: 'AR', name: 'Argentina', code: '54' },
  { cca2: 'CL', name: 'Chile', code: '56' },
  { cca2: 'CO', name: 'Colômbia', code: '57' },
  { cca2: 'MX', name: 'México', code: '52' },
  { cca2: 'PY', name: 'Paraguai', code: '595' },
  { cca2: 'UY', name: 'Uruguai', code: '598' },
  { cca2: 'PE', name: 'Peru', code: '51' },
  { cca2: 'BO', name: 'Bolívia', code: '591' },
  { cca2: 'EC', name: 'Equador', code: '593' },
  { cca2: 'VE', name: 'Venezuela', code: '58' },
  { cca2: 'ES', name: 'Espanha', code: '34' },
  { cca2: 'FR', name: 'França', code: '33' },
  { cca2: 'DE', name: 'Alemanha', code: '49' },
  { cca2: 'IT', name: 'Itália', code: '39' },
  { cca2: 'GB', name: 'Reino Unido', code: '44' },
  { cca2: 'IE', name: 'Irlanda', code: '353' },
  { cca2: 'NL', name: 'Países Baixos', code: '31' },
  { cca2: 'BE', name: 'Bélgica', code: '32' },
  { cca2: 'CH', name: 'Suíça', code: '41' },
  { cca2: 'AT', name: 'Áustria', code: '43' },
  { cca2: 'SE', name: 'Suécia', code: '46' },
  { cca2: 'NO', name: 'Noruega', code: '47' },
  { cca2: 'DK', name: 'Dinamarca', code: '45' },
  { cca2: 'FI', name: 'Finlândia', code: '358' },
  { cca2: 'PL', name: 'Polônia', code: '48' },
  { cca2: 'RU', name: 'Rússia', code: '7' },
  { cca2: 'UA', name: 'Ucrânia', code: '380' },
  { cca2: 'AU', name: 'Austrália', code: '61' },
  { cca2: 'NZ', name: 'Nova Zelândia', code: '64' },
  { cca2: 'JP', name: 'Japão', code: '81' },
  { cca2: 'CN', name: 'China', code: '86' },
  { cca2: 'KR', name: 'Coreia do Sul', code: '82' },
  { cca2: 'IN', name: 'Índia', code: '91' },
  { cca2: 'ZA', name: 'África do Sul', code: '27' },
  { cca2: 'AO', name: 'Angola', code: '244' },
  { cca2: 'MZ', name: 'Moçambique', code: '258' },
  { cca2: 'CV', name: 'Cabo Verde', code: '238' },
  { cca2: 'NG', name: 'Nigéria', code: '234' },
]

const LOCAL_COUNTRIES: Country[] = RAW_COUNTRIES.map((c) => ({
  name: { common: c.name, official: c.name },
  cca2: c.cca2,
  callingCodes: [c.code],
  flag: '',
  flagUrl: `https://flagcdn.com/w20/${c.cca2.toLowerCase()}.png`,
})).sort((a, b) => a.name.common.localeCompare(b.name.common))

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => LOCAL_COUNTRIES,
    staleTime: Infinity,
  })
}
