'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdminUser } from '@/hooks/useAdminUsers'

const PROFILE_NAMES: Record<number, string> = {
  1: 'Administrador',
  2: 'Vendedor',
  3: 'Cliente',
}

export function useAdminUserDetailPage() {
  const { id } = useParams() as { id: string }
  const router  = useRouter()
  const userId  = Number(id)

  const { data: user, isLoading } = useAdminUser(userId)

  const profileName = user ? (PROFILE_NAMES[user.profile_id] ?? '-') : '-'

  const goBack = useCallback(() => router.back(), [router])

  return {
    user,
    isLoading,
    profileName,
    goBack,
  }
}
