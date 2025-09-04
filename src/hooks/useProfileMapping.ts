'use client'

import { PROFILE_IDS, PROFILE_ROUTES, PROFILE_TRANSACTIONS, type UserProfile } from '@/types/auth'

export function useProfileMapping() {
  const getProfileByID = (profileId: number): UserProfile | null => {
    const mapping = {
      [PROFILE_IDS.Administrador]: 'Administrador' as UserProfile,
      [PROFILE_IDS.Vendedor]: 'Vendedor' as UserProfile,
      [PROFILE_IDS.Cliente]: 'Cliente' as UserProfile,
    }
    return mapping[profileId as keyof typeof mapping] || null
  }

  const getProfileID = (profile: UserProfile): number => {
    return PROFILE_IDS[profile]
  }

  const getProfileRoute = (profile: UserProfile): string => {
    return PROFILE_ROUTES[profile]
  }

  const getProfileTransactions = (profile: UserProfile): number[] => {
    return [...PROFILE_TRANSACTIONS[profile]]
  }

  const getProfileRouteByID = (profileId: number): string | null => {
    const profile = getProfileByID(profileId)
    return profile ? getProfileRoute(profile) : null
  }

  return {
    getProfileByID,
    getProfileID,
    getProfileRoute,
    getProfileTransactions,
    getProfileRouteByID,
    PROFILE_IDS,
    PROFILE_ROUTES,
    PROFILE_TRANSACTIONS
  }
}
