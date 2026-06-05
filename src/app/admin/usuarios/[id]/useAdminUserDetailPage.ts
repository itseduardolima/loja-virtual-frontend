'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
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

  const { data: user, isLoading, isError, error, refetch } = useAdminUser(userId)

  const profileName = user ? (PROFILE_NAMES[user.profile_id] ?? '-') : '-'

  const goBack = useCallback(() => router.back(), [router])

  const userNotFound =
    !isLoading && isError && (error as AxiosError)?.response?.status === 404

  return {
    user,
    isLoading,
    isError,
    refetch,
    userNotFound,
    profileName,
    goBack,
  }
}
